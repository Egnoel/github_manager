import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { calculateGoalProgress, fetchGitHubUser } from '@/lib/github-api'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching goals:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch goals' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, target, type, deadline_days } = body

    if (!title || !target || !type || !deadline_days) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const deadlineDate = new Date()
    deadlineDate.setDate(deadlineDate.getDate() + parseInt(deadline_days))
    const createdDate = new Date()

    // Insert goal with initial progress of 0
    const { data: newGoal, error } = await supabase
      .from('goals')
      .insert({
        user_id: user.id,
        title,
        target: parseInt(target),
        current: 0,
        type,
        deadline_days: parseInt(deadline_days),
        deadline_date: deadlineDate.toISOString(),
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Calculate initial progress asynchronously (don't block the response)
    // This will update the goal with current progress from GitHub
    try {
      const githubUser = await fetchGitHubUser()
      const username = githubUser.login
      const now = new Date()
      const endDateForCalculation = deadlineDate > now ? now : deadlineDate

      const current = await calculateGoalProgress(
        type as any,
        createdDate,
        endDateForCalculation,
        username
      )

      // Update the goal with calculated progress
      await supabase
        .from('goals')
        .update({ current })
        .eq('id', newGoal.id)
        .eq('user_id', user.id)
    } catch (progressError) {
      // Log error but don't fail the request
      console.error('Error calculating initial progress:', progressError)
    }

    return NextResponse.json(newGoal, { status: 201 })
  } catch (error) {
    console.error('Error creating goal:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create goal' },
      { status: 500 }
    )
  }
}
