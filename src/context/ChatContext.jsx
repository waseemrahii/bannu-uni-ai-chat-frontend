import React, { createContext, useState, useContext, useEffect } from 'react';
import { socketService } from '../services/socket';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    socketService.connect();
    
    socketService.on('connect', () => {
      setIsConnected(true);
    });

    socketService.on('disconnect', () => {
      setIsConnected(false);
    });

    socketService.on('chat_message', (message) => {
      setMessages(prev => [...prev, message]);
      setIsLoading(false);
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const sendMessage = (message, userId) => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    socketService.emit('student_message', { userId, message });
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const value = {
    messages,
    sendMessage,
    clearMessages,
    isConnected,
    isLoading,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};