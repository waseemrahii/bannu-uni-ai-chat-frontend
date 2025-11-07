// src/hooks/useVoiceInput.js

import { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export const useVoiceInput = () => {
  const [isListening, setIsListening] = useState(false);
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  // Start listening
  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ 
      continuous: true,
      language: 'en-US'
    });
    setIsListening(true);
  };

  // Stop listening
  const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
    return transcript;
  };

  // Toggle listening state
  const toggleListening = () => {
    if (isListening) {
      return stopListening();
    } else {
      startListening();
      return '';
    }
  };

  return {
    transcript,
    isListening: listening,
    isSupported: browserSupportsSpeechRecognition,
    isMicAvailable: isMicrophoneAvailable,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript
  };
};