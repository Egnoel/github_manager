'use client';
import React, { useState } from 'react';
import { Check, Menu, Download } from 'lucide-react';
import { ModalStates } from '@/data';
import Sidebar from '@/components/Sidebar';
import RepositoriesView from './(dashboard)/repositories/page';
import PerformanceView from './(dashboard)/performance/page';
import GoalsView from './(dashboard)/goals/page';
import SettingsView from './(dashboard)/settings/page';
import DashboardView from './(dashboard)/dashboard/page';
import Modal from '@/components/Modal';

const GitHubDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [modalOpen, setModalOpen] = useState<ModalStates | null>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [settingsTab, setSettingsTab] = useState('profile');

  // Mock data

  return (
    <div className={`flex min-h-screen `}>
      <h1>GitHub Manager</h1>
    </div>
  );
};

export default GitHubDashboard;
