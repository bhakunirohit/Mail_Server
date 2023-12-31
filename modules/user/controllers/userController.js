import User from "../../../models/User.js";
import { hash, compare } from "bcrypt";
import {
  messages,
  responseStatus,
  statusCode,
} from "../../../core/constant/constant.js";
import jwt from "jsonwebtoken";


// controller when user register
export const signupController = async (req, res) => {
  try {
    req.body.password = await hash(req.body.password, 10);
    const userEmail = await User.findOne({
      email: req.body.email,
    });
    
    // if mailId already exists
    if (userEmail ) {
      return res.status(statusCode.Bad_request).json({
        message: messages.userExists,
        Response: responseStatus.failure,
      });
    }

    await User.create(req.body);

    res
      .status(statusCode.Created)
      .json({ message: messages.register, Response: responseStatus.success });
  } catch (error) {
    console.log(error.message,"error");
    res.status(statusCode.Bad_request).json({
      messages: messages.registerError,
      ResponseStatus: responseStatus.failure,
    });
  }
};

// controller for login
export const loginController = async (req, res) => {
  try {
    const UsersData = await User.findOne({
      email: req.body.email,
    });

    // if users email doesnot exists return error
    if (!UsersData ) {
      return res.status(statusCode.Bad_request).json({
        message: messages.unauthorizedEmail,
        ResponseStatus: responseStatus.failure,
      });
    }

    const userId = UsersData._id.toHexString();
    // comparing user password for authoriztion
    const BoolPass = await compare(req.body.password, UsersData.password);

    // if correct password allow login and create jwt token
    if (BoolPass === true) {
      const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
        expiresIn: "24h",
      });

      // const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
      return res.status(statusCode.Created).json({
        message: messages.loginSuccess,
        ResponseStatus: responseStatus.success,
        jwToken: token,
        
      });
    }

    // if wrong password throw error
    else {
      return res.status(statusCode.Unauthorized).json({
        message: messages.UnauthorizedPassword,
        ResponseStatus: responseStatus.failure,
      });
    }
  } catch (error) {
    console.log(error.message,"error");
    res.status(statusCode.Bad_request).json({
      messages: messages.loginError,
      ResponseStatus: responseStatus.failure,
    });
  }
};

export const changePasswordController = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(userId, "iddd");
    const data = await User.findByIdAndUpdate(
      userId,
      { $set: { password: await hash(req.body.password, 10) } },
      { new: true }
    ).select({ name: 1, email: 1, plan: 1, _id: 0 });

    // case :- when i have correct token but the userId or user is removed from server afterwards
    if (!data) {
      res.status(statusCode.Bad_request).json({
        messages: messages.UnauthorizedUser,
        ResponseStatus: responseStatus.failure,
      });
    } else {
      res.status(statusCode.Created).json({
        message: messages.Changepassword,
        user: data,
        ResponseStatus: responseStatus.success,
      });
    }
  } catch (error) {
    console.log(error.message,"error");
    res.status(statusCode.Bad_request).json({
      messages:messages.changepasswordError,
      ResponseStatus: responseStatus.failure,
    });
  }
};

export const userUpdationController = async (req, res) => {
  try {
    const userId = req.userId;
    const updatedData = await User.findByIdAndUpdate(
      userId,
      { $set: { name: req.body.name, plan: req.body.plan } },
      { new: true }
    ).select({ name: 1, email: 1, plan: 1, _id: 0 });
    console.log(updatedData, "updateddd");

    if (!updatedData) {
      res.status(statusCode.Bad_request).json({
        messages: messages.UnauthorizedUser,
        ResponseStatus: responseStatus.failure,
      });
    } else {
      res.status(statusCode.Created, responseStatus.success).json({
        message: messages.updated,
        UpdatedData: updatedData,
        ResponseStatus: responseStatus.success,
      });
    }
  } catch (error) {
    console.log(error.message,"error");
    res.status(statusCode.Bad_request).json({
      messages:messages.updationError,
      ResponseStatus: responseStatus.failure,
    });
  }
};

