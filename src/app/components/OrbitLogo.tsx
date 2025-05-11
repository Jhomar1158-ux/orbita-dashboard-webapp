'use client';

import React from 'react';
import Image from 'next/image';

interface OrbitLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const OrbitLogo: React.FC<OrbitLogoProps> = ({ 
  className = '',
  width = 120,
  height = 60
}) => {
  return (
    <div className={`relative ${className}`}>
      <Image 
        src="/assets/orbita.svg" 
        alt="Órbita Logo" 
        width={width} 
        height={height}
        className="object-contain"
      />
    </div>
  );
};

export default OrbitLogo; 