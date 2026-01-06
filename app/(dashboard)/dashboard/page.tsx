'use client';
import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Activity,
  GitBranch,
  GitPullRequest,
  AlertCircle,
  Star,
  Download,
  Check,
} from 'lucide-react';
import {
  allRepos,
  commitData,
  issues,
  languageData,
  ModalStates,
} from '@/data';
import Modal from '@/components/Modal';

const DashboardView = () => {
  const [modalOpen, setModalOpen] = useState<ModalStates | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className={`p-4 lg:p-8 space-y-6 text-gray-600`}>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className={`text-2xl lg:text-3xl font-bold text-white`}>
            Bem-vindo, Developer! 👋
          </h1>
          <p className="text-white mt-1">Aqui está o seu resumo de atividade</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setModalOpen('export')}
            className={`flex items-center gap-2 px-4 py-2 border ${
              isDarkMode
                ? 'border-gray-600 hover:bg-gray-800'
                : 'border-gray-300 hover:bg-gray-50'
            } rounded-lg transition-colors`}
          >
            <Download size={20} />
            <span className="hidden lg:inline">Exportar</span>
          </button>
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
          <button
            onClick={() => setModalOpen('sync')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sincronizar
          </button>
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
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          { label: 'Commits (7d)', value: '73', icon: Activity, color: 'blue' },
          {
            label: 'Pull Requests',
            value: '12',
            icon: GitPullRequest,
            color: 'purple',
          },
          {
            label: 'Issues Abertas',
            value: '8',
            icon: AlertCircle,
            color: 'orange',
          },
          {
            label: 'Repos Ativos',
            value: '24',
            icon: GitBranch,
            color: 'green',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`${
              isDarkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-100'
            } p-4 lg:p-6 rounded-xl shadow-sm border`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 lg:p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`text-${stat.color}-600`} size={20} />
              </div>
              <span className="text-green-500 text-xs lg:text-sm">↑ 12%</span>
            </div>
            <h3
              className={`text-xl lg:text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              {stat.value}
            </h3>
            <p
              className={`${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              } text-xs lg:text-sm mt-1`}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className={`lg:col-span-2 ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-100'
          } p-4 lg:p-6 rounded-xl shadow-sm border`}
        >
          <h2
            className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : ''
            }`}
          >
            Atividade Semanal
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={commitData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDarkMode ? '#374151' : '#e5e7eb'}
              />
              <XAxis
                dataKey="day"
                stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
              />
              <YAxis stroke={isDarkMode ? '#9ca3af' : '#6b7280'} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="commits" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          className={`${
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-100'
          } p-4 lg:p-6 rounded-xl shadow-sm border`}
        >
          <h2
            className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : ''
            }`}
          >
            Linguagens
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={languageData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {languageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {languageData.map((lang, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: lang.color }}
                  ></div>
                  <span className={isDarkMode ? 'text-gray-300' : ''}>
                    {lang.name}
                  </span>
                </div>
                <span
                  className={`font-medium ${isDarkMode ? 'text-white' : ''}`}
                >
                  {lang.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Issues & Repos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={`${
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-100'
          } p-4 lg:p-6 rounded-xl shadow-sm border`}
        >
          <h2
            className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : ''
            }`}
          >
            Issues Pendentes
          </h2>
          <div className="space-y-3">
            {issues.map((issue, i) => (
              <div
                key={i}
                className={`p-4 border ${
                  isDarkMode
                    ? 'border-gray-700 hover:border-blue-500'
                    : 'border-gray-200 hover:border-blue-300'
                } rounded-lg transition-colors cursor-pointer`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3
                      className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {issue.title}
                    </h3>
                    <p
                      className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      } mt-1`}
                    >
                      {issue.repo}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      issue.priority === 'high'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : issue.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    }`}
                  >
                    {issue.priority}
                  </span>
                </div>
                <span
                  className={`text-xs ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  } mt-2 block`}
                >
                  {issue.time} atrás
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`${
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-100'
          } p-4 lg:p-6 rounded-xl shadow-sm border`}
        >
          <h2
            className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : ''
            }`}
          >
            Repositórios Recentes
          </h2>
          <div className="space-y-3">
            {allRepos.slice(0, 4).map((repo, i) => (
              <div
                key={i}
                className={`p-4 border ${
                  isDarkMode
                    ? 'border-gray-700 hover:border-blue-500'
                    : 'border-gray-200 hover:border-blue-300'
                } rounded-lg transition-colors cursor-pointer`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3
                      className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {repo.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span
                        className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {repo.language}
                      </span>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star size={14} fill="currentColor" />
                        <span className="text-sm">{repo.stars}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      repo.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  ></span>
                </div>
                <span
                  className={`text-xs ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  } mt-2 block`}
                >
                  Atualizado {repo.updated}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardView;
