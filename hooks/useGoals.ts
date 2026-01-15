'use client'

import { useState, useEffect } from 'react'
import { useGitHubAuth } from './useGitHubAuth'

export interface Goal {
  id: string
  user_id: string
  title: string
  current: number
  target: number
  type: 'commits' | 'pull_requests' | 'code_reviews' | 'issues' | 'contributions' | 'repositories'
  deadline_days: number
  deadline_date: string
  created_at: string
  updated_at: string
}

export function useGoals() {
  const { user } = useGitHubAuth()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGoals = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/goals')

      if (!response.ok) {
        throw new Error('Failed to fetch goals')
      }

      const data = await response.json()
      setGoals(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch goals')
      console.error('Error fetching goals:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [user])

  const createGoal = async (
    title: string,
    target: number,
    type: Goal['type'],
    deadlineDays: number
  ) => {
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          target,
          type,
          deadline_days: deadlineDays,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create goal')
      }

      const newGoal = await response.json()
      setGoals((prev) => [newGoal, ...prev])
      return newGoal
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create goal'
      setError(errorMessage)
      throw err
    }
  }

  const updateGoal = async (
    id: string,
    updates: Partial<Pick<Goal, 'title' | 'target' | 'current' | 'type' | 'deadline_days'>>
  ) => {
    try {
      const response = await fetch(`/api/goals/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update goal')
      }

      const updatedGoal = await response.json()
      setGoals((prev) =>
        prev.map((goal) => (goal.id === id ? updatedGoal : goal))
      )
      return updatedGoal
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update goal'
      setError(errorMessage)
      throw err
    }
  }

  const deleteGoal = async (id: string) => {
    try {
      const response = await fetch(`/api/goals/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete goal')
      }

      setGoals((prev) => prev.filter((goal) => goal.id !== id))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete goal'
      setError(errorMessage)
      throw err
    }
  }

  const updateProgress = async (goalId?: string) => {
    try {
      if (goalId) {
        // Update single goal progress
        const response = await fetch('/api/goals/update-progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ goalId }),
        })

        if (!response.ok) {
          throw new Error('Failed to update progress')
        }

        const updatedGoal = await response.json()
        setGoals((prev) =>
          prev.map((goal) => (goal.id === goalId ? updatedGoal : goal))
        )
        return updatedGoal
      } else {
        // Update all goals progress
        const response = await fetch('/api/goals/update-progress', {
          method: 'PUT',
        })

        if (!response.ok) {
          throw new Error('Failed to update progress')
        }

        // Refetch goals to get updated progress
        await fetchGoals()
      }
    } catch (err) {
      console.error('Error updating progress:', err)
      // Don't throw error, just log it
    }
  }

  return {
    goals,
    loading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    updateProgress,
    refetch: fetchGoals,
  }
}
