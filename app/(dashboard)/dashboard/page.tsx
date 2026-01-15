'use client';
import React, { useEffect, useState } from 'react';
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
import { useGitHubAuth } from '@/hooks/useGitHubAuth';
import { useGitHubRepos } from '@/hooks/useGitHubData';

function getTimeAgo(date: Date, now: number): string {
  const seconds = Math.floor((now - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} months ago`;
  return `${Math.floor(seconds / 31536000)} years ago`;
}

const DashboardView = () => {
  const [modalOpen, setModalOpen] = useState<ModalStates | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, loading: authLoading, login } = useGitHubAuth();
  const {
    repos,
    loading: reposLoading,
    error: reposError,
  } = useGitHubRepos(1, 20);

  // Calculate current time once using useState initializer function (runs only once)
  const [now] = useState(() => Date.now());

  // Weekly activity data (fallback to static commitData when API is unavailable)
  const [weeklyActivity, setWeeklyActivity] = useState(commitData);

  // Stats summary data
  const [statsSummary, setStatsSummary] = useState({
    commits: 0,
    pullRequests: 0,
    openIssues: 0,
    activeRepos: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setWeeklyActivity(commitData);
      setStatsSummary({
        commits: 0,
        pullRequests: 0,
        openIssues: 0,
        activeRepos: 0,
      });
      setStatsLoading(false);
      return;
    }

    let cancelled = false;

    const fetchWeeklyActivity = async () => {
      try {
        const res = await fetch('/api/github/weekly-activity');
        if (!res.ok) {
          throw new Error('Failed to fetch weekly activity');
        }
        const data = await res.json();
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setWeeklyActivity(data);
        }
      } catch (error) {
        console.error('Error fetching weekly activity:', error);
        // Keep fallback data on error
      }
    };

    const fetchStatsSummary = async () => {
      try {
        setStatsLoading(true);
        const res = await fetch('/api/github/stats-summary', {
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error('Failed to fetch stats summary');
        }
        const data = await res.json();
        if (!cancelled) {
          setStatsSummary({
            commits: data.commits || 0,
            pullRequests: data.pullRequests || 0,
            openIssues: data.openIssues || 0,
            activeRepos: data.activeRepos || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching stats summary:', error);
        // Keep default values on error
      } finally {
        if (!cancelled) {
          setStatsLoading(false);
        }
      }
    };

    fetchWeeklyActivity();
    fetchStatsSummary();

    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <div
      className={`p-4 lg:p-8 space-y-6 text-gray-600 bg-linear-to-br from-gray-900 via-gray-900 to-gray-800 min-h-screen`}
    >
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div className="flex items-center gap-4">
          {user && (
            <img
              src={
                user.user_metadata?.avatar_url ||
                user.user_metadata?.picture ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.user_metadata?.full_name || user.email || 'User'
                )}&background=3b82f6&color=fff&size=128`
              }
              alt={user.user_metadata?.full_name || user.email || 'User'}
              className="w-16 h-16 rounded-full border-2 border-white/20 hidden lg:block"
            />
          )}
          <div>
            <h1 className={`text-2xl lg:text-3xl font-bold text-white`}>
              {authLoading ? (
                'Loading...'
              ) : user ? (
                <>
                  Welcome,{' '}
                  {user.user_metadata?.full_name ||
                    user.user_metadata?.user_name ||
                    user.email?.split('@')[0] ||
                    'Developer'}
                  ! 👋
                </>
              ) : (
                'Welcome, Developer! 👋'
              )}
            </h1>
            <p className="text-white mt-1">Here&apos;s your activity summary</p>
            {reposError && (
              <div className="mt-2 px-3 py-2 bg-red-500/20 border border-red-500/50 rounded-lg">
                {reposError.includes('GitHub is not connected') ? (
                  <div className="flex flex-col gap-2">
                    <p className="text-red-300 text-sm">{reposError}</p>
                    <button
                      type="button"
                      onClick={login}
                      className="self-start px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      Reconnect GitHub
                    </button>
                  </div>
                ) : (
                  <p className="text-red-300 text-sm">
                    Error loading repositories: {reposError}
                  </p>
                )}
              </div>
            )}
          </div>
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
            <span className="hidden lg:inline">Export</span>
          </button>
          <Modal
            isOpen={modalOpen === 'export'}
            onClose={() => setModalOpen(null)}
            title="Export Reports"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                Select the type of report you want to export
              </p>

              <div className="space-y-3">
                {[
                  {
                    type: 'Complete Activity',
                    desc: 'Commits, PRs, Issues (last year)',
                    format: 'PDF',
                  },
                  {
                    type: 'Monthly Performance',
                    desc: 'Metrics and insights for the month',
                    format: 'PDF',
                  },
                  {
                    type: 'Repositories',
                    desc: 'Complete list with statistics',
                    format: 'CSV',
                  },
                  {
                    type: 'Goals',
                    desc: 'Progress and achievements',
                    format: 'PDF',
                  },
                ].map((report, i) => (
                  <div
                    key={i}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {report.type}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {report.desc}
                        </p>
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
                  Export all reports (ZIP)
                </button>
              </div>
            </div>
          </Modal>
          <button
            onClick={() => setModalOpen('sync')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sync with GitHub
          </button>
          <Modal
            isOpen={modalOpen === 'sync'}
            onClose={() => setModalOpen(null)}
            title="Sync with GitHub"
          >
            <div className="space-y-4">
              <p className="text-gray-600">Last sync: 2 hours ago</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">Repositories</span>
                  <Check className="text-green-500" size={20} />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">Open Issues</span>
                  <Check className="text-green-500" size={20} />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">Pull Requests</span>
                  <Check className="text-green-500" size={20} />
                </div>
              </div>
              <button
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="sync now"
                type="button"
              >
                Sync now
              </button>
            </div>
          </Modal>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          {
            label: 'Commits (7d)',
            value: statsLoading ? '...' : statsSummary.commits.toString(),
            icon: Activity,
            color: 'blue',
          },
          {
            label: 'Pull Requests',
            value: statsLoading ? '...' : statsSummary.pullRequests.toString(),
            icon: GitPullRequest,
            color: 'purple',
          },
          {
            label: 'Open Issues',
            value: statsLoading ? '...' : statsSummary.openIssues.toString(),
            icon: AlertCircle,
            color: 'orange',
          },
          {
            label: 'Active Repos',
            value: statsLoading ? '...' : statsSummary.activeRepos.toString(),
            icon: GitBranch,
            color: 'green',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`${
              isDarkMode
                ? 'bg-gray-800/50 border-gray-700 backdrop-blur-sm'
                : 'bg-white/90 border-gray-100 backdrop-blur-sm'
            } p-4 lg:p-6 rounded-xl shadow-lg border backdrop-blur-sm`}
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
            Weekly Activity
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyActivity}>
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
              ? 'bg-gray-800/50 border-gray-700 backdrop-blur-sm'
              : 'bg-white/90 border-gray-100 backdrop-blur-sm'
          } p-4 lg:p-6 rounded-xl shadow-lg border backdrop-blur-sm`}
        >
          <h2
            className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : ''
            }`}
          >
            Languages
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
              ? 'bg-gray-800/50 border-gray-700 backdrop-blur-sm'
              : 'bg-white/90 border-gray-100 backdrop-blur-sm'
          } p-4 lg:p-6 rounded-xl shadow-lg border backdrop-blur-sm`}
        >
          <h2
            className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : ''
            }`}
          >
            Pending Issues
          </h2>
          <div className="space-y-3">
            {issues.map((issue, i) => (
              <div
                key={i}
                className={`p-4 border ${
                  isDarkMode
                    ? 'border-gray-700 hover:border-blue-500 hover:bg-gray-800/50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                } rounded-lg transition-all cursor-pointer hover:shadow-md`}
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
                  {issue.time} ago
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`${
            isDarkMode
              ? 'bg-gray-800/50 border-gray-700 backdrop-blur-sm'
              : 'bg-white/90 border-gray-100 backdrop-blur-sm'
          } p-4 lg:p-6 rounded-xl shadow-lg border backdrop-blur-sm`}
        >
          <h2
            className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : ''
            }`}
          >
            Repositórios Recentes
          </h2>
          <div className="space-y-3">
            {reposLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`p-4 border ${
                      isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    } rounded-lg animate-pulse`}
                  >
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : reposError ? (
              <div
                className={`p-4 border border-red-500/50 rounded-lg bg-red-500/10`}
              >
                <p className={`text-sm text-red-400`}>
                  Error loading repositories. Please try again later.
                </p>
              </div>
            ) : repos.length > 0 ? (
              repos.slice(0, 4).map((repo) => {
                const updatedDate = new Date(repo.updated_at);
                const timeAgo = getTimeAgo(updatedDate, now);
                const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

                return (
                  <div
                    key={repo.id}
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
                          {repo.language && (
                            <span
                              className={`text-sm ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}
                            >
                              {repo.language}
                            </span>
                          )}
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star size={14} fill="currentColor" />
                            <span className="text-sm">
                              {repo.stargazers_count}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <GitBranch size={14} />
                            <span className="text-sm">{repo.forks_count}</span>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          updatedDate.getTime() > sevenDaysAgo
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      ></span>
                    </div>
                    <span
                      className={`text-xs ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-400'
                      } mt-2 block`}
                    >
                      Updated {timeAgo}
                    </span>
                  </div>
                );
              })
            ) : (
              <p
                className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Nenhum repositório encontrado
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardView;
