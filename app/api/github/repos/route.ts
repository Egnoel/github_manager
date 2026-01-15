import { NextRequest, NextResponse } from 'next/server'
import { fetchGitHubRepos } from '@/lib/github-api'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1', 10)
    const perPage = parseInt(searchParams.get('per_page') || '30', 10)
    const sort = searchParams.get('sort') || 'updated'
    const affiliation = searchParams.get('affiliation') || 'owner,collaborator'

    const result = await fetchGitHubRepos(page, perPage, sort, affiliation)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching repos:', error)
    const message =
      error instanceof Error ? error.message : 'Error fetching repositories'

    // GitHub OAuth token missing/expired
    if (message === 'No GitHub token available') {
      return NextResponse.json(
        { error: 'GitHub is not connected. Please sign in again.' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}