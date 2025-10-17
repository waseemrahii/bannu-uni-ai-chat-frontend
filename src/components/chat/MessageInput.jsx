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
