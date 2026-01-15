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
import Image from 'next/image';
import { useGitHubAuth } from '@/hooks/useGitHubAuth';

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, logout, loading } = useGitHubAuth();
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
          { id: 'repositories', icon: Code, label: 'Repositories' },
          { id: 'performance', icon: TrendingUp, label: 'Performance' },
          { id: 'goals', icon: Target, label: 'Goals' },
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
        {/* User Profile Section */}
        {user && (
          <div className="px-4 py-3 mb-2">
            <div className="flex items-center gap-3">
              <Image
                src={
                  user.user_metadata?.avatar_url ||
                  user.user_metadata?.picture ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.user_metadata?.full_name || user.email || 'User'
                  )}&background=3b82f6&color=fff`
                }
                alt={user.user_metadata?.full_name || user.email || 'User'}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full border-2 border-gray-700"
                unoptimized
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.user_metadata?.full_name ||
                    user.user_metadata?.user_name ||
                    user.email?.split('@')[0] ||
                    'User'}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user.user_metadata?.user_name || user.email || ''}
                </p>
              </div>
            </div>
          </div>
        )}
        {loading && !user && (
          <div className="px-4 py-3 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse" />
              <div className="flex-1">
                <div className="h-4 w-24 bg-gray-700 rounded animate-pulse mb-2" />
                <div className="h-3 w-32 bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          </div>
        )}
        <Link href={'/settings'} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors">
          <Settings size={20} />
          <span>Settings</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors text-red-400"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
