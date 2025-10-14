
// import { useEffect, useRef } from "react"
// import { useChat } from "../../context/ChatContext"
// import Message from "./Message"
// import MessageInput from "./MessageInput"
// import ChatHeader from "./ChatHeader"
// import { Bot } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion" // animations

// const ChatWindow = () => {
//   const { messages, isLoading } = useChat()
//   const messagesEndRef = useRef(null)

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }

//   useEffect(() => {
//     scrollToBottom()
//   }, [messages])

//   const isNewDay = (i) => {
//     if (i === 0) return true
//     const a = new Date(messages[i]?.timestamp)
//     const b = new Date(messages[i - 1]?.timestamp)
//     return a.toDateString() !== b.toDateString()
//   }

//   return (
//     <div className="flex flex-col h-screen bg-gray-50">
//       <ChatHeader />

//       <div
//         className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gradient-to-b from-gray-50 to-blue-50/30"
//         style={{
//           backgroundImage: "radial-gradient(circle at 24px 24px, rgba(30,64,175,0.06) 1.5px, transparent 1.5px)",
//           backgroundSize: "32px 32px",
//         }}
//       >
//         {/* List container narrowed for better chat readability */}
//         <div className="max-w-3xl mx-auto space-y-4 pb-24" aria-live="polite">
//           {messages.length === 0 && (
//             <div className="text-center text-gray-600 mt-20">
//               <div className="mx-auto mb-4 flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 text-university-blue">
//                 <Bot className="h-8 w-8" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to USTB CS Assistant</h3>
//               <p className="text-sm text-gray-600 max-w-md mx-auto">
//                 Ask about classes, exams, events, or university information from the CS Department.
//               </p>
//             </div>
//           )}

//           <AnimatePresence initial={false}>
//             {messages.map((message, index) => (
//               <motion.div
//                 key={message.timestamp ?? index}
//                 initial={{ opacity: 0, y: 8, scale: 0.98 }}
//                 animate={{ opacity: 1, y: 0, scale: 1 }}
//                 exit={{ opacity: 0, y: -8, scale: 0.98 }}
//                 transition={{ duration: 0.18, ease: "easeOut" }}
//               >
//                 {isNewDay(index) && (
//                   <div className="flex items-center gap-3 my-6">
//                     <div className="h-px flex-1 bg-gray-200" />
//                     <span className="text-xs text-gray-500">
//                       {new Date(message.timestamp).toLocaleDateString(undefined, {
//                         weekday: "short",
//                         month: "short",
//                         day: "numeric",
//                       })}
//                     </span>
//                     <div className="h-px flex-1 bg-gray-200" />
//                   </div>
//                 )}
//                 <Message message={message} />
//               </motion.div>
//             ))}
//           </AnimatePresence>

//           {isLoading && (
//             <div className="flex justify-start" role="status" aria-label="Assistant typing">
//               <div className="bg-white/80 backdrop-blur-sm rounded-3xl px-5 py-3 max-w-xs shadow-md ring-1 ring-gray-100">
//                 <div className="flex items-center gap-1.5">
//                   <span className="w-1.5 h-1.5 bg-university-blue/50 rounded-full animate-bounce" />
//                   <span
//                     className="w-1.5 h-1.5 bg-university-blue/50 rounded-full animate-bounce"
//                     style={{ animationDelay: "120ms" }}
//                   />
//                   <span
//                     className="w-1.5 h-1.5 bg-university-blue/50 rounded-full animate-bounce"
//                     style={{ animationDelay: "240ms" }}
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           <div ref={messagesEndRef} />
//         </div>
//       </div>

//       <MessageInput />
//     </div>
//   )
// }

// export default ChatWindow



// import { useEffect, useRef } from "react"
// import { useChat } from "../../context/ChatContext"
// import Message from "./Message"
// import MessageInput from "./MessageInput"
// import ChatHeader from "./ChatHeader"
// import { Bot } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"

// const ChatWindow = () => {
//   const { messages, isLoading } = useChat()
//   const messagesEndRef = useRef(null)

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }

//   useEffect(() => {
//     scrollToBottom()
//   }, [messages])

//   const isNewDay = (i) => {
//     if (i === 0) return true
//     const a = new Date(messages[i]?.timestamp)
//     const b = new Date(messages[i - 1]?.timestamp)
//     return a.toDateString() !== b.toDateString()
//   }

//   return (
//     <div className="flex flex-col h-screen bg-gray-50">
//       <ChatHeader />
//       <div
//         className="flex-1 overflow-y-auto p-3 sm:p-6 bg-gradient-to-b from-gray-50 to-blue-50/30"
//         style={{
//           backgroundImage: "radial-gradient(circle at 24px 24px, rgba(30,64,175,0.06) 1.5px, transparent 1.5px)",
//           backgroundSize: "32px 32px",
//         }}
//       >
//         <div className="max-w-3xl mx-auto space-y-4 pb-28 sm:pb-24" aria-live="polite">
//           {messages.length === 0 && (
//             <div className="text-center text-gray-600 mt-14 sm:mt-20">
//               <div className="mx-auto mb-4 flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 text-university-blue">
//                 <Bot className="h-7 w-7 sm:h-8 sm:w-8" />
//               </div>
//               <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Welcome to BU CS Assistant</h3>
//               <p className="text-sm text-gray-600 max-w-md mx-auto">
//                 Ask about classes, exams, events, or university information from the CS Department.
//               </p>
//             </div>
//           )}

//           <AnimatePresence initial={false}>
//             {messages.map((message, index) => (
//               <motion.div
//                 key={message.timestamp ?? index}
//                 initial={{ opacity: 0, y: 8, scale: 0.98 }}
//                 animate={{ opacity: 1, y: 0, scale: 1 }}
//                 exit={{ opacity: 0, y: -8, scale: 0.98 }}
//                 transition={{ duration: 0.18, ease: "easeOut" }}
//               >
//                 {isNewDay(index) && (
//                   <div className="flex items-center gap-3 my-6">
//                     <div className="h-px flex-1 bg-gray-200" />
//                     <span className="text-xs text-gray-500">
//                       {new Date(message.timestamp).toLocaleDateString(undefined, {
//                         weekday: "short",
//                         month: "short",
//                         day: "numeric",
//                       })}
//                     </span>
//                     <div className="h-px flex-1 bg-gray-200" />
//                   </div>
//                 )}
//                 <Message message={message} />
//               </motion.div>
//             ))}
//           </AnimatePresence>

//           {isLoading && (
//             <div className="flex justify-start" role="status" aria-label="Assistant typing">
//               <div className="bg-white/80 backdrop-blur-sm rounded-3xl px-5 py-3 max-w-xs shadow-md ring-1 ring-gray-100">
//                 <div className="flex items-center gap-1.5">
//                   <span className="w-1.5 h-1.5 bg-university-blue/50 rounded-full animate-bounce" />
//                   <span
//                     className="w-1.5 h-1.5 bg-university-blue/50 rounded-full animate-bounce"
//                     style={{ animationDelay: "120ms" }}
//                   />
//                   <span
//                     className="w-1.5 h-1.5 bg-university-blue/50 rounded-full animate-bounce"
//                     style={{ animationDelay: "240ms" }}
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           <div ref={messagesEndRef} />
//         </div>
//       </div>
//       <MessageInput />
//     </div>
//   )
// }

// export default ChatWindow

import React, { useEffect, useRef } from "react"
import Message from "./Message"
import MessageInput from "./MessageInput"
import ChatHeader from "./ChatHeader"
import { Bot } from "lucide-react"
import { useChat } from "../../context/ChatContext"

const ChatWindow = () => {
  const { messages } = useChat()
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex flex-col h-screen relative">
      {/* Header */}
      <ChatHeader />

      {/* Messages area */}
      {messages.length === 0 ? (
        // 🟢 First-time welcome screen
        <div
          className="flex-1 overflow-y-auto p-3 sm:p-6 bg-gradient-to-b from-gray-50 to-blue-50/30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 24px 24px, rgba(30,64,175,0.06) 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }}
        >
          <div
            className="max-w-3xl mx-auto space-y-4 pb-28 sm:pb-24 flex flex-col items-center justify-center h-full"
            aria-live="polite"
          >
            <div className="text-center text-gray-600 mt-14 sm:mt-20">
              <div className="mx-auto mb-4 flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 text-university-blue shadow-sm">
                <Bot className="h-7 w-7 sm:h-8 sm:w-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Welcome to BU CS Assistant
              </h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Ask about classes, exams, events, or any university information related to the CS Department.
              </p>
            </div>
          </div>
        </div>
      ) : (
        // 🟢 Chat content after messages exist
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 bg-[#ECE5DD]/80">
          {messages.map((msg, index) => (
            <Message key={index} message={msg} />
          ))}
          <div ref={endRef} />
        </div>
      )}

      {/* Input Area */}
      <MessageInput />
    </div>
  )
}

export default ChatWindow
