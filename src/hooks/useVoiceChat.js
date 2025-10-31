import { useState, useCallback, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';

export const useVoiceChat = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [autoPlay, setAutoPlay] = useState(true);
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  
  const { messages, currentConversation } = useChat();
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const lastAIMessageRef = useRef('');

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
      stopRecording();
    };
  }, []);

  // Auto-play new AI responses
  useEffect(() => {
    if (autoPlay && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      
      // Check if it's a new AI message that hasn't been played
      if (lastMessage.from === 'ai' && 
          lastMessage.content !== lastAIMessageRef.current &&
          !isPlaying &&
          currentConversation) {
        
        lastAIMessageRef.current = lastMessage.content;
        speakText(lastMessage.content, lastMessage.id || lastMessage.timestamp);
      }
    }
  }, [messages, autoPlay, isPlaying, currentConversation]);

  // Speech recognition using Web Speech API
  const startSpeechRecognition = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      let finalTranscript = '';

      recognition.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Update transcript in real-time
        const fullTranscript = finalTranscript + interimTranscript;
        setTranscript(fullTranscript.trim());
      };
      
      recognition.onend = () => {
        if (isRecording) {
          // If we're still supposed to be recording, restart (some browsers stop after silence)
          recognition.start();
        } else {
          resolve(finalTranscript.trim());
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          // No speech detected, continue listening
          return;
        }
        reject(new Error(`Speech recognition error: ${event.error}`));
      };
      
      recognition.start();
    });
  }, [isRecording]);

  // Start voice recording and recognition
  const startRecording = useCallback(async () => {
    try {
      // Stop any ongoing speech first
      stopSpeech();
      
      // Reset transcript
      setTranscript('');
      setIsRecording(true);
      
      // Start audio recording (optional - for future use)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true
        } 
      });
      
      streamRef.current = stream;
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.start(1000); // Collect data every second
      
      // Start speech recognition
      await startSpeechRecognition();
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
      
      if (error.name === 'NotAllowedError') {
        throw new Error('Microphone permission denied. Please allow microphone access.');
      } else if (error.name === 'NotFoundError') {
        throw new Error('No microphone found. Please check your device.');
      } else {
        throw error;
      }
    }
  }, [startSpeechRecognition]);

  // Stop recording
  const stopRecording = useCallback(() => {
    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    
    // Stop media recorder
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    
    // Stop stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setIsRecording(false);
    return transcript;
  }, [isRecording, transcript]);

  // Text-to-speech function
  const speakText = useCallback((text, messageId = null) => {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Text-to-speech not supported'));
        return;
      }

      // Stop any ongoing speech first
      stopSpeech();

      const utterance = new SpeechSynthesisUtterance(text);
      setCurrentPlayingId(messageId);
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentPlayingId(null);
        resolve();
      };
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsPlaying(false);
        setCurrentPlayingId(null);
        reject(new Error('Speech synthesis failed'));
      };
      
      // Configure voice settings
      const voices = speechSynthesis.getVoices();
      let preferredVoice = voices.find(voice => 
        voice.lang.includes('en') && voice.name.includes('Google')
      );
      
      if (!preferredVoice) {
        preferredVoice = voices.find(voice => 
          voice.lang.includes('en') && (voice.name.includes('Female') || voice.name.includes('Samantha'))
        );
      }
      
      if (!preferredVoice) {
        preferredVoice = voices.find(voice => voice.lang.includes('en')) || voices[0];
      }
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      speechSynthesis.speak(utterance);
    });
  }, []);

  // Stop speech playback
  const stopSpeech = useCallback(() => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setCurrentPlayingId(null);
  }, []);

  // Toggle auto-play
  const toggleAutoPlay = useCallback(() => {
    setAutoPlay(prev => !prev);
  }, []);

  // Play specific message
  const playMessage = useCallback((message) => {
    if (message && message.content) {
      // Stop current playback if playing the same message
      if (currentPlayingId === (message.id || message.timestamp)) {
        stopSpeech();
      } else {
        speakText(message.content, message.id || message.timestamp);
      }
    }
  }, [speakText, stopSpeech, currentPlayingId]);

  return {
    isRecording,
    isPlaying,
    transcript,
    autoPlay,
    currentPlayingId,
    startRecording,
    stopRecording,
    speakText,
    stopSpeech,
    toggleAutoPlay,
    playMessage,
    setTranscript
  };
};