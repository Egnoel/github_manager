'use client';
import React, { useState } from 'react';
import {
  Github,
  TrendingUp,
  Settings,
  LogOut,
  Home,
  Code,
  Target,
  X,
} from 'lucide-react';
import Link from 'next/link';
const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  return (
    <div
      className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white p-6 flex flex-col h-full justify-between transform transition-transform duration-300 ${
        isMobileMenuOpen
          ? 'translate-x-0'
          : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Github size={32} />
          <span className="text-xl font-bold">GitTracker</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden"
          title="mobile menu"
        >
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        {[
          { id: 'dashboard', icon: Home, label: 'Dashboard' },
          { id: 'repositories', icon: Code, label: 'Repositórios' },
          { id: 'performance', icon: TrendingUp, label: 'Performance' },
          { id: 'goals', icon: Target, label: 'Objetivos' },
        ].map((item) => (
          <Link
            key={item.id}
            href={`/${item.id}`}
            onClick={() => {
              setActiveTab(item.id);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === item.id ? 'bg-blue-600' : 'hover:bg-gray-800'
            }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-gray-800 pt-4 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors">
          <Settings size={20} />
          <span>Configurações</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors text-red-400">
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
