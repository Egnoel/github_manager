'use client';
import React, { useState } from 'react';
import {
  GitBranch,
  GitPullRequest,
  AlertCircle,
  Star,
  Settings,
  Search,
  Plus,
} from 'lucide-react';
import { allRepos, ModalStates } from '@/data';

const RepositoriesView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState<ModalStates | null>(null);

  const filteredRepos = allRepos.filter((repo) => {
    const matchesSearch = repo.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === 'all' || repo.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Repositórios
          </h1>
          <p className="text-gray-600 mt-1">
            {allRepos.length} repositórios no total
          </p>
        </div>
        <button
          onClick={() => setModalOpen('newRepo')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Novo Repositório
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Pesquisar repositórios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'inactive'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter === 'all'
                  ? 'Todos'
                  : filter === 'active'
                  ? 'Ativos'
                  : 'Inativos'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Repositories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredRepos.map((repo, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {repo.name}
                  </h3>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      repo.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  ></span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{repo.language}</p>
              </div>
              <button
                className="text-gray-400 hover:text-gray-600"
                title="Configurações"
              >
                <Settings size={20} />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Star
                  size={16}
                  fill="currentColor"
                  className="text-yellow-500"
                />
                <span>{repo.stars}</span>
              </div>
              <div className="flex items-center gap-1">
                <GitBranch size={16} />
                <span>{repo.forks}</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertCircle size={16} />
                <span>{repo.issues}</span>
              </div>
              <div className="flex items-center gap-1">
                <GitPullRequest size={16} />
                <span>{repo.prs}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-400">
                Atualizado {repo.updated}
              </span>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Ver detalhes →
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRepos.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum repositório encontrado</p>
        </div>
      )}
    </div>
  );
};
export default RepositoriesView;
