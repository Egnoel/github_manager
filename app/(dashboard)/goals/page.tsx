"use client";
import { Calendar, Plus, Check } from 'lucide-react';
import { goals, ModalStates } from '@/data';
import { useState } from 'react';
import Modal from '@/components/Modal';
const GoalsView = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [modalOpen, setModalOpen] = useState<ModalStates | null>(null);
  return (
    <div className={`p-4 lg:p-8 space-y-6 ${isDarkMode ? 'text-white' : ''}`}>
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1
            className={`text-2xl lg:text-3xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Objetivos
          </h1>
          <p
            className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}
          >
            Acompanhe suas metas de desenvolvimento
          </p>
        </div>
        <button
          onClick={() => setModalOpen('newGoal')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Novo Objetivo
        </button>
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
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal, i) => {
          const percentage = (goal.current / goal.target) * 100;
          const isComplete = percentage >= 100;

          return (
            <div
              key={i}
              className={`${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-100'
              } p-6 rounded-xl shadow-sm border`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3
                    className={`text-lg font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    } mb-2`}
                  >
                    {goal.title}
                  </h3>
                  <div
                    className={`flex items-center gap-2 text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    <Calendar size={16} />
                    <span>Faltam {goal.deadline}</span>
                  </div>
                </div>
                {isComplete && (
                  <div className="p-2 bg-green-100 rounded-full">
                    <Check className="text-green-600" size={20} />
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span
                    className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                  >
                    Progresso
                  </span>
                  <span
                    className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {goal.current} / {goal.target}
                  </span>
                </div>
                <div
                  className={`w-full ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  } rounded-full h-3`}
                >
                  <div
                    className={`h-3 rounded-full transition-all ${
                      isComplete ? 'bg-green-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                <div className="text-right mt-1">
                  <span
                    className={`text-sm font-medium ${
                      isComplete ? 'text-green-600' : 'text-blue-600'
                    }`}
                  >
                    {percentage.toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className={`flex-1 px-4 py-2 border ${
                    isDarkMode
                      ? 'border-gray-600 hover:bg-gray-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  } rounded-lg transition-colors text-sm`}
                >
                  Editar
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Ver detalhes
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Achievements */}
      <div
        className={`${
          isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-100'
        } p-6 rounded-xl shadow-sm border`}
      >
        <h2
          className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-white' : ''
          }`}
        >
          Conquistas Recentes 🏆
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[
            { title: 'Streak de 7 dias', icon: '🔥', date: 'Hoje' },
            { title: '100 commits', icon: '💯', date: 'Há 2 dias' },
            { title: 'Top Reviewer', icon: '⭐', date: 'Esta semana' },
          ].map((achievement, i) => (
            <div
              key={i}
              className={`p-4 border ${
                isDarkMode
                  ? 'border-gray-700 hover:border-blue-500'
                  : 'border-gray-200 hover:border-blue-300'
              } rounded-lg transition-colors`}
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <h3
                className={`font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {achievement.title}
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                } mt-1`}
              >
                {achievement.date}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoalsView;
