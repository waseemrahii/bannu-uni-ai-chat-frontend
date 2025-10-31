import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import Message from "./Message"
import MessageInput from "./MessageInput"
import ChatHeader from "./ChatHeader"
import ConversationSidebar from "./ConversationSidebar"
import { Bot, Sparkles, MessageSquare } from "lucide-react"
import { useChat } from "../../context/ChatContext"
import { motion } from "framer-motion"

const ChatWindow = () => {
  const { messages, isLoading, currentConversation, conversations } = useChat()
  const endRef = useRef(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const messagesContainerRef = useRef(null)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768)

  // Auto-scroll to latest message
  useEffect(() => {
    if (endRef.current && messagesContainerRef.current) {
      requestAnimationFrame(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" })
      })
    }
  }, [messages])

  // Handle resize (sidebar toggle logic)
  useEffect(() => {
    const handleResize = () => {
      const isNowDesktop = window.innerWidth >= 768
      setIsDesktop(isNowDesktop)
      setShowSidebar(isNowDesktop)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Memoized suggestions
  const suggestions = useMemo(
    () => [
      { icon: "📚", text: "What classes do I have today?" },
      { icon: "📅", text: "When is my next exam?" },
      { icon: "🎓", text: "Tell me about CS program requirements" },
      { icon: "🏆", text: "What events are happening this week?" },
      { icon: "📝", text: "Any upcoming assignments?" },
      { icon: "👨‍🏫", text: "Who are my professors this semester?" },
    ],
    []
  )

  const handleMenuClick = useCallback(() => {
    setShowSidebar((prev) => !prev)
  }, [])

  const handleCloseSidebar = useCallback(() => {
    if (!isDesktop) setShowSidebar(false)
  }, [isDesktop])

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <ConversationSidebar isOpen={showSidebar} onClose={handleCloseSidebar} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader onMenuClick={handleMenuClick} />

        <div className="flex-1 flex flex-col overflow-hidden">
          {messages.length === 0 && !currentConversation ? (
            // 🟢 Welcome Screen
            <motion.div
              className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8 bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Logo / Icon */}
              <motion.div
                className="relative mb-6"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
              >
                <div className="w-16 h-16 rounded-2xl  flex items-center justify-center shadow-lg">
                  {/* <Bot className="w-8 h-8 text-white" /> */}
                  <img
      src="/images/ustb-logo.png"
      alt="USTB Logo"
      className="mx-auto w-24 h-24 object-contain mb-4"
    />
                </div>
                {/* <motion.div
                  className="absolute -top-1 -right-1 bg-yellow-400 rounded-lg p-1.5 shadow-md"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </motion.div> */}
              </motion.div>

              {/* Heading */}
              <motion.h2
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                Hi there 👋
              </motion.h2>

              {/* Subtext */}
              <motion.p
                className="text-gray-600 text-sm max-w-md mx-auto mt-2 leading-relaxed"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                I’m your Computer Science Assistant. Ask me about schedules, events, or anything academic at USTB.
              </motion.p>

              {/* Suggestions */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-2xl mt-8"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {suggestions.map((s, idx) => (
                  <motion.button
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:border-blue-400 hover:bg-blue-50 transition-all shadow-sm hover:shadow-md text-left"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {s.icon} {s.text}
                  </motion.button>
                ))}
              </motion.div>

              {/* Hint / Footer */}
              <motion.div
                className="flex items-center gap-2 text-xs text-gray-500 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <MessageSquare className="w-3 h-3" />
                <span>Start a conversation below</span>
              </motion.div>
            </motion.div>
          ) : (
            // 🟢 Chat Messages
            <div
              className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 w-full bg-gradient-to-b from-slate-50/50 to-blue-50/30"
              ref={messagesContainerRef}
            >
              {messages.map((msg, i) => (
                <Message key={msg.messageId || msg._id || i} message={msg} />
              ))}
              <div ref={endRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200/80 shadow w-full">
          <div className="max-w-4xl mx-auto">
            <MessageInput />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatWindow
