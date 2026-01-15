'use client';
import React, { useState, useMemo } from 'react';
import {
  GitBranch,
  GitPullRequest,
  AlertCircle,
  Star,
  Settings,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { ModalStates } from '@/data';
import Modal from '@/components/Modal';
import { useGitHubRepos } from '@/hooks/useGitHubData';
import { useGitHubAuth } from '@/hooks/useGitHubAuth';

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days ago`
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} months ago`
  return `${Math.floor(seconds / 31536000)} years ago`
}

const RepositoriesView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState<ModalStates | null>(null);
  const { user } = useGitHubAuth();
  const { repos, pagination, loading, error } = useGitHubRepos(currentPage, 30, sortBy);

  const filteredRepos = useMemo(() => {
    return repos.filter((repo) => {
      const matchesSearch = repo.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const isActive = new Date(repo.updated_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const matchesFilter =
        selectedFilter === 'all' ||
        (selectedFilter === 'active' && isActive) ||
        (selectedFilter === 'inactive' && !isActive);
      
      return matchesSearch && matchesFilter;
    });
  }, [repos, searchTerm, selectedFilter]);

  return (
    <div className="p-4 lg:p-8 space-y-6 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 min-h-screen">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">
            Repositories
          </h1>
          <p className="text-gray-400 mt-1">
            {loading ? 'Loading...' : `${repos.length} repositories found`}
          </p>
          {error && (
            <div className="mt-2 px-3 py-2 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setModalOpen('newRepo')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Novo Repositório
        </button>
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
      </div>

      {/* Search and Filter */}
      <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-700">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Sort repositories"
              className="px-4 py-2 bg-gray-700/50 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="updated">Most recent</option>
              <option value="created">Oldest</option>
              <option value="full_name">Name (A-Z)</option>
              <option value="stars">Most stars</option>
            </select>
            {['all', 'active', 'inactive'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-gray-600'
                }`}
              >
                {filter === 'all'
                  ? 'All'
                  : filter === 'active'
                  ? 'Active'
                  : 'Inactive'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Repositories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700 animate-pulse"
            >
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-4" />
              <div className="flex gap-4 mb-4">
                <div className="h-4 bg-gray-700 rounded w-16" />
                <div className="h-4 bg-gray-700 rounded w-16" />
                <div className="h-4 bg-gray-700 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredRepos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredRepos.map((repo) => {
              const isActive = new Date(repo.updated_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
              const updatedDate = new Date(repo.updated_at);
              const timeAgo = getTimeAgo(updatedDate);
              
              return (
                <div
                  key={repo.id}
                  className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700 hover:shadow-xl hover:border-blue-500/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-white">
                          {repo.name}
                        </h3>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isActive ? 'bg-green-500' : 'bg-gray-500'
                          }`}
                        ></span>
                        {repo.private && (
                          <span className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded">
                            Private
                          </span>
                        )}
                      </div>
                      {repo.description && (
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                          {repo.description}
                        </p>
                      )}
                      {repo.language && (
                        <p className="text-sm text-gray-500 mt-1">{repo.language}</p>
                      )}
                    </div>
                    <a
                      href={repo.html_url || `https://github.com/${repo.full_name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                      title="Abrir no GitHub"
                    >
                      <Settings size={20} />
                    </a>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star
                        size={16}
                        fill="currentColor"
                        className="text-yellow-500"
                      />
                      <span>{repo.stargazers_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GitBranch size={16} />
                      <span>{repo.forks_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertCircle size={16} />
                      <span>{repo.open_issues_count}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <span className="text-xs text-gray-500">
                      Atualizado {timeAgo}
                    </span>
                    <a
                      href={repo.html_url || `https://github.com/${repo.full_name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      Ver no GitHub →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={!pagination.hasPrev || loading}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  pagination.hasPrev && !loading
                    ? 'bg-gray-800/50 text-white hover:bg-gray-700 border border-gray-600'
                    : 'bg-gray-800/30 text-gray-500 cursor-not-allowed border border-gray-700'
                }`}
              >
                <ChevronLeft size={20} />
                Previous
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      disabled={loading}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700 border border-gray-600'
                      } ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={!pagination.hasNext || loading}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  pagination.hasNext && !loading
                    ? 'bg-gray-800/50 text-white hover:bg-gray-700 border border-gray-600'
                    : 'bg-gray-800/30 text-gray-500 cursor-not-allowed border border-gray-700'
                }`}
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
          <p className="text-gray-400">
            {searchTerm ? 'No repositories found with this search' : 'No repositories found'}
          </p>
        </div>
      )}
    </div>
  );
};
export default RepositoriesView;
