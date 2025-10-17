
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
