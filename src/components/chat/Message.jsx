// import React, { useState } from "react"
// import { Bot, User, Copy, Check, AlertCircle, Volume2, VolumeX } from "lucide-react"
// import { motion } from "framer-motion"
// import { useVoiceChat } from "../../hooks/useVoiceChat"

// const Message = ({ message }) => {
//   const isAI = message.from === "ai"
//   const isSystem = message.from === "system"
//   const isTyping = message.isTyping
//   const [copied, setCopied] = useState(false)
  
//   const { speakText, stopSpeech, isPlaying, currentPlayingId, playMessage } = useVoiceChat()

//   // Generate a unique ID for this message if none exists
//   const messageId = message.id || message.timestamp || `msg-${Date.now()}-${Math.random()}`

//   const formatContent = (content) => {
//     if (!content) return ''
//     return content.split("\n").map((line, i) => (
//       <React.Fragment key={i}>
//         {line}
//         {i < content.split("\n").length - 1 && <br />}
//       </React.Fragment>
//     ))
//   }

//   const handleCopy = () => {
//     navigator.clipboard.writeText(message.content)
//     setCopied(true)
//     setTimeout(() => setCopied(false), 2000)
//   }

//   const handleVoiceToggle = () => {
//     // If this message is currently playing, stop it
//     if (currentPlayingId === messageId) {
//       stopSpeech()
//     } else {
//       // Otherwise, play this message
//       playMessage({ ...message, id: messageId })
//     }
//   }

//   // Check if this specific message is currently playing
//   const isThisMessagePlaying = currentPlayingId === messageId

//   if (isSystem) {
//     return (
//       <motion.div
//         className="flex justify-center my-2"
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.15 }}
//       >
//         <div className="bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 text-xs px-3 py-1.5 rounded-full shadow-sm border border-amber-200 font-medium">
//           {message.content}
//         </div>
//       </motion.div>
//     )
//   }

//   if (isTyping) {
//     return (
//       <motion.div
//         className="flex justify-start mb-2"
//         initial={{ opacity: 0, y: 6 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.15 }}
//       >
//         <div className="flex flex-row items-end gap-2 max-w-[90%] group">
//           <div className="w-6 h-6 rounded-full grid place-items-center flex-shrink-0 shadow bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
//             <Bot className="h-3 w-3" />
//           </div>

//           <div className="rounded-lg px-4 py-3 bg-white text-gray-800 border border-gray-200 shadow-sm">
//             <div className="flex gap-1.5">
//               {[0, 1, 2].map((i) => (
//                 <motion.div
//                   key={i}
//                   className="w-2 h-2 bg-gray-400 rounded-full"
//                   animate={{ scale: [1, 1.2, 1] }}
//                   transition={{
//                     duration: 0.8,
//                     delay: i * 0.15,
//                     repeat: Number.POSITIVE_INFINITY,
//                     repeatType: "reverse",
//                   }}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     )
//   }

//   return (
//     <motion.div
//       className={`flex ${isAI ? "justify-start" : "justify-end"} mb-2`}
//       initial={{ opacity: 0, y: 6 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.15 }}
//     >
//       <div className={`flex ${isAI ? "flex-row" : "flex-row-reverse"} items-end gap-1.5 max-w-[90%] group`}>
//         {/* Avatar */}
//         <div
//           className={`w-6 h-6 rounded-full grid place-items-center flex-shrink-0 shadow ${
//             isAI ? "bg-gradient-to-br from-blue-500 to-indigo-600" : "bg-gradient-to-br from-green-500 to-emerald-600"
//           } text-white`}
//         >
//           {isAI ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
//         </div>

//         {/* Message Bubble */}
//         <div
//           className={`rounded-lg px-3 py-2.5 max-w-full relative shadow-sm border transition-all ${
//             isAI
//               ? "bg-white text-gray-800 border-gray-200 hover:shadow hover:border-blue-300"
//               : "bg-gradient-to-br from-green-500 to-emerald-600 text-white border-green-600 hover:shadow"
//           }`}
//         >
//           {/* Message Content */}
//           <div className="text-xs leading-relaxed whitespace-pre-wrap break-words max-w-full">
//             {formatContent(message.content)}
//           </div>

//           {/* Message Footer */}
//           <div
//             className={`text-[10px] mt-1.5 flex items-center justify-between gap-2 ${
//               isAI ? "text-gray-400" : "text-green-100"
//             }`}
//           >
//             <span>
//               {message.timestamp
//                 ? new Date(message.timestamp).toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })
//                 : ""}
//             </span>

//             <div className="flex items-center gap-1">
//               {/* Voice Playback for AI messages */}
//               {isAI && (
//                 <motion.button
//                   onClick={handleVoiceToggle}
//                   className={`transition-all p-0.5 rounded active:scale-90 ${
//                     isThisMessagePlaying 
//                       ? "text-orange-600 bg-orange-100" 
//                       : "opacity-0 group-hover:opacity-100 hover:bg-gray-200"
//                   }`}
//                   whileTap={{ scale: 0.9 }}
//                   title={isThisMessagePlaying ? "Stop playing" : "Play message"}
//                 >
//                   {isThisMessagePlaying ? (
//                     <VolumeX className="w-3 h-3" />
//                   ) : (
//                     <Volume2 className="w-3 h-3" />
//                   )}
//                 </motion.button>
//               )}

//               {isAI && (
//                 <motion.button
//                   onClick={handleCopy}
//                   className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-gray-200 rounded active:scale-90"
//                   whileTap={{ scale: 0.9 }}
//                   title="Copy message"
//                 >
//                   {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
//                 </motion.button>
//               )}

//               {!isAI && message.status && (
//                 <span title={message.status} className="text-[10px]">
//                   {message.status === "sent" && "✓"}
//                   {message.status === "delivered" && "✓✓"}
//                   {message.status === "failed" && <AlertCircle className="w-3 h-3 text-red-400" />}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   )
// }

// export default Message



import React from "react"
import { Bot, User, Copy, Check, AlertCircle, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

const Message = ({ message }) => {
  const isAI = message.from === "ai"
  const isSystem = message.from === "system"
  const isTyping = message.isTyping
  const [copied, setCopied] = React.useState(false)

  const formatContent = (content) => {
    if (!content) return ''
    return content.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < content.split("\n").length - 1 && <br />}
      </React.Fragment>
    ))
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Format sources for display
  const formatSources = (sources) => {
    if (!sources || !Array.isArray(sources) || sources.length === 0) return null

    return sources
      .filter(source => source && source.content && source.content.trim())
      .slice(0, 3)
      .map((source, index) => ({
        ...source,
        relevance: source.relevance || 0.5,
        content: source.content.length > 150 
          ? source.content.substring(0, 150) + '...' 
          : source.content
      }))
  }

  const displaySources = formatSources(message.sources)

  if (isSystem) {
    return (
      <motion.div
        className="flex justify-center my-3"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 text-xs px-4 py-2 rounded-full shadow-sm border border-amber-200 font-medium">
          {message.content}
        </div>
      </motion.div>
    )
  }

  // Typing indicator
  if (isTyping) {
    return (
      <motion.div
        className="flex justify-start mb-3"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex flex-row items-end gap-2 max-w-[90%] group">
          {/* Avatar */}
          <div className="w-6 h-6 rounded-full grid place-items-center flex-shrink-0 shadow bg-gradient-to-br from-blue-400 to-indigo-600 text-white">
            <Bot className="h-3 w-3" />
          </div>

          {/* Typing Bubble */}
          <div className="rounded-2xl px-4 py-3 bg-white text-gray-800 border border-gray-200 shadow">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 1,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`flex ${isAI ? "justify-start" : "justify-end"} mb-3`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`flex ${isAI ? "flex-row" : "flex-row-reverse"} items-end gap-2 max-w-[90%] group`}>
        {/* Avatar */}
        <div
          className={`w-6 h-6 rounded-full grid place-items-center flex-shrink-0 shadow ${
            isAI
              ? "bg-gradient-to-br from-blue-400 to-indigo-600"
              : "bg-gradient-to-br from-green-400 to-emerald-600"
          } text-white`}
        >
          {isAI ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
        </div>

        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-3 py-2 max-w-full relative shadow border transition-all ${
            isAI
              ? "bg-white text-gray-800 border-gray-200 hover:shadow-md hover:border-blue-300"
              : "bg-gradient-to-br from-green-400 to-emerald-500 text-white border-green-500 hover:shadow-md"
          }`}
        >
          {/* Message Content */}
          <div className="text-xs leading-relaxed whitespace-pre-wrap break-words">
            {formatContent(message.content)}
          </div>

          {/* Sources for AI messages */}
          {/* {isAI && displaySources && displaySources.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-1 font-medium">
                <ExternalLink className="w-3 h-3" />
                <span>Sources ({displaySources.length})</span>
              </div>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {displaySources.map((source, index) => (
                  <div 
                    key={index} 
                    className="text-[10px] bg-gray-50 rounded p-2 border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium capitalize text-gray-700">
                        {source.type || 'document'}
                      </span>
                      <span className="text-gray-400 text-[9px]">
                        {Math.round((source.relevance || 0.5) * 100)}% relevant
                      </span>
                    </div>
                    <div className="text-gray-600 line-clamp-2 leading-tight">
                      {source.content}
                    </div>
                    {source.metadata && source.metadata.sourceId && (
                      <div className="text-[9px] text-gray-400 mt-1">
                        ID: {source.metadata.sourceId.substring(0, 8)}...
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )} */}

          {/* Response time for AI messages */}
          {isAI && message.responseTime && (
            <div className="text-[9px] text-gray-400 mt-1">
              Response: {message.responseTime}ms
            </div>
          )}

          {/* Intent for AI messages */}
          {isAI && message.intent && (
            <div className={`text-[9px] mt-1 font-medium ${
              message.intent === "RAG_RESPONSE" ? "text-green-500" : "text-blue-500"
            }`}>
              {message.intent.replace(/_/g, ' ').toLowerCase()}
            </div>
          )}

          {/* Message Footer */}
          <div
            className={`text-[10px] mt-1 flex items-center justify-between gap-2 ${
              isAI ? "text-gray-400" : "text-green-100"
            }`}
          >
            <span>
              {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }) : ''}
            </span>

            <div className="flex items-center gap-1">
              {isAI && (
                <button
                  onClick={handleCopy}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-gray-200 rounded"
                  title="Copy message"
                >
                  {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                </button>
              )}

              {!isAI && message.status && (
                <span title={message.status} className="text-[10px]">
                  {message.status === "sent" && "✓"}
                  {message.status === "delivered" && "✓✓"}
                  {message.status === "failed" && <AlertCircle className="w-3 h-3 text-red-400" />}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Message