"use client";
import { useState, useEffect } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { TrendingUp, Clock, Zap, Award, Loader2 } from 'lucide-react';
import { performanceData } from '@/data';
import { useGitHubAuth } from '@/hooks/useGitHubAuth';
import { useGitHubRepos } from '@/hooks/useGitHubData';

interface UserStats {
  publicRepos: number;
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  totalIssues: number;
  followers: number;
  following: number;
}

const PerformanceView = () => {
  const { user } = useGitHubAuth();
  const { repos } = useGitHubRepos(1, 100);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/github/stats');
        
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  // Calculate metrics from repos
  const totalCommits = repos.length * 10; // Estimate
  const activeRepos = repos.filter(repo => 
    new Date(repo.updated_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="p-4 lg:p-8 space-y-6 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 min-h-screen">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">
          Performance
        </h1>
        <p className="text-gray-400 mt-1">
          Detailed analysis of your productivity
        </p>
        {error && (
          <div className="mt-2 px-3 py-2 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700 animate-pulse"
            >
              <div className="h-12 bg-gray-700 rounded w-12 mb-4" />
              <div className="h-8 bg-gray-700 rounded w-24 mb-2" />
              <div className="h-4 bg-gray-700 rounded w-32" />
            </div>
          ))
        ) : (
          [
            {
              label: 'Active Repositories',
              value: activeRepos.toString(),
              icon: Zap,
              change: `${Math.round((activeRepos / repos.length) * 100)}%`,
              color: 'green',
            },
            {
              label: 'Total Stars',
              value: stats?.totalStars?.toString() || '0',
              icon: Award,
              change: `${repos.length} repos`,
              color: 'yellow',
            },
            {
              label: 'Total Forks',
              value: stats?.totalForks?.toString() || '0',
              icon: TrendingUp,
              change: `${stats?.totalRepos || 0} repos`,
              color: 'blue',
            },
          ].map((metric, i) => (
            <div
              key={i}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${
                  metric.color === 'green' ? 'bg-green-500/20' :
                  metric.color === 'yellow' ? 'bg-yellow-500/20' :
                  'bg-blue-500/20'
                }`}>
                  <metric.icon className={`${
                    metric.color === 'green' ? 'text-green-400' :
                    metric.color === 'yellow' ? 'text-yellow-400' :
                    'text-blue-400'
                  }`} size={24} />
                </div>
                <span className="text-sm font-medium text-gray-400">
                  {metric.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">
                {metric.value}
              </h3>
              <p className="text-gray-400 text-sm">{metric.label}</p>
            </div>
          ))
        )}
      </div>

      {/* Performance Chart */}
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-white">
          Tendência de Atividade (5 meses)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
            <Area
              type="monotone"
              dataKey="commits"
              stackId="1"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="prs"
              stackId="1"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="reviews"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-400">Commits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-sm text-gray-400">Pull Requests</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-400">Code Reviews</span>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-white">Week Insights</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="text-green-600" size={20} />
              </div>
              <div>
                <p className="font-medium text-white">
                  Excellent productivity!
                </p>
                <p className="text-sm text-gray-400">
                  You have {activeRepos} active repositories
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="font-medium text-white">
                  Total of {stats?.totalStars || 0} stars
                </p>
                <p className="text-sm text-gray-400">
                  Your repositories have {stats?.totalForks || 0} forks
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="font-medium text-white">Statistics</p>
                <p className="text-sm text-gray-400">
                  {stats?.followers || 0} followers • {stats?.following || 0} following
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 className="text-lg font-semibold mb-4 text-white">
            Repository Statistics
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Public Repositories', value: stats?.publicRepos || 0, total: stats?.totalRepos || 0 },
              { label: 'Total Stars', value: stats?.totalStars || 0, total: (stats?.totalStars || 0) + 100 },
              { label: 'Total Forks', value: stats?.totalForks || 0, total: (stats?.totalForks || 0) + 50 },
            ].map((stat, i) => {
              const percentage = stat.total > 0 ? Math.min((stat.value / stat.total) * 100, 100) : 0;
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">{stat.label}</span>
                    <span className="font-medium text-white">
                      {stat.value}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceView;
