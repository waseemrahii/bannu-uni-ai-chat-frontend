// components/VoiceChatButton.jsx
import { useState, useEffect } from 'react';
import { Mic, Square, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceChat } from '../hooks/useVoiceChat';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

const VoiceChatButton = () => {
  const { sendMessage, currentConversation, messages } = useChat();
  const { user } = useAuth();
  const [autoPlay, setAutoPlay] = useState(true);
  
  const {
    isRecording,
    isPlaying,
    transcript,
    startRecording,
    stopRecording,
    speakText,
    stopSpeech
  } = useVoiceChat(sendMessage, currentConversation, user?._id);

  // Auto-play the latest AI response
  useEffect(() => {
    if (autoPlay && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.from === 'ai' && !lastMessage.playedAsVoice) {
        speakText(lastMessage.content);
        // Mark as played (you might want to add this to your message object)
        lastMessage.playedAsVoice = true;
      }
    }
  }, [messages, autoPlay, speakText]);

  const handleVoiceToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      stopSpeech();
    } else {
      // Play the last AI message
      const lastAIMessage = messages
        .slice()
        .reverse()
        .find(msg => msg.from === 'ai');
      
      if (lastAIMessage) {
        speakText(lastAIMessage.content);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Auto-play Toggle */}
      <button
        onClick={() => setAutoPlay(!autoPlay)}
        className={`text-xs px-2 py-1 rounded border ${
          autoPlay 
            ? 'bg-green-100 text-green-700 border-green-300' 
            : 'bg-gray-100 text-gray-600 border-gray-300'
        }`}
      >
        Auto-voice: {autoPlay ? 'ON' : 'OFF'}
      </button>

      {/* Voice Recording Button */}
      <motion.button
        onClick={handleVoiceToggle}
        disabled={!currentConversation}
        className={`
          relative p-3 rounded-full text-white shadow-lg transition-all
          ${isRecording 
            ? 'bg-red-500 hover:bg-red-600' 
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

      {/* Playback Button */}
      <motion.button
        onClick={handlePlayToggle}
        disabled={!currentConversation}
        className={`
          p-3 rounded-full text-white shadow-lg transition-all
          ${isPlaying 
            ? 'bg-orange-500 hover:bg-orange-600' 
            : 'bg-green-500 hover:bg-green-600'
          }
          ${!currentConversation ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        whileHover={{ scale: currentConversation ? 1.05 : 1 }}
        whileTap={{ scale: currentConversation ? 0.95 : 1 }}
      >
        {isPlaying ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </motion.button>

      {/* Transcript Display */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            className="absolute bottom-full mb-2 left-0 bg-gray-800 text-white text-sm rounded-lg px-3 py-2 max-w-xs shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div className="font-medium mb-1">You said:</div>
            <div>{transcript}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceChatButton;