import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { calculateGoalProgress } from '@/lib/github-api'
import { fetchGitHubUser } from '@/lib/github-api'

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
    const { goalId } = body

    if (!goalId) {
      return NextResponse.json(
        { error: 'Goal ID is required' },
        { status: 400 }
      )
    }

    // Fetch the goal
    const { data: goal, error: goalError } = await supabase
      .from('goals')
      .select('*')
      .eq('id', goalId)
      .eq('user_id', user.id)
      .single()

    if (goalError || !goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      )
    }

    // Get GitHub username
    const githubUser = await fetchGitHubUser()
    const username = githubUser.login

    // Calculate progress from goal creation date to deadline
    const startDate = new Date(goal.created_at)
    const endDate = new Date(goal.deadline_date)
    const now = new Date()

    // Use current date if deadline hasn't passed yet
    const endDateForCalculation = endDate > now ? now : endDate

    const current = await calculateGoalProgress(
      goal.type as any,
      startDate,
      endDateForCalculation,
      username
    )

    // Update the goal with new progress
    const { data: updatedGoal, error: updateError } = await supabase
      .from('goals')
      .update({ current })
      .eq('id', goalId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      throw updateError
    }

    return NextResponse.json(updatedGoal)
  } catch (error) {
    console.error('Error updating goal progress:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update goal progress' },
      { status: 500 }
    )
  }
}

// Update all goals for the current user
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all active goals
    const { data: goals, error: goalsError } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)

    if (goalsError) {
      throw goalsError
    }

    if (!goals || goals.length === 0) {
      return NextResponse.json({ updated: 0 })
    }

    // Get GitHub username
    const githubUser = await fetchGitHubUser()
    const username = githubUser.login

    // Update progress for each goal
    const updatePromises = goals.map(async (goal) => {
      try {
        const startDate = new Date(goal.created_at)
        const endDate = new Date(goal.deadline_date)
        const now = new Date()
        const endDateForCalculation = endDate > now ? now : endDate

        const current = await calculateGoalProgress(
          goal.type as any,
          startDate,
          endDateForCalculation,
          username
        )

        return supabase
          .from('goals')
          .update({ current })
          .eq('id', goal.id)
          .eq('user_id', user.id)
      } catch (error) {
        console.error(`Error updating goal ${goal.id}:`, error)
        return null
      }
    })

    await Promise.all(updatePromises)

    return NextResponse.json({ updated: goals.length })
  } catch (error) {
    console.error('Error updating goals progress:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update goals progress' },
      { status: 500 }
    )
  }
}
