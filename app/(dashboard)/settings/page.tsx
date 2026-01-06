'use client';
import { useState } from 'react';
import {
  Moon,
  Sun,
  Bell,
  User,
  Lock,
  Palette,
  Globe,
  Smartphone,
} from 'lucide-react';
import { ModalStates } from '@/data';
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const SettingsView = () => {
  const [modalOpen, setModalOpen] = useState<ModalStates | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [settingsTab, setSettingsTab] = useState('profile');
  const { setTheme } = useTheme()
  return (
    <div className={`p-4 lg:p-8 space-y-6 ${isDarkMode ? 'text-white' : ''}`}>
      <div>
        <h1
          className={`text-2xl lg:text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Configurações
        </h1>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
          Gerencie suas preferências e conta
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Sidebar */}
        <div
          className={`lg:w-64 ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-100'
          } p-4 rounded-xl shadow-sm border h-fit`}
        >
          <nav className="space-y-1">
            {[
              { id: 'profile', icon: User, label: 'Perfil' },
              { id: 'appearance', icon: Palette, label: 'Aparência' },
              { id: 'notifications', icon: Bell, label: 'Notificações' },
              { id: 'privacy', icon: Lock, label: 'Privacidade' },
              { id: 'integrations', icon: Globe, label: 'Integrações' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setSettingsTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  settingsTab === item.id
                    ? 'bg-blue-600 text-white'
                    : `${
                        isDarkMode
                          ? 'hover:bg-gray-700 text-gray-300'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 space-y-6">
          {settingsTab === 'profile' && (
            <div
              className={`${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-100'
              } p-6 rounded-xl shadow-sm border space-y-6`}
            >
              <div>
                <h2
                  className={`text-xl font-semibold mb-4 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Informações do Perfil
                </h2>
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    D
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Alterar foto
                    </button>
                    <p
                      className={`text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      } mt-2`}
                    >
                      PNG, JPG até 5MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    } mb-2`}
                  >
                    Nome completo
                  </label>
                  <input
                    type="text"
                    defaultValue="Developer Name"
                    className={`w-full px-4 py-2 border ${
                      isDarkMode
                        ? 'border-gray-600 bg-gray-700 text-white'
                        : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    } mb-2`}
                  >
                    Username GitHub
                  </label>
                  <input
                    type="text"
                    defaultValue="@developer"
                    className={`w-full px-4 py-2 border ${
                      isDarkMode
                        ? 'border-gray-600 bg-gray-700 text-white'
                        : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div className="lg:col-span-2">
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    } mb-2`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue="developer@email.com"
                    className={`w-full px-4 py-2 border ${
                      isDarkMode
                        ? 'border-gray-600 bg-gray-700 text-white'
                        : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div className="lg:col-span-2">
                  <label
                    className={`block text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    } mb-2`}
                  >
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="Desenvolvedor full-stack apaixonado por tecnologia"
                    className={`w-full px-4 py-2 border ${
                      isDarkMode
                        ? 'border-gray-600 bg-gray-700 text-white'
                        : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
              </div>

              <div
                className={`flex justify-end gap-3 pt-4 border-t ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <button
                  className={`px-4 py-2 border ${
                    isDarkMode
                      ? 'border-gray-600 hover:bg-gray-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  } rounded-lg transition-colors`}
                >
                  Cancelar
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Salvar alterações
                </button>
              </div>
            </div>
          )}

          {settingsTab === 'appearance' && (
            <div
              className={`${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-100'
              } p-6 rounded-xl shadow-sm border space-y-6`}
            >
              <h2
                className={`text-xl font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Aparência
              </h2>

             <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  } mb-4`}
                >
                  Cor de destaque
                </label>
                <div className="flex gap-3">
                  {[
                    '#3b82f6',
                    '#8b5cf6',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                    '#ec4899',
                  ].map((color) => (
                    <button
                      key={color}
                      className="w-12 h-12 rounded-lg border-2 border-transparent hover:border-gray-400 transition-colors"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  } mb-2`}
                >
                  Densidade de interface
                </label>
                <select
                  className={`w-full px-4 py-2 border ${
                    isDarkMode
                      ? 'border-gray-600 bg-gray-700 text-white'
                      : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option>Compacta</option>
                  <option>Confortável</option>
                  <option>Espaçada</option>
                </select>
              </div>
            </div>
          )}

          {settingsTab === 'notifications' && (
            <div
              className={`${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-100'
              } p-6 rounded-xl shadow-sm border space-y-6`}
            >
              <h2
                className={`text-xl font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Notificações
              </h2>

              <div className="space-y-4">
                {[
                  {
                    label: 'Novos commits em repositórios',
                    desc: 'Receba atualizações sobre commits',
                  },
                  {
                    label: 'Pull Requests',
                    desc: 'Notificações de PRs que você está revisando',
                  },
                  {
                    label: 'Issues atribuídas',
                    desc: 'Quando uma issue for atribuída a você',
                  },
                  { label: 'Menções', desc: 'Quando alguém mencionar você' },
                  {
                    label: 'Objetivos concluídos',
                    desc: 'Quando você atingir uma meta',
                  },
                  {
                    label: 'Resumo semanal',
                    desc: 'Relatório de atividades por email',
                  },
                ].map((notif, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-4 border ${
                      isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    } rounded-lg`}
                  >
                    <div>
                      <p
                        className={`font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {notif.label}
                      </p>
                      <p
                        className={`text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {notif.desc}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={i < 4}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {settingsTab === 'privacy' && (
            <div
              className={`${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-100'
              } p-6 rounded-xl shadow-sm border space-y-6`}
            >
              <h2
                className={`text-xl font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Privacidade e Segurança
              </h2>

              <div className="space-y-4">
                <div
                  className={`p-4 border ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  } rounded-lg`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p
                      className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      Perfil público
                    </p>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    Permitir que outros vejam seu perfil e estatísticas
                  </p>
                </div>

                <div
                  className={`p-4 border ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  } rounded-lg`}
                >
                  <p
                    className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    } mb-2`}
                  >
                    Autenticação de dois fatores
                  </p>
                  <p
                    className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    } mb-3`}
                  >
                    Adicione uma camada extra de segurança
                  </p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Ativar 2FA
                  </button>
                </div>

                <div
                  className={`p-4 border ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  } rounded-lg`}
                >
                  <p
                    className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    } mb-2`}
                  >
                    Exportar dados
                  </p>
                  <p
                    className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    } mb-3`}
                  >
                    Baixe uma cópia de todos os seus dados
                  </p>
                  <button
                    onClick={() => setModalOpen('export')}
                    className={`px-4 py-2 border ${
                      isDarkMode
                        ? 'border-gray-600 hover:bg-gray-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    } rounded-lg transition-colors text-sm`}
                  >
                    Solicitar exportação
                  </button>
                </div>

                <div
                  className={`p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 rounded-lg`}
                >
                  <p className="font-medium text-red-700 dark:text-red-400 mb-2">
                    Zona de perigo
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-300 mb-3">
                    Ações irreversíveis para sua conta
                  </p>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                    Deletar conta
                  </button>
                </div>
              </div>
            </div>
          )}

          {settingsTab === 'integrations' && (
            <div
              className={`${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-100'
              } p-6 rounded-xl shadow-sm border space-y-6`}
            >
              <h2
                className={`text-xl font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Integrações
              </h2>

              <div className="space-y-4">
                {[
                  {
                    name: 'GitHub',
                    status: 'Conectado',
                    icon: '🔗',
                    color: 'green',
                  },
                  {
                    name: 'Slack',
                    status: 'Desconectado',
                    icon: '💬',
                    color: 'gray',
                  },
                  {
                    name: 'Discord',
                    status: 'Desconectado',
                    icon: '🎮',
                    color: 'gray',
                  },
                  {
                    name: 'Jira',
                    status: 'Desconectado',
                    icon: '📋',
                    color: 'gray',
                  },
                ].map((integration, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-4 border ${
                      isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    } rounded-lg`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{integration.icon}</div>
                      <div>
                        <p
                          className={`font-medium ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {integration.name}
                        </p>
                        <p
                          className={`text-sm ${
                            integration.status === 'Conectado'
                              ? 'text-green-600'
                              : isDarkMode
                              ? 'text-gray-400'
                              : 'text-gray-500'
                          }`}
                        >
                          {integration.status}
                        </p>
                      </div>
                    </div>
                    <button
                      className={`px-4 py-2 ${
                        integration.status === 'Conectado'
                          ? isDarkMode
                            ? 'border border-gray-600 hover:bg-gray-700'
                            : 'border border-gray-300 hover:bg-gray-50'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      } rounded-lg transition-colors text-sm`}
                    >
                      {integration.status === 'Conectado'
                        ? 'Desconectar'
                        : 'Conectar'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default SettingsView;
