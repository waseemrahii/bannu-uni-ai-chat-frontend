import { useState, useEffect } from "react"
import { Plus, Trash2, MessageSquare, Loader, Edit2, Check, X, Search, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useChat } from "../../context/ChatContext"

const ConversationSidebar = ({ isOpen, onClose }) => {
  const {
    conversations,
    currentConversation,
    loadConversation,
    createConversation,
    deleteConversation,
    updateConversationTitle,
    conversationsLoading,
  } = useChat()

  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editingTitle, setEditingTitle] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const handleSelectConversation = async (conversation) => {
    await loadConversation(conversation.conversationId)
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleNewConversation = async () => {
    setIsCreating(true)
    try {
      await createConversation("New Chat")
    } finally {
      setIsCreating(false)
    }
  }

  const handleDelete = (e, conversationId) => {
    e.stopPropagation()
    if (window.confirm("Are you sure you want to delete this conversation?")) {
      deleteConversation(conversationId)
    }
  }

  const handleEditTitle = (e, conversation) => {
    e.stopPropagation()
    setEditingId(conversation.conversationId)
    setEditingTitle(conversation.title || "New Chat")
  }

  const handleSaveTitle = async (conversationId) => {
    if (editingTitle.trim()) {
      await updateConversationTitle(conversationId, editingTitle)
    }
    setEditingId(null)
    setEditingTitle("")
  }

  const cancelEditing = (e) => {
    e?.stopPropagation()
    setEditingId(null)
    setEditingTitle("")
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays}d`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const truncateText = (text, maxLength = 35) => {
    if (!text) return ""
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={isDesktop ? { x: 0 } : { x: -280 }}
        animate={isOpen || isDesktop ? { x: 0 } : { x: -280 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed md:static inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-r border-slate-800/50 flex flex-col md:shadow-none shadow-2xl"
      >
        {/* Header with New Chat */}
        <div className="p-3 border-b border-slate-800/50">
          <motion.button
            onClick={handleNewConversation}
            disabled={isCreating}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 px-3 py-2.5 text-sm font-semibold text-white transition-all shadow-md hover:shadow-lg active:scale-95"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isCreating ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            <span className="text-xs">New Chat</span>
          </motion.button>

          <div className="mt-3">
            {!showSearch ? (
              <motion.button
                onClick={() => setShowSearch(true)}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 px-3 py-2.5 text-slate-400 hover:text-slate-300 transition-all"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="text-xs">Search</span>
              </motion.button>
            ) : (
              <motion.div
                className="flex items-center gap-1"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <input
                  autoFocus
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                />
                <motion.button
                  onClick={() => {
                    setShowSearch(false)
                    setSearchTerm("")
                  }}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-3.5 h-3.5 text-slate-400" />
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {conversationsLoading ? (
            <motion.div
              className="flex flex-col items-center justify-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Loader className="w-5 h-5 text-slate-600 mb-2 animate-spin" />
              <p className="text-xs text-slate-400 font-medium">Loading...</p>
            </motion.div>
          ) : filteredConversations.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center py-8 px-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <MessageSquare className="w-8 h-8 text-slate-700 mb-2" />
              <p className="text-xs text-slate-400 font-medium">{searchTerm ? "No results" : "No chats yet"}</p>
            </motion.div>
          ) : (
            filteredConversations.map((conv, index) => (
              <motion.div
                key={conv.conversationId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
              >
                {/* {editingId === conv.conversationId ? (
                  <div className="flex items-center gap-1 rounded-lg p-2 bg-slate-700/50 border border-blue-400/50">
                    <input
                      autoFocus
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="flex-1 bg-slate-800 text-slate-100 text-xs rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveTitle(conv.conversationId)
                        if (e.key === "Escape") cancelEditing()
                      }}
                    />
                    <motion.button
                      onClick={() => handleSaveTitle(conv.conversationId)}
                      whileTap={{ scale: 0.9 }}
                      className="p-1.5 hover:bg-green-500/20 rounded transition"
                    >
                      <Check className="w-3 h-3 text-green-400" />
                    </motion.button>
                    <motion.button
                      onClick={cancelEditing}
                      whileTap={{ scale: 0.9 }}
                      className="p-1.5 hover:bg-red-500/20 rounded transition"
                    >
                      <X className="w-3 h-3 text-red-400" />
                    </motion.button>
                  </div>
                ) : ( */}
                  <motion.button
                    onClick={() => handleSelectConversation(conv)}
                    className={`w-full flex  items-center gap-2 rounded-lg p-2.5 transition-all text-left group text-xs ${
                      currentConversation?.conversationId === conv.conversationId
                        ? "bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border border-blue-500/50"
                        : "hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50"
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        currentConversation?.conversationId === conv.conversationId
                          ? "bg-blue-600/30 text-blue-300"
                          : "bg-slate-800/50 text-slate-400"
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* <p
                        className={`text-xs font-medium truncate ${
                          currentConversation?.conversationId === conv.conversationId
                            ? "text-blue-200"
                            : "text-slate-300"
                        }`}
                      >
                        {truncateText(conv.title || "New Chat", 20)}
                      </p> */}
                      <p className="text-[11px] text-slate-300 truncate">{truncateText(conv.lastMessage, 25)}</p>
                      {/* <div className="flex items-center gap-1 text-[10px] text-slate-600 mt-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{formatDate(conv.updatedAt || conv.createdAt)}</span>
                      </div> */}
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        onClick={(e) => handleEditTitle(e, conv)}
                        className="p-1.5 hover:bg-blue-500/20 rounded transition"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit2 className="w-2.5 h-2.5 text-blue-400" />
                      </motion.button>
                      <motion.button
                        onClick={(e) => handleDelete(e, conv.conversationId)}
                        className="p-1.5 hover:bg-red-500/20 rounded transition"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-2.5 h-2.5 text-red-400" />
                      </motion.button>
                    </div>
                  </motion.button>
                {/* )} */}
              </motion.div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800/50 bg-slate-950/80 p-3 text-xs">
          <p className="text-slate-400 font-semibold">CS Assistant</p>
          <p className="text-slate-600">v1.0</p>
        </div>
      </motion.div>
    </>
  )
}

export default ConversationSidebar
