

// // components/MessageInput.jsx  vioce recording 
import { useState, useCallback, useEffect } from "react"
import { useChat } from "../../context/ChatContext"
import { useAuth } from "../../context/AuthContext"
import { Send, Smile, Plus, Mic, Square, Volume2, VolumeX } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useVoiceChat } from "../../hooks/useVoiceChat"

const MessageInput = () => {
  const [message, setMessage] = useState("")
  const { sendMessage, isLoading, isConnected, currentConversation } = useChat()
  const { user } = useAuth()
  const [showEmojis, setShowEmojis] = useState(false)
  
  // Voice chat hook
  const {
    isRecording,
    isPlaying,
    transcript,
    autoPlay,
    startRecording,
    stopRecording,
    stopSpeech,
    toggleAutoPlay
  } = useVoiceChat()

  // Update message when voice transcript changes
  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      if (message.trim() && !isLoading && isConnected && currentConversation?.conversationId) {
        sendMessage(message, user?._id)
        setMessage("")
        setShowEmojis(false)
      }
    },
    [message, isLoading, isConnected, currentConversation, user, sendMessage],
  )

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey && !isLoading) {
        e.preventDefault()
        handleSubmit(e)
      }
    },
    [isLoading, handleSubmit],
  )

  const handleVoiceToggle = async () => {
    try {
      if (isRecording) {
        // Stop recording
        stopRecording();
      } else {
        // Start recording
        await startRecording();
      }
    } catch (error) {
      console.error('Voice toggle error:', error);
      alert(error.message || 'Voice recording failed. Please check microphone permissions.');
    }
  }

  const handlePlayToggle = () => {
    if (isPlaying) {
      stopSpeech();
    }
    // Play toggle is now handled in individual messages
  }

  const emojis = ["😊", "👍", "❤️", "😂", "🎉", "🤔", "👏", "🚀", "💯", "👌", "🔥", "⭐"]

  const isDisabled = !currentConversation?.conversationId || isLoading || !isConnected || !message.trim()

  return (
    <div className="w-full px-4 sm:px-6 py-2.5 space-y-2 border-t border-gray-200/50 bg-white">
      {/* Voice Controls */}
      <div className="flex items-center justify-center gap-3">
        {/* Auto-play Toggle */}
        <motion.button
          onClick={toggleAutoPlay}
          className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border transition-all ${
            autoPlay 
              ? 'bg-green-100 text-green-700 border-green-300' 
              : 'bg-gray-100 text-gray-600 border-gray-300'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Volume2 className="w-3 h-3" />
          <span>Auto: {autoPlay ? 'ON' : 'OFF'}</span>
        </motion.button>

        {/* Voice Recording Button */}
        <motion.button
          onClick={handleVoiceToggle}
          disabled={!currentConversation || !isConnected}
          className={`
            relative p-3 rounded-full text-white shadow-lg transition-all
            ${isRecording 
              ? 'bg-red-500 hover:bg-red-600 scale-110' 
              : 'bg-blue-500 hover:bg-blue-600'
            }
            ${!currentConversation ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          whileHover={{ scale: currentConversation ? 1.05 : 1 }}
          whileTap={{ scale: currentConversation ? 0.95 : 1 }}
        >
          {/* Recording Animation */}
          {isRecording && (
            <motion.div
              className="absolute inset-0 rounded-full bg-red-400"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            />
          )}

          <div className="relative z-10">
            {isRecording ? (
              <Square className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </div>
        </motion.button>

        {/* Stop All Voice Button */}
        {(isPlaying || isRecording) && (
          <motion.button
            onClick={() => {
              if (isPlaying) stopSpeech();
              if (isRecording) stopRecording();
            }}
            className="p-3 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Stop all voice activity"
          >
            <Square className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      {/* Voice Status Indicators */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            className="bg-blue-50 border border-blue-200 text-blue-700 text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
          >
            <motion.div
              className="w-1.5 h-1.5 bg-blue-500 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            />
            <span className="font-medium">Listening... {transcript && `"${transcript}"`}</span>
            <button
              onClick={stopRecording}
              className="ml-auto text-blue-600 hover:text-blue-800 text-xs font-medium"
            >
              Stop
            </button>
          </motion.div>
        )}

        {isPlaying && (
          <motion.div
            className="bg-green-50 border border-green-200 text-green-700 text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
          >
            <motion.div
              className="w-1.5 h-1.5 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY }}
            />
            <span className="font-medium">AI is speaking...</span>
            <button
              onClick={stopSpeech}
              className="ml-auto text-green-600 hover:text-green-800 text-xs font-medium"
            >
              Stop
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojis && (
          <motion.div
            className="flex gap-1.5 flex-wrap bg-gray-50 p-2.5 rounded-lg border border-gray-200"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.12 }}
          >
            {emojis.map((emoji) => (
              <motion.button
                key={emoji}
                onClick={() => {
                  setMessage((m) => m + emoji)
                  setShowEmojis(false)
                }}
                className="text-base hover:scale-125 transition-transform cursor-pointer p-1"
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
              >
                {emoji}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Messages */}
      <AnimatePresence>
        {!isConnected && (
          <motion.div
            className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
          >
            <motion.div
              className="w-1.5 h-1.5 bg-red-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            />
            <span className="font-medium">Connecting...</span>
          </motion.div>
        )}

        {!currentConversation && (
          <motion.div
            className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
          >
            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
            <span className="font-medium">Select a chat to start</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Input Form */}
      <form
        onSubmit={handleSubmit}
        className={`flex items-center gap-1 bg-gray-50 rounded-lg shadow-sm border border-gray-200 px-3 py-2.5 transition-all focus-within:ring-1 focus-within:ring-blue-400 focus-within:ring-opacity-50 ${
          !currentConversation ? "opacity-50" : "hover:border-blue-300 hover:shadow"
        }`}
      >
        {/* Emoji Button */}
        <motion.button
          type="button"
          className="p-1.5 rounded-md text-gray-600 hover:bg-white hover:text-blue-600 transition-all flex-shrink-0 active:scale-90"
          onClick={() => setShowEmojis(!showEmojis)}
          title="Add emoji"
          disabled={!currentConversation}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Smile className="w-4 h-4" />
        </motion.button>

        {/* Attachment Button */}
        <motion.button
          type="button"
          className="p-1.5 rounded-md text-gray-600 hover:bg-white hover:text-blue-600 transition-all flex-shrink-0 active:scale-90"
          onClick={() => alert("Attachment feature coming soon")}
          title="Add attachment"
          disabled={!currentConversation}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4" />
        </motion.button>

        {/* Text Input */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            isRecording 
              ? "Speaking... (click Stop to finish)" 
              : currentConversation?.conversationId 
                ? "Type a message or click mic to speak..." 
                : "Select a conversation to chat..."
          }
          disabled={!currentConversation || !isConnected || isRecording}
          className="flex-1 bg-transparent outline-none text-gray-700 text-xs min-w-0 placeholder-gray-500 disabled:opacity-50"
        />

        {/* Send Button */}
        <AnimatePresence>
          {message.trim() && !isRecording && (
            <motion.button
              type="submit"
              disabled={isDisabled}
              className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white p-1.5 rounded-md shadow-sm transition-all flex-shrink-0 active:scale-90"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.12 }}
              whileHover={{ scale: isDisabled ? 1 : 1.05 }}
              whileTap={{ scale: isDisabled ? 1 : 0.95 }}
            >
              <Send className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </form>

      {/* Helper Text */}
      <p className="text-[9px] text-gray-500 text-center leading-tight">
        {isRecording 
          ? "Speak now... Click Stop when finished" 
          : "Enter to send • Click mic to speak • Auto-voice plays AI responses"
        }
      </p>
    </div>
  )
}

export default MessageInput



// //////////// spech

// import { useState, useCallback, useEffect } from "react"
// import { useChat } from "../../context/ChatContext"
// import { useAuth } from "../../context/AuthContext"
// import { Send, Smile, Plus, Mic, MicOff } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"
// import { useVoiceInput } from "../../hooks/useVoiceInput"

// const MessageInput = () => {
//   const [message, setMessage] = useState("")
//   const { sendMessage, isLoading, isConnected, currentConversation } = useChat()
//   const { user } = useAuth()
//   const [showEmojis, setShowEmojis] = useState(false)
  
//   // Voice input hook
//   const {
//     transcript,
//     isListening,
//     isSupported,
//     isMicAvailable,
//     toggleListening,
//     resetTranscript
//   } = useVoiceInput()

//   // Update message when voice transcript changes
//   useEffect(() => {
//     if (transcript) {
//       setMessage(transcript);
//     }
//   }, [transcript]);

//   const handleSubmit = useCallback(
//     (e) => {
//       e.preventDefault()
//       if (message.trim() && !isLoading && isConnected && currentConversation?.conversationId) {
//         sendMessage(message, user?._id)
//         setMessage("")
//         setShowEmojis(false)
//         // Reset voice transcript after sending
//         if (isListening) {
//           resetTranscript();
//         }
//       }
//     },
//     [message, isLoading, isConnected, currentConversation, user, sendMessage, isListening, resetTranscript],
//   )

//   const handleKeyPress = useCallback(
//     (e) => {
//       if (e.key === "Enter" && !e.shiftKey && !isLoading) {
//         e.preventDefault()
//         handleSubmit(e)
//       }
//     },
//     [isLoading, handleSubmit],
//   )

//   const handleVoiceToggle = () => {
//     if (!isSupported) {
//       alert("Speech recognition is not supported in your browser. Try Chrome or Edge.");
//       return;
//     }
    
//     if (!isMicAvailable) {
//       alert("Microphone is not available. Please check your permissions.");
//       return;
//     }

//     const currentTranscript = toggleListening();
//     if (!isListening && currentTranscript) {
//       setMessage(currentTranscript);
//     }
//   }

//   const emojis = ["😊", "👍", "❤️", "😂", "🎉", "🤔", "👏", "🚀", "💯", "👌", "🔥", "⭐"]

//   const isDisabled = !currentConversation?.conversationId || isLoading || !isConnected || !message.trim()

//   return (
//     <div className="w-full px-4 sm:px-6 py-2.5 space-y-2 border-t border-gray-200/50 bg-white">
//       {/* Voice Listening Indicator */}
//       <AnimatePresence>
//         {isListening && (
//           <motion.div
//             className="bg-blue-50 border border-blue-200 text-blue-700 text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5"
//             initial={{ opacity: 0, y: -4 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -4 }}
//             transition={{ duration: 0.12 }}
//           >
//             <motion.div
//               className="w-1.5 h-1.5 bg-blue-500 rounded-full"
//               animate={{ scale: [1, 1.5, 1] }}
//               transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
//             />
//             <span className="font-medium">Listening... {transcript && `"${transcript}"`}</span>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Emoji Picker */}
//       <AnimatePresence>
//         {showEmojis && (
//           <motion.div
//             className="flex gap-1.5 flex-wrap bg-gray-50 p-2.5 rounded-lg border border-gray-200"
//             initial={{ opacity: 0, y: -6 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -6 }}
//             transition={{ duration: 0.12 }}
//           >
//             {emojis.map((emoji) => (
//               <motion.button
//                 key={emoji}
//                 onClick={() => {
//                   setMessage((m) => m + emoji)
//                   setShowEmojis(false)
//                 }}
//                 className="text-base hover:scale-125 transition-transform cursor-pointer p-1"
//                 whileHover={{ scale: 1.3 }}
//                 whileTap={{ scale: 0.9 }}
//               >
//                 {emoji}
//               </motion.button>
//             ))}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Status Messages */}
//       <AnimatePresence>
//         {!isConnected && (
//           <motion.div
//             className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5"
//             initial={{ opacity: 0, y: -4 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -4 }}
//             transition={{ duration: 0.12 }}
//           >
//             <motion.div
//               className="w-1.5 h-1.5 bg-red-500 rounded-full"
//               animate={{ scale: [1, 1.2, 1] }}
//               transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
//             />
//             <span className="font-medium">Connecting...</span>
//           </motion.div>
//         )}

//         {!currentConversation && (
//           <motion.div
//             className="bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs px-3 py-1.5 rounded-md flex items-center gap-1.5"
//             initial={{ opacity: 0, y: -4 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -4 }}
//             transition={{ duration: 0.12 }}
//           >
//             <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
//             <span className="font-medium">Select a chat to start</span>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Message Input Form */}
//       <form
//         onSubmit={handleSubmit}
//         className={`flex items-center gap-1 bg-gray-50 rounded-lg shadow-sm border border-gray-200 px-3 py-2.5 transition-all focus-within:ring-1 focus-within:ring-blue-400 focus-within:ring-opacity-50 ${
//           !currentConversation ? "opacity-50" : "hover:border-blue-300 hover:shadow"
//         }`}
//       >
//         {/* Emoji Button */}
//         <motion.button
//           type="button"
//           className="p-1.5 rounded-md text-gray-600 hover:bg-white hover:text-blue-600 transition-all flex-shrink-0 active:scale-90"
//           onClick={() => setShowEmojis(!showEmojis)}
//           title="Add emoji"
//           disabled={!currentConversation}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <Smile className="w-4 h-4" />
//         </motion.button>

//         {/* Voice Input Button */}
//         {isSupported && (
//           <motion.button
//             type="button"
//             className={`p-1.5 rounded-md transition-all flex-shrink-0 active:scale-90 ${
//               isListening 
//                 ? "bg-red-100 text-red-600 hover:bg-red-200" 
//                 : "text-gray-600 hover:bg-white hover:text-blue-600"
//             }`}
//             onClick={handleVoiceToggle}
//             title={isListening ? "Stop listening" : "Start voice input"}
//             disabled={!currentConversation || !isMicAvailable}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
//           </motion.button>
//         )}

//         {/* Attachment Button */}
//         <motion.button
//           type="button"
//           className="p-1.5 rounded-md text-gray-600 hover:bg-white hover:text-blue-600 transition-all flex-shrink-0 active:scale-90"
//           onClick={() => alert("Attachment feature coming soon")}
//           title="Add attachment"
//           disabled={!currentConversation}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//         >
//           <Plus className="w-4 h-4" />
//         </motion.button>

//         {/* Text Input */}
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder={
//             isListening 
//               ? "Speaking..." 
//               : currentConversation?.conversationId 
//                 ? "Type a message or use voice..." 
//                 : "Select a conversation to chat..."
//           }
//           disabled={!currentConversation || !isConnected || isListening}
//           className="flex-1 bg-transparent outline-none text-gray-700 text-xs min-w-0 placeholder-gray-500 disabled:opacity-50"
//         />

//         {/* Send Button */}
//         <AnimatePresence>
//           {message.trim() && !isListening && (
//             <motion.button
//               type="submit"
//               disabled={isDisabled}
//               className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white p-1.5 rounded-md shadow-sm transition-all flex-shrink-0 active:scale-90"
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.8, opacity: 0 }}
//               transition={{ duration: 0.12 }}
//               whileHover={{ scale: isDisabled ? 1 : 1.05 }}
//               whileTap={{ scale: isDisabled ? 1 : 0.95 }}
//             >
//               <Send className="w-3.5 h-3.5" />
//             </motion.button>
//           )}
//         </AnimatePresence>
//       </form>

//       {/* Helper Text */}
//       <p className="text-[9px] text-gray-500 text-center leading-tight">
//         {isSupported 
//           ? "Enter to send • Click mic for voice • Shift+Enter for new line" 
//           : "Enter to send • Shift+Enter for new line"
//         }
//       </p>
//     </div>
//   )
// }

// export default MessageInput
