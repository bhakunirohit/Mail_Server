import mailCollection  from "../../../models/mailCollection";
import forwardCollection from "../../../models/forwardCollection";



// $project: {
//     subject: {
//       $cond: {
//         if: { $eq: { $size: "$messagesField" }, 0 },
//         then: "Cannot list subject as mail is deleted by you",
//         else: { $arrayElemAt: ["$messagesField.subject", 0] },
//       },
//     },


// const str = 'hello';
const str = "\"hello\"";
console.log(str);
