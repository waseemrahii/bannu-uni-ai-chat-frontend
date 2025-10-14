// import React from "react"
// import { Bot, User } from "lucide-react"
// import { motion } from "framer-motion"

// const Message = ({ message }) => {
//   const isAI = message.from === "ai"
//   const isSystem = message.from === "system"

//   const formatContent = (content) => {
//     return content.split("<br>").map((line, index) => (
//       <React.Fragment key={index}>
//         {line}
//         {index < content.split("<br>").length - 1 && <br />}
//       </React.Fragment>
//     ))
//   }

//   if (isSystem) {
//     return (
//       <div className="flex justify-center">
//         <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-full text-sm shadow-sm">
//           {message.content}
//         </div>
//       </div>
//     )
//   }

//   return (
//     <motion.div
//       className={`flex ${isAI ? "justify-start" : "justify-end"} mb-4`}
//       initial={{ opacity: 0, y: 6, scale: 0.99 }}
//       animate={{ opacity: 1, y: 0, scale: 1 }}
//       transition={{ duration: 0.16 }}
//     >
//       <div className={`flex ${isAI ? "flex-row" : "flex-row-reverse"} items-end gap-2 max-w-[85%] sm:max-w-[70%]`}>
//         <div
//           className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
//             isAI
//               ? "bg-blue-600"
//               : "bg-gradient-to-br from-green-500 to-green-600"
//           }`}
//           aria-hidden="true"
//         >
//           {isAI ? <Bot className="h-4 w-4 text-white" /> : <User className="h-4 w-4 text-white" />}
//         </div>

//         <div
//           className={`rounded-3xl px-5 py-3 ${
//             isAI
//               ? "bg-white text-gray-800 shadow-md ring-1 ring-gray-100"
//               : "bg-blue-500 text-white shadow-md ring-1 ring-blue-500/20"
//           }`}
//         >
//           <div className="text-sm leading-relaxed break-words whitespace-pre-wrap text-pretty">
//             {formatContent(message.content)}
//           </div>
//           <div className={`text-[11px] mt-1.5 ${isAI ? "text-gray-400" : "text-blue-100/90"}`}>
//             {new Date(message.timestamp).toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             })}
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// export default Message



// import React from "react"
// import { Bot, User } from "lucide-react"
// import { motion } from "framer-motion"

// const Message = ({ message }) => {
//   const isAI = message.from === "ai"
//   const isSystem = message.from === "system"

//   const formatContent = (content) => {
//     return content.split("<br>").map((line, index) => (
//       <React.Fragment key={index}>
//         {line}
//         {index < content.split("<br>").length - 1 && <br />}
//       </React.Fragment>
//     ))
//   }

//   if (isSystem) {
//     return (
//       <div className="flex justify-center">
//         <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-full text-sm shadow-sm">
//           {message.content}
//         </div>
//       </div>
//     )
//   }

//   return (
//     <motion.div
//       className={`flex ${isAI ? "justify-start" : "justify-end"} mb-3 sm:mb-4`}
//       initial={{ opacity: 0, y: 6, scale: 0.99 }}
//       animate={{ opacity: 1, y: 0, scale: 1 }}
//       transition={{ duration: 0.16 }}
//     >
//       <div className={`flex ${isAI ? "flex-row" : "flex-row-reverse"} items-end gap-2 max-w-[88%] sm:max-w-[72%]`}>
//         <div
//           className={`flex-shrink-0 w-8 h-8 rounded-full grid place-items-center shadow-sm ${
//             isAI
//               ? "bg-gradient-to-br from-university-blue to-blue-600"
//               : "bg-gradient-to-br from-green-500 to-green-600"
//           }`}
//           aria-hidden="true"
//         >
//           {isAI ? <Bot className="h-4 w-4 text-white" /> : <User className="h-4 w-4 text-white" />}
//         </div>

//         <div
//           className={`rounded-3xl px-4 sm:px-5 py-2.5 sm:py-3 ${
//             isAI
//               ? "bg-white text-gray-800 shadow-md ring-1 ring-gray-100"
//               : "bg-gradient-to-br from-university-blue to-blue-600 text-white shadow-md ring-1 ring-blue-500/20"
//           }`}
//         >
//           <div className="text-sm leading-relaxed break-words whitespace-pre-wrap text-pretty">
//             {formatContent(message.content)}
//           </div>
//           <div className={`text-[11px] mt-1.5 ${isAI ? "text-gray-400" : "text-blue-100/90"}`}>
//             {new Date(message.timestamp).toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             })}
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// export default Message

import React from "react"
import { Bot, User } from "lucide-react"
import { motion } from "framer-motion"

const Message = ({ message }) => {
  const isAI = message.from === "ai"
  const isSystem = message.from === "system"

  const formatContent = (content) =>
    content.split("<br>").map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < content.split("<br>").length - 1 && <br />}
      </React.Fragment>
    ))

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full shadow-sm">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className={`flex ${isAI ? "justify-start" : "justify-end"} mb-2 sm:mb-3`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div className={`flex ${isAI ? "flex-row" : "flex-row-reverse"} items-end gap-2`}>
        {/* avatar */}
        <div
          className={`w-8 h-8 rounded-full grid place-items-center ${
            isAI ? "bg-green-500/90" : "bg-gray-400"
          } text-white shadow`}
        >
          {isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
        </div>

        {/* bubble */}
        <div
          className={`rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 max-w-[80%] text-sm relative shadow ${
            isAI
              ? "bg-white text-gray-800 border border-gray-200"
              : "bg-[#DCF8C6] text-gray-900"
          }`}
        >
          {formatContent(message.content)}

          <div
            className={`text-[10px] mt-1 text-right ${
              isAI ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Message
