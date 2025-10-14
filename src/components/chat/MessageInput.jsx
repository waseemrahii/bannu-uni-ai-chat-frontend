// // import { useState } from "react"
// // import { useChat } from "../../context/ChatContext"
// // import { useAuth } from "../../context/AuthContext"
// // import Button from "../ui/Button"
// // import { Send, CalendarDays, Megaphone, Building2, Paperclip, Smile, Mic } from "lucide-react"

// // const MessageInput = () => {
// //   const [message, setMessage] = useState("")
// //   const { sendMessage, isLoading } = useChat()
// //   const { user } = useAuth()

// //   const handleSubmit = (e) => {
// //     e.preventDefault()
// //     if (message.trim() && !isLoading) {
// //       sendMessage(message, user._id)
// //       setMessage("")
// //     }
// //   }

// //   const handleKeyPress = (e) => {
// //     if (e.key === "Enter" && !e.shiftKey) {
// //       e.preventDefault()
// //       handleSubmit(e)
// //     }
// //   }

// //   return (
// //     <div className="border-t border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-lg">
// //       <div className="max-w-4xl mx-auto p-4">
// //         <form onSubmit={handleSubmit} className="flex gap-3">
// //           {/* pill input group */}
// //           <div className="flex-1 flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-full shadow-sm focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-university-blue transition">
// //             <button
// //               type="button"
// //               title="Insert emoji"
// //               className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
// //               onClick={() => setMessage((m) => (m ? m + " 🙂" : "🙂 "))}
// //             >
// //               <Smile className="w-5 h-5" />
// //             </button>
// //             <button
// //               type="button"
// //               title="Attach"
// //               className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
// //               onClick={() => alert("Attachments coming soon")}
// //             >
// //               <Paperclip className="w-5 h-5" />
// //             </button>

// //             <input
// //               type="text"
// //               value={message}
// //               onChange={(e) => setMessage(e.target.value)}
// //               onKeyPress={handleKeyPress}
// //               placeholder="Type your message... (Ask about classes, exams, events)"
// //               disabled={isLoading}
// //               className="flex-1 bg-transparent outline-none placeholder:text-gray-400 disabled:text-gray-400"
// //             />

// //             <button
// //               type="button"
// //               title="Voice"
// //               className="hidden sm:inline-flex p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
// //               onClick={() => alert("Voice input coming soon")}
// //             >
// //               <Mic className="w-5 h-5" />
// //             </button>
// //           </div>

// //           {/* send */}
// //           <Button
// //             type="submit"
// //             disabled={!message.trim() || isLoading}
// //             className="px-4 sm:px-6 py-3.5 rounded-full shadow-md bg-blue-600"
// //           >
// //             <span className="inline-flex items-center gap-2">
// //               <Send className="w-4 h-4" />
// //               <span className="hidden sm:inline">{isLoading ? "Sending…" : "Send"}</span>
// //             </span>
// //           </Button>
// //         </form>

// //         <div className="flex flex-wrap gap-2 mt-3 text-xs">
// //           <span className="text-gray-500">Try:</span>
// //           <button
// //             onClick={() => setMessage("What are my classes tomorrow?")}
// //             className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-university-blue rounded-full hover:bg-blue-100 transition-colors"
// //           >
// //             <CalendarDays className="w-3.5 h-3.5" /> Classes tomorrow
// //           </button>
// //           <button
// //             onClick={() => setMessage("Is university open today?")}
// //             className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-university-blue rounded-full hover:bg-blue-100 transition-colors"
// //           >
// //             <Building2 className="w-3.5 h-3.5" /> University status
// //           </button>
// //           <button
// //             onClick={() => setMessage("Any events this week?")}
// //             className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-university-blue rounded-full hover:bg-blue-100 transition-colors"
// //           >
// //             <Megaphone className="w-3.5 h-3.5" /> Events
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default MessageInput



// import { useState } from "react"
// import { useChat } from "../../context/ChatContext"
// import { useAuth } from "../../context/AuthContext"
// import Button from "../ui/Button"
// import { Send, CalendarDays, Megaphone, Building2, Paperclip, Smile, Mic } from "lucide-react"

// const MessageInput = () => {
//   const [message, setMessage] = useState("")
//   const { sendMessage, isLoading } = useChat()
//   const { user } = useAuth()

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     if (message.trim() && !isLoading) {
//       sendMessage(message, user._id)
//       setMessage("")
//     }
//   }

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault()
//       handleSubmit(e)
//     }
//   }

//   return (
//     <div className="border-t border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-lg">
//       <div className="max-w-4xl mx-auto p-3 sm:p-4">
//         <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3">
//           {/* pill input group */}
//           <div className="flex-1 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-full shadow-sm focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-university-blue transition">
//             <button
//               type="button"
//               title="Insert emoji"
//               className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
//               onClick={() => setMessage((m) => (m ? m + " 🙂" : "🙂 "))}
//             >
//               <Smile className="w-5 h-5" />
//             </button>
//             <button
//               type="button"
//               title="Attach"
//               className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
//               onClick={() => alert("Attachments coming soon")}
//             >
//               <Paperclip className="w-5 h-5" />
//             </button>

//             <input
//               type="text"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Type your message... (Ask about classes, exams, events)"
//               disabled={isLoading}
//               className="flex-1 bg-transparent outline-none placeholder:text-gray-400 disabled:text-gray-400"
//             />

//             <button
//               type="button"
//               title="Voice"
//               className="hidden sm:inline-flex p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
//               onClick={() => alert("Voice input coming soon")}
//             >
//               <Mic className="w-5 h-5" />
//             </button>
//           </div>

//           {/* send */}
//           <Button
//             type="submit"
//             disabled={!message.trim() || isLoading}
//             className="px-4 sm:px-6 py-3.5 rounded-full shadow-md"
//           >
//             <span className="inline-flex items-center gap-2">
//               <Send className="w-4 h-4" />
//               <span className="hidden sm:inline">{isLoading ? "Sending…" : "Send"}</span>
//             </span>
//           </Button>
//         </form>

//         <div className="flex flex-wrap gap-2 mt-2 sm:mt-3 text-xs">
//           <span className="text-gray-500">Try:</span>
//           <button
//             onClick={() => setMessage("What are my classes tomorrow?")}
//             className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-university-blue rounded-full hover:bg-blue-100 transition-colors"
//           >
//             <CalendarDays className="w-3.5 h-3.5" /> Classes tomorrow
//           </button>
//           <button
//             onClick={() => setMessage("Is university open today?")}
//             className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-university-blue rounded-full hover:bg-blue-100 transition-colors"
//           >
//             <Building2 className="w-3.5 h-3.5" /> University status
//           </button>
//           <button
//             onClick={() => setMessage("Any events this week?")}
//             className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-university-blue rounded-full hover:bg-blue-100 transition-colors"
//           >
//             <Megaphone className="w-3.5 h-3.5" /> Events
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default MessageInput

import { useState } from "react"
import { useChat } from "../../context/ChatContext"
import { useAuth } from "../../context/AuthContext"
import { Send, Smile, Mic, Paperclip } from "lucide-react"

const MessageInput = () => {
  const [message, setMessage] = useState("")
  const { sendMessage, isLoading } = useChat()
  const { user } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      sendMessage(message, user._id)
      setMessage("")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#F0F0F0] border-t border-gray-300 px-2 sm:px-4 py-2 z-50">
      <form
        onSubmit={handleSubmit}
        className="flex items-center w-full gap-2 bg-white rounded-full shadow-md px-2 sm:px-4 py-2 overflow-hidden"
      >
        {/* Emoji */}
        <button
          type="button"
          className="p-2 rounded-full text-gray-600 hover:bg-gray-100 flex-shrink-0"
          onClick={() => setMessage((m) => m + ' 🙂')}
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Attachment */}
        <button
          type="button"
          className="p-2 rounded-full text-gray-600 hover:bg-gray-100 flex-shrink-0"
          onClick={() => alert('Attachment feature coming soon')}
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Input */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 bg-transparent outline-none text-gray-700 text-sm min-w-0"
        />

        {/* Right Action */}
        {message.trim() ? (
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white p-2.5 sm:px-4 sm:py-2.5 rounded-full shadow-md transition flex-shrink-0"
          >
            <Send className="w-5 h-5 sm:mr-1" />
            <span className="hidden sm:inline text-sm font-medium">
              {isLoading ? "Sending…" : "Send"}
            </span>
          </button>
        ) : (
          <button
            type="button"
            className="bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-full shadow-md transition flex-shrink-0"
            onClick={() => alert("Voice input coming soon")}
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
      </form>
    </div>
  )
}

export default MessageInput
