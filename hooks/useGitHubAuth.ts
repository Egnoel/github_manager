'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export function useGitHubAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check initial session
    checkSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: string, session: { user: User | null } | null) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const checkSession = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    } catch (error) {
      console.error('Error checking session:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          scopes: 'repo user',
        },
      })
      if (error) throw error
    } catch (error) {
      console.error('Error signing in:', error)
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      // Redirect to home page
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return { user, loading, login, logout }
}
