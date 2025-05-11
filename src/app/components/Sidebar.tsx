'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const router = useRouter();

  const menuItems = [
    { id: 'tests', label: 'Exploración Espacial', icon: '🚀' },
    { id: 'progress', label: 'Progreso de Misión', icon: '📊' },
    { id: 'profile', label: 'Perfil de Explorador', icon: '👨‍🚀' },
    { id: 'todos', label: 'Tareas Pendientes', icon: '📝' },
  ];

  return (
    <div className="w-64 bg-slate-900/80 border-r border-indigo-500/20 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-indigo-500/20">
        <Link href="/dashboard" className="flex items-center">
          <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 overflow-hidden">
            <Image 
              src="/assets/órbita.svg" 
              alt="Órbita Logo" 
              width={40} 
              height={40} 
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">VocaSpacio</h1>
            <p className="text-blue-300 text-xs">Exploración Vocacional</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center p-3 rounded-lg transition-colors ${
              activeSection === item.id
                ? 'bg-indigo-700/30 text-white border border-indigo-500/50'
                : 'text-gray-400 hover:bg-slate-800/70 hover:text-gray-200'
            }`}
          >
            <span className="w-8 h-8 flex items-center justify-center mr-3 text-xl">
              {item.icon}
            </span>
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-indigo-500/20">
        <button
          onClick={() => router.push('/')}
          className="w-full flex items-center p-3 rounded-lg text-gray-400 hover:bg-slate-800/70 hover:text-gray-200 transition-colors"
        >
          <span className="w-8 h-8 flex items-center justify-center mr-3 text-xl">
            🚪
          </span>
          <span className="text-sm font-medium">Salir</span>
        </button>
      </div>
      
      {/* Version info */}
      <div className="p-4 text-center text-xs text-gray-500">
        <p>VocaSpacio v1.0</p>
        <p>Misión en curso</p>
      </div>
    </div>
  );
};

export default Sidebar; 