"use client";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { TrendingUp, Clock, Zap, Award } from 'lucide-react';
import { performanceData } from '@/data';

const PerformanceView = () => {
  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Performance
        </h1>
        <p className="text-gray-600 mt-1">
          Análise detalhada da sua produtividade
        </p>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          {
            label: 'Produtividade',
            value: '87%',
            icon: Zap,
            change: '+5%',
            color: 'green',
          },
          {
            label: 'Tempo Médio PR',
            value: '2.3h',
            icon: Clock,
            change: '-12%',
            color: 'blue',
          },
          {
            label: 'Code Reviews',
            value: '156',
            icon: Award,
            change: '+23%',
            color: 'purple',
          },
        ].map((metric, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${metric.color}-100`}>
                <metric.icon className={`text-${metric.color}-600`} size={24} />
              </div>
              <span
                className={`text-sm font-medium ${
                  metric.change.startsWith('+')
                    ? 'text-green-500'
                    : 'text-blue-500'
                }`}
              >
                {metric.change}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">
              {metric.value}
            </h3>
            <p className="text-gray-600 text-sm">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Performance Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">
          Tendência de Atividade (5 meses)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
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
            <span className="text-sm text-gray-600">Commits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-sm text-gray-600">Pull Requests</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-600">Code Reviews</span>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Insights da Semana</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="text-green-600" size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Excelente produtividade!
                </p>
                <p className="text-sm text-gray-600">
                  Você está 23% acima da sua média mensal
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  Tempo de resposta melhorou
                </p>
                <p className="text-sm text-gray-600">
                  Suas PRs são revisadas 30% mais rápido
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-900">Top contributor</p>
                <p className="text-sm text-gray-600">
                  Você está entre os top 10% de reviewers
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">
            Horas de Maior Produtividade
          </h2>
          <div className="space-y-3">
            {[
              { time: '09:00 - 12:00', percentage: 85, label: 'Manhã' },
              { time: '14:00 - 17:00', percentage: 70, label: 'Tarde' },
              { time: '19:00 - 22:00', percentage: 45, label: 'Noite' },
            ].map((slot, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{slot.time}</span>
                  <span className="font-medium text-gray-900">
                    {slot.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${slot.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceView;
