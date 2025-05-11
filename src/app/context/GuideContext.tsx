'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define message types
export interface GuideMessage {
  text: string;
  type: 'info' | 'tip' | 'congrats';
}

// Define context type
interface GuideContextType {
  message: GuideMessage | null;
  showMessage: (message: GuideMessage) => void;
  clearMessage: () => void;
}

// Create context with default values
const GuideContext = createContext<GuideContextType>({
  message: null,
  showMessage: () => {},
  clearMessage: () => {},
});

// Custom hook to use the guide context
export const useGuide = () => useContext(GuideContext);

// Provider component
export const GuideProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<GuideMessage | null>(null);

  const showMessage = (newMessage: GuideMessage) => {
    setMessage(newMessage);
  };

  const clearMessage = () => {
    setMessage(null);
  };

  return (
    <GuideContext.Provider value={{ message, showMessage, clearMessage }}>
      {children}
    </GuideContext.Provider>
  );
};

export default GuideProvider; 