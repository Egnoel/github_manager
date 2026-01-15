import { NextResponse } from 'next/server'
import { fetchWeeklyCommitActivity } from '@/lib/github-api'

export async function GET() {
  try {
    const data = await fetchWeeklyCommitActivity()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching weekly activity:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to fetch weekly activity'

    // If there is no GitHub token / user, treat as unauthorized
    const status = message.includes('No GitHub token') ? 401 : 500

    return NextResponse.json({ error: message }, { status })
  }
}

