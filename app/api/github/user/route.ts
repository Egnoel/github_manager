import { NextResponse } from 'next/server'
import { fetchGitHubUser } from '@/lib/github-api'

export async function GET() {
  try {
    const user = await fetchGitHubUser()
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching GitHub user:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to fetch user data'

    // If there is no GitHub token / user, treat as unauthorized
    const status = message.includes('No GitHub token') ? 401 : 500

    return NextResponse.json({ error: message }, { status })
  }
}
