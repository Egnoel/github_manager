'use client'

import { useState, useEffect } from 'react'
import { useGitHubAuth } from './useGitHubAuth'

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  updated_at: string
  private: boolean
  owner: {
    login: string
    avatar_url: string
  }
}

interface GitHubCommit {
  sha: string
  commit: {
    message: string
    author: {
      name: string
      date: string
    }
  }
  author: {
    login: string
    avatar_url: string
  }
}

interface PaginationInfo {
  page: number
  perPage: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export function useGitHubRepos(page: number = 1, perPage: number = 30, sort: string = 'updated') {
  const { user } = useGitHubAuth()
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    perPage: 30,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      setRepos([])
      return
    }

    const fetchRepos = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/github/repos?page=${page}&per_page=${perPage}&sort=${sort}`)
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || 'Failed to fetch repositories')
        }

        const data = await response.json()
        setRepos(Array.isArray(data.repos) ? data.repos : [])
        if (data.pagination) {
          setPagination(data.pagination)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch repositories'
        setError(errorMessage)
        console.error('Error fetching repos:', err)
        setRepos([])
      } finally {
        setLoading(false)
      }
    }

    fetchRepos()
  }, [user, page, perPage, sort])

  return { repos, pagination, loading, error }
}

export function useRepoCommits(owner: string, repo: string) {
  const { user } = useGitHubAuth()
  const [commits, setCommits] = useState<GitHubCommit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !owner || !repo) {
      setLoading(false)
      return
    }

    const fetchCommits = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/github/commits/${owner}/${repo}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch commits')
        }

        const data = await response.json()
        setCommits(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch commits')
        console.error('Error fetching commits:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCommits()
  }, [user, owner, repo])

  return { commits, loading, error }
}
