'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useGuide } from '../context/GuideContext';

const GuideAvatar: React.FC = () => {
  const { message, clearMessage } = useGuide();
  const [isHovered, setIsHovered] = useState(false);

  // Close the message bubble
  const handleCloseMessage = () => {
    clearMessage();
  };

  // Show the message bubble on avatar hover if there's no message already showing
  const handleAvatarHover = () => {
    setIsHovered(true);
  };

  // Hide the default message when mouse leaves
  const handleAvatarLeave = () => {
    setIsHovered(false);
  };

  // Default message when hovering with no active message
  const defaultMessage = {
    text: '¡Hola! Soy tu guía en este viaje estelar. ¿En qué puedo ayudarte?',
    type: 'info'
  };

  // Choose background color based on message type
  const getBubbleColor = (type: string) => {
    switch (type) {
      case 'tip':
        return 'bg-blue-600/80';
      case 'congrats':
        return 'bg-green-600/80';
      case 'info':
      default:
        return 'bg-indigo-600/80';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Message bubble */}
      {(message || isHovered) && (
        <div 
          className={`${getBubbleColor(message ? message.type : defaultMessage.type)} p-4 rounded-xl mb-3 max-w-xs backdrop-blur-sm border border-white/20 text-white shadow-lg animate-fadeInUp`}
        >
          <p className="text-sm">
            {message ? message.text : defaultMessage.text}
          </p>
          {message && (
            <button 
              onClick={handleCloseMessage}
              className="absolute top-2 right-2 text-white/70 hover:text-white"
              aria-label="Cerrar mensaje"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          <div className="absolute bottom-[-6px] right-4 w-3 h-3 rotate-45 bg-inherit"></div>
        </div>
      )}

      {/* Avatar image */}
      <div 
        className="w-16 h-16 rounded-full bg-indigo-900/50 backdrop-blur-sm border-2 border-indigo-500/50 shadow-lg cursor-pointer hover:scale-105 transition-transform flex items-center justify-center overflow-hidden animate-float"
        onMouseEnter={handleAvatarHover}
        onMouseLeave={handleAvatarLeave}
      >
        <Image 
          src="/assets/logo.svg" 
          alt="Guía virtual - Órbita" 
          width={48} 
          height={48} 
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default GuideAvatar; 