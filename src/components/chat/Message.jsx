import React, { useState } from "react"
import { Bot, User, Copy, Check, AlertCircle, Volume2, VolumeX } from "lucide-react"
import { motion } from "framer-motion"
import { useVoiceChat } from "../../hooks/useVoiceChat"

const Message = ({ message }) => {
  const isAI = message.from === "ai"
  const isSystem = message.from === "system"
  const isTyping = message.isTyping
  const [copied, setCopied] = useState(false)
  
  const { speakText, stopSpeech, isPlaying, currentPlayingId, playMessage } = useVoiceChat()

  // Generate a unique ID for this message if none exists
  const messageId = message.id || message.timestamp || `msg-${Date.now()}-${Math.random()}`

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

  const handleVoiceToggle = () => {
    // If this message is currently playing, stop it
    if (currentPlayingId === messageId) {
      stopSpeech()
    } else {
      // Otherwise, play this message
      playMessage({ ...message, id: messageId })
    }
  }

  // Check if this specific message is currently playing
  const isThisMessagePlaying = currentPlayingId === messageId

  if (isSystem) {
    return (
      <motion.div
        className="flex justify-center my-2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
      >
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 text-xs px-3 py-1.5 rounded-full shadow-sm border border-amber-200 font-medium">
          {message.content}
        </div>
      </motion.div>
    )
  }

  if (isTyping) {
    return (
      <motion.div
        className="flex justify-start mb-2"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        <div className="flex flex-row items-end gap-2 max-w-[90%] group">
          <div className="w-6 h-6 rounded-full grid place-items-center flex-shrink-0 shadow bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <Bot className="h-3 w-3" />
          </div>

          <div className="rounded-lg px-4 py-3 bg-white text-gray-800 border border-gray-200 shadow-sm">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.15,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
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
      className={`flex ${isAI ? "justify-start" : "justify-end"} mb-2`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div className={`flex ${isAI ? "flex-row" : "flex-row-reverse"} items-end gap-1.5 max-w-[90%] group`}>
        {/* Avatar */}
        <div
          className={`w-6 h-6 rounded-full grid place-items-center flex-shrink-0 shadow ${
            isAI ? "bg-gradient-to-br from-blue-500 to-indigo-600" : "bg-gradient-to-br from-green-500 to-emerald-600"
          } text-white`}
        >
          {isAI ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
        </div>

        {/* Message Bubble */}
        <div
          className={`rounded-lg px-3 py-2.5 max-w-full relative shadow-sm border transition-all ${
            isAI
              ? "bg-white text-gray-800 border-gray-200 hover:shadow hover:border-blue-300"
              : "bg-gradient-to-br from-green-500 to-emerald-600 text-white border-green-600 hover:shadow"
          }`}
        >
          {/* Message Content */}
          <div className="text-xs leading-relaxed whitespace-pre-wrap break-words max-w-full">
            {formatContent(message.content)}
          </div>

          {/* Message Footer */}
          <div
            className={`text-[10px] mt-1.5 flex items-center justify-between gap-2 ${
              isAI ? "text-gray-400" : "text-green-100"
            }`}
          >
            <span>
              {message.timestamp
                ? new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </span>

            <div className="flex items-center gap-1">
              {/* Voice Playback for AI messages */}
              {isAI && (
                <motion.button
                  onClick={handleVoiceToggle}
                  className={`transition-all p-0.5 rounded active:scale-90 ${
                    isThisMessagePlaying 
                      ? "text-orange-600 bg-orange-100" 
                      : "opacity-0 group-hover:opacity-100 hover:bg-gray-200"
                  }`}
                  whileTap={{ scale: 0.9 }}
                  title={isThisMessagePlaying ? "Stop playing" : "Play message"}
                >
                  {isThisMessagePlaying ? (
                    <VolumeX className="w-3 h-3" />
                  ) : (
                    <Volume2 className="w-3 h-3" />
                  )}
                </motion.button>
              )}

              {isAI && (
                <motion.button
                  onClick={handleCopy}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-gray-200 rounded active:scale-90"
                  whileTap={{ scale: 0.9 }}
                  title="Copy message"
                >
                  {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                </motion.button>
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