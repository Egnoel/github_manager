"use client";
import React, { useState } from 'react';
import { Check, Menu, Download } from 'lucide-react';
import { ModalStates } from '@/data';
import Sidebar from '@/components/Sidebar';
import RepositoriesView from './repositories/page';
import PerformanceView from './performance/page';
import GoalsView from './goals/page';
import SettingsView from './settings/page';
import DashboardView from './dashboard/page';
import Modal from '@/components/Modal';

const GitHubDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [modalOpen, setModalOpen] = useState<ModalStates | null>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [settingsTab, setSettingsTab] = useState('profile');

  // Mock data

  return (
    <div
      className={`flex min-h-screen ${
        isDarkMode ? 'bg-gray-950' : 'bg-gray-50'
      } transition-colors duration-300`}
    >
      {/* Mobile Menu Button */}
      <button
        title="menu"
        onClick={() => setIsMobileMenuOpen(true)}
        className={`lg:hidden fixed top-4 left-4 z-40 p-2 ${
          isDarkMode ? 'bg-gray-950' : 'bg-gray-900'
        } text-white rounded-lg`}
      >
        <Menu size={24} />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      <Sidebar />

      <div className="flex-1 overflow-auto">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'repositories' && <RepositoriesView />}
        {activeTab === 'performance' && <PerformanceView />}
        {activeTab === 'goals' && <GoalsView />}
        {activeTab === 'settings' && <SettingsView />}
      </div>

      {/* Modals */}
      <Modal
        isOpen={modalOpen === 'sync'}
        onClose={() => setModalOpen(null)}
        title="Sincronizar com GitHub"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Última sincronização: Há 2 horas</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm">Repositórios</span>
              <Check className="text-green-500" size={20} />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm">Issues</span>
              <Check className="text-green-500" size={20} />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm">Pull Requests</span>
              <Check className="text-green-500" size={20} />
            </div>
          </div>
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            title="sincronizar"
            type="button"
          >
            Sincronizar agora
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={modalOpen === 'newRepo'}
        onClose={() => setModalOpen(null)}
        title="Novo Repositório"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do repositório
            </label>
            <input
              type="text"
              placeholder="meu-projeto"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              placeholder="Descrição do projeto..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="private" className="rounded" />
            <label htmlFor="private" className="text-sm text-gray-700">
              Repositório privado
            </label>
          </div>
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            type="button"
          >
            Criar repositório
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={modalOpen === 'newGoal'}
        onClose={() => setModalOpen(null)}
        title="Novo Objetivo"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título do objetivo
            </label>
            <input
              type="text"
              placeholder="Ex: Fazer 50 commits este mês"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta
              </label>
              <input
                type="number"
                placeholder="50"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prazo (dias)
              </label>
              <input
                type="number"
                placeholder="30"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="tipo"
            >
              Tipo
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="tipo"
              name="tipo"
              id="tipo"
            >
              <option>Commits</option>
              <option>Pull Requests</option>
              <option>Code Reviews</option>
              <option>Issues</option>
            </select>
          </div>
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            type="button"
          >
            Criar objetivo
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={modalOpen === 'export'}
        onClose={() => setModalOpen(null)}
        title="Exportar Relatórios"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Selecione o tipo de relatório que deseja exportar
          </p>

          <div className="space-y-3">
            {[
              {
                type: 'Atividade Completa',
                desc: 'Commits, PRs, Issues (último ano)',
                format: 'PDF',
              },
              {
                type: 'Performance Mensal',
                desc: 'Métricas e insights do mês',
                format: 'PDF',
              },
              {
                type: 'Repositórios',
                desc: 'Lista completa com estatísticas',
                format: 'CSV',
              },
              {
                type: 'Objetivos',
                desc: 'Progresso e conquistas',
                format: 'PDF',
              },
            ].map((report, i) => (
              <div
                key={i}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{report.type}</h4>
                    <p className="text-sm text-gray-500 mt-1">{report.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {report.format}
                    </span>
                    <Download size={20} className="text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              type="button"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Exportar todos os relatórios (ZIP)
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GitHubDashboard;
