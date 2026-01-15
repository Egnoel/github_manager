import { NextResponse } from 'next/server'
import { fetchRepoCommits } from '@/lib/github-api'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  try {
    const { owner, repo } = await params
    const commits = await fetchRepoCommits(owner, repo)
    return NextResponse.json(commits)
  } catch (error) {
    console.error('Error fetching commits:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error fetching commits' },
      { status: 401 }
    )
  }
}