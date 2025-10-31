// context/ChatContext.js
import { createContext, useState, useContext, useEffect } from "react"
import api from "../services/api"
import { socketService } from "../services/socket"
import { useAuth } from "./AuthContext"

const ChatContext = createContext()

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}

export const ChatProvider = ({ children }) => {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [conversations, setConversations] = useState([])
  const [currentConversation, setCurrentConversation] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [typingUsers, setTypingUsers] = useState([])
  const [conversationsLoading, setConversationsLoading] = useState(false)

  useEffect(() => {
    if (user?._id) {
      fetchConversations()
    }
  }, [user?._id])

  useEffect(() => {
    socketService.connect()

    socketService.on("connect", () => {
      setIsConnected(true)
      console.log("[v0] Socket connected")
    })

    socketService.on("disconnect", () => {
      setIsConnected(false)
      console.log("[v0] Socket disconnected")
    })

    // socketService.on("chat_message", (message) => {
    //   setMessages((prev) => [
    //     ...prev,
    //     {
    //       ...message,
    //       timestamp: new Date(message.timestamp || Date.now()),
    //       from: "ai",
    //       status: "delivered",
    //     },
    //   ])
    //   setIsLoading(false)
    // })

    // In the socketService.on("chat_message") event handler, replace it with:
socketService.on("chat_message", (message) => {
  console.log("Received AI message:", message)
  
  setMessages((prev) => {
    // Remove any temporary typing messages and add the actual AI response
    const filtered = prev.filter(msg => 
      !msg.isTyping && !(msg.from === "ai" && msg.content === "...")
    )
    
    return [
      ...filtered,
      {
        ...message,
        timestamp: new Date(message.timestamp || Date.now()),
        from: "ai",
        status: "delivered",
      },
    ]
  })
  setIsLoading(false)
})

// Update the sendMessage function to add typing indicator:
const sendMessage = (messageText, userId) => {
  if (!messageText.trim() || !isConnected || !currentConversation?.conversationId) return

  const userMessage = {
    _id: `user-${Date.now()}`,
    messageId: `user-${Date.now()}`,
    content: messageText,
    from: "user",
    timestamp: new Date(),
    status: "sent",
    userId,
    conversationId: currentConversation?.conversationId,
  }

  // Add user message immediately
  setMessages((prev) => [...prev, userMessage])
  
  // Add typing indicator
  const typingMessage = {
    _id: `typing-${Date.now()}`,
    messageId: `typing-${Date.now()}`,
    content: "...",
    from: "ai",
    timestamp: new Date(),
    status: "typing",
    isTyping: true,
    conversationId: currentConversation?.conversationId,
  }
  
  setMessages((prev) => [...prev, typingMessage])
  setIsLoading(true)

  socketService.emit("student_message", {
    userId,
    message: messageText,
    conversationId: currentConversation?.conversationId,
  })
}

    socketService.on("user_typing", (data) => {
      setTypingUsers((prev) => [...new Set([...prev, data.userId])])
    })

    socketService.on("user_stopped_typing", (data) => {
      setTypingUsers((prev) => prev.filter((id) => id !== data.userId))
    })

    // Add this inside your socket useEffect in ChatContext.js
socketService.on("conversation_title_updated", (data) => {
  const { conversationId, title } = data
  console.log("Title updated via socket:", { conversationId, title })
  
  // Update in conversations list
  setConversations((prev) => 
    prev.map((c) => 
      c.conversationId === conversationId ? { ...c, title } : c
    )
  )
  
  // Update current conversation if active
  if (currentConversation?.conversationId === conversationId) {
    setCurrentConversation((prev) => ({ ...prev, title }))
  }
})

socketService.on("title_generated", (data) => {
  const { conversationId, title } = data
  console.log("Title generated via socket:", { conversationId, title })
  
  // Update conversations list
  setConversations((prev) => 
    prev.map((c) => 
      c.conversationId === conversationId ? { ...c, title } : c
    )
  )
  
  // Update current conversation if active
  if (currentConversation?.conversationId === conversationId) {
    setCurrentConversation((prev) => ({ ...prev, title }))
  }
})

    return () => {
      socketService.disconnect()
    }
  }, [])

  const fetchConversations = async () => {
    try {
      setConversationsLoading(true)
      const response = await api.get("/chat/conversations")
      setConversations(response.data.conversations || [])
    } catch (error) {
      console.error("[v0] Error fetching conversations:", error)
    } finally {
      setConversationsLoading(false)
    }
  }

  // FIXED: Use the correct API endpoint to load conversation messages
const loadConversation = async (conversationId) => {
  try {
    setIsLoading(true)
    setMessages([]) // Clear previous messages
    
    // Use the correct endpoint to get conversation thread
    const response = await api.get(`/chat/conversation/${conversationId}`)
    const thread = response.data.thread || []
    
    console.log("Loaded conversation thread:", thread) // Debug log
    
    // Transform the thread data to match our message format
    const formattedMessages = []
    
    thread.forEach(msg => {
      // Add user question as a message
      if (msg.question) {
        formattedMessages.push({
          _id: `${msg._id}_question`,
          messageId: `${msg._id}_question`,
          content: msg.question,
          from: 'user',
          timestamp: new Date(msg.createdAt || Date.now()),
          status: msg.status || 'delivered',
          conversationId: msg.conversationId,
          intent: msg.intent,
          metadata: msg.metadata
        })
      }
      
      // Add AI answer as a message
      if (msg.answer) {
        formattedMessages.push({
          _id: `${msg._id}_answer`,
          messageId: `${msg._id}_answer`,
          content: msg.answer,
          from: 'ai',
          timestamp: new Date(msg.updatedAt || msg.createdAt || Date.now()),
          status: msg.status || 'delivered',
          conversationId: msg.conversationId,
          sources: msg.sources || [],
          intent: msg.intent,
          metadata: msg.metadata,
          responseTime: msg.metadata?.responseTime
        })
      }
    })

    console.log("Formatted messages:", formattedMessages) // Debug log
    
    setMessages(formattedMessages)
    
    // Set current conversation with proper data
    const conversation = conversations.find(c => c.conversationId === conversationId)
    setCurrentConversation(conversation || { 
      conversationId, 
      title: thread[0]?.conversationTitle || 'Chat' 
    })
    
  } catch (error) {
    console.error("[v0] Error loading conversation:", error)
    throw error
  } finally {
    setIsLoading(false)
  }
}
const createConversation = async (title = "New Chat") => {
  try {
    const response = await api.post("/chat/conversations")
    const newConversation = response.data
    
    console.log("New conversation created:", newConversation) // Debug log
    
    // Add to conversations list
    setConversations((prev) => [newConversation, ...prev])
    
    // Set as current conversation with proper structure
    setCurrentConversation({
      conversationId: newConversation.conversationId,
      title: newConversation.title || "New Chat",
      ...newConversation
    })
    
    setMessages([]) // Clear messages for new conversation
    
    return newConversation
  } catch (error) {
    console.error("[v0] Error creating conversation:", error)
    throw error
  }
}

  const deleteConversation = async (conversationId) => {
    try {
      await api.delete(`/chat/conversations/${conversationId}`)
      
      // Remove from conversations list
      setConversations((prev) => prev.filter((c) => c.conversationId !== conversationId))
      
      // Clear if it was the current conversation
      if (currentConversation?.conversationId === conversationId) {
        setCurrentConversation(null)
        setMessages([])
      }
    } catch (error) {
      console.error("[v0] Error deleting conversation:", error)
      throw error
    }
  }

  const updateConversationTitle = async (conversationId, title) => {
    try {
      await api.put(`/chat/conversations/${conversationId}/title`, { title })
      
      // Update in conversations list
      setConversations((prev) => 
        prev.map((c) => 
          c.conversationId === conversationId ? { ...c, title } : c
        )
      )
      
      // Update current conversation if active
      if (currentConversation?.conversationId === conversationId) {
        setCurrentConversation((prev) => ({ ...prev, title }))
      }
    } catch (error) {
      console.error("[v0] Error updating conversation title:", error)
      throw error
    }
  }

  const sendMessage = (messageText, userId) => {
    if (!messageText.trim() || !isConnected) return

    const userMessage = {
      _id: Date.now().toString(),
      messageId: Date.now().toString(),
      content: messageText,
      from: "user",
      timestamp: new Date(),
      status: "sent",
      userId,
      conversationId: currentConversation?.conversationId,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    socketService.emit("student_message", {
      userId,
      message: messageText,
      conversationId: currentConversation?.conversationId,
    })
  }

  const clearMessages = () => {
    setMessages([])
  }

  const value = {
    messages,
    conversations,
    currentConversation,
    setCurrentConversation,
    sendMessage,
    clearMessages,
    isConnected,
    isLoading,
    typingUsers,
    loadConversation,
    createConversation,
    deleteConversation,
    updateConversationTitle,
    fetchConversations,
    conversationsLoading,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}