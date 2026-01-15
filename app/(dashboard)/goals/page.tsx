'use client';
import { Calendar, Plus, Check, Edit, Trash2, Loader2 } from 'lucide-react';
import { ModalStates } from '@/data';
import { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import { useGoals, type Goal } from '@/hooks/useGoals';
import { useGitHubAuth } from '@/hooks/useGitHubAuth';

function calculateDaysRemaining(deadlineDate: string): number {
  const deadline = new Date(deadlineDate);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

function formatDeadline(days: number): string {
  if (days === 0) return 'Today';
  if (days === 1) return '1 day';
  if (days < 30) return `${days} days`;
  const months = Math.floor(days / 30);
  return `${months} ${months === 1 ? 'month' : 'months'}`;
}

const GoalsView = () => {
  const { user } = useGitHubAuth();
  const {
    goals,
    loading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    updateProgress,
  } = useGoals();
  const [modalOpen, setModalOpen] = useState<ModalStates | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    target: '',
    type: 'commits' as Goal['type'],
    deadline_days: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Update progress periodically (every 5 minutes)
  useEffect(() => {
    if (!user || goals.length === 0) return;

    // Update immediately on mount
    updateProgress();

    // Then update every 5 minutes
    const interval = setInterval(() => {
      updateProgress();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, goals.length]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.target || !formData.deadline_days) {
      return;
    }

    try {
      setSubmitting(true);
      if (editingGoal) {
        await updateGoal(editingGoal.id, {
          title: formData.title,
          target: parseInt(formData.target),
          type: formData.type,
          deadline_days: parseInt(formData.deadline_days),
        });
        // Update progress after editing
        await updateProgress(editingGoal.id);
      } else {
        const newGoal = await createGoal(
          formData.title,
          parseInt(formData.target),
          formData.type,
          parseInt(formData.deadline_days)
        );
        // Update progress after creating (the API already calculates initial progress,
        // but we refresh it to ensure it's up to date)
        if (newGoal) {
          // Wait a bit for the async calculation in the API to complete
          setTimeout(() => {
            updateProgress(newGoal.id);
          }, 2000);
        }
      }
      setModalOpen(null);
      setEditingGoal(null);
      setFormData({
        title: '',
        target: '',
        type: 'commits',
        deadline_days: '',
      });
    } catch (err) {
      console.error('Error saving goal:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      target: goal.target.toString(),
      type: goal.type,
      deadline_days: goal.deadline_days.toString(),
    });
    setModalOpen('newGoal');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      try {
        await deleteGoal(id);
      } catch (err) {
        console.error('Error deleting goal:', err);
      }
    }
  };

  const typeLabels: Record<Goal['type'], string> = {
    commits: 'Commits',
    pull_requests: 'Pull Requests',
    code_reviews: 'Code Reviews',
    issues: 'Issues',
    contributions: 'Contributions',
    repositories: 'Repositories',
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 min-h-screen">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">
            Goals
          </h1>
          <p className="text-gray-400 mt-1">
            Track your development goals
          </p>
          {error && (
            <div className="mt-2 px-3 py-2 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setModalOpen('newGoal')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          New Goal
        </button>
        <Modal
          isOpen={modalOpen === 'newGoal'}
          onClose={() => {
            setModalOpen(null);
            setEditingGoal(null);
            setFormData({
              title: '',
              target: '',
              type: 'commits',
              deadline_days: '',
            });
          }}
          title={editingGoal ? 'Edit Goal' : 'New Goal'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Goal Title
              </label>
              <input
                type="text"
                placeholder="Ex: Make 50 commits this month"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Target
                </label>
                <input
                  type="number"
                  placeholder="50"
                  value={formData.target}
                  onChange={(e) =>
                    setFormData({ ...formData, target: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Deadline (days)
                </label>
                <input
                  type="number"
                  placeholder="30"
                  value={formData.deadline_days}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline_days: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                  min="1"
                  required
                />
              </div>
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-900 mb-2"
                htmlFor="tipo"
              >
                Type
              </label>
              <select
                id="tipo"
                aria-label="Goal type"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as Goal['type'],
                  })
                }
                required
              >
                <option value="commits">Commits</option>
                <option value="pull_requests">Pull Requests</option>
                <option value="code_reviews">Code Reviews</option>
                <option value="issues">Issues</option>
                <option value="contributions">Contribuições</option>
                <option value="repositories">Repositórios</option>
              </select>
            </div>
            <button
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              type="submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Salvando...
                </>
              ) : editingGoal ? (
                'Salvar alterações'
              ) : (
                'Criar objetivo'
              )}
            </button>
          </form>
        </Modal>
      </div>

      {/* Goals Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700 animate-pulse"
            >
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-4" />
              <div className="h-3 bg-gray-700 rounded w-full mb-2" />
            </div>
          ))}
        </div>
      ) : goals.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const percentage = (goal.current / goal.target) * 100;
            const isComplete = percentage >= 100;
            const daysRemaining = calculateDaysRemaining(goal.deadline_date);
            const isOverdue = daysRemaining === 0 && !isComplete;

            return (
              <div
                key={goal.id}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {goal.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>
                          {isOverdue
                            ? 'Prazo expirado'
                            : isComplete
                            ? 'Concluído!'
                            : `Faltam ${formatDeadline(daysRemaining)}`}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">
                        {typeLabels[goal.type]}
                      </span>
                    </div>
                  </div>
                  {isComplete && (
                    <div className="p-2 bg-green-500/20 rounded-full">
                      <Check className="text-green-400" size={20} />
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progresso</span>
                    <span className="font-semibold text-white">
                      {goal.current} / {goal.target}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        isComplete
                          ? 'bg-green-500'
                          : isOverdue
                          ? 'bg-red-500'
                          : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-right mt-1">
                    <span
                      className={`text-sm font-medium ${
                        isComplete
                          ? 'text-green-400'
                          : isOverdue
                          ? 'text-red-400'
                          : 'text-blue-400'
                      }`}
                    >
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(goal)}
                    className="flex-1 px-4 py-2 border border-gray-600 hover:bg-gray-700 rounded-lg transition-colors text-sm text-gray-300 flex items-center justify-center gap-2"
                  >
                    <Edit size={16} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    aria-label="Excluir objetivo"
                    title="Excluir objetivo"
                    className="px-4 py-2 border border-red-500/50 hover:bg-red-500/20 rounded-lg transition-colors text-sm text-red-400 flex items-center justify-center"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                    <span className="sr-only">Excluir</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
          <p className="text-gray-400 mb-4">No goals created yet</p>
          <button
            onClick={() => setModalOpen('newGoal')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Create first goal
          </button>
        </div>
      )}
    </div>
  );
};

export default GoalsView;
