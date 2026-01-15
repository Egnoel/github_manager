import { NextResponse } from 'next/server'
import { getCommitsLast7Days, getPullRequestsCount } from '@/lib/github-api'
import { fetchGitHubRepos } from '@/lib/github-api'

export async function GET() {
  try {
    const [commits, pullRequests, reposData] = await Promise.all([
      getCommitsLast7Days().catch(() => 0),
      getPullRequestsCount().catch(() => 0),
      fetchGitHubRepos(1, 100).catch(() => ({ repos: [] })),
    ])

    const openIssues = reposData.repos.reduce(
      (sum: number, repo: any) => sum + (repo.open_issues_count || 0),
      0
    )
    const activeRepos = reposData.repos.length

    return NextResponse.json({
      commits,
      pullRequests,
      openIssues,
      activeRepos,
    })
  } catch (error) {
    console.error('Error fetching stats summary:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to fetch stats summary'

    // If there is no GitHub token / user, treat as unauthorized
    const status = message.includes('No GitHub token') ? 401 : 500

    return NextResponse.json({ error: message }, { status })
  }
}
