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
