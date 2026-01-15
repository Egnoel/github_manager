import { createClient } from '@/lib/supabase-server'

export async function getGitHubToken(): Promise<string | null> {
  try {
    const supabase = await createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return null
    }

    // GitHub OAuth token is stored in provider_token
    return session.provider_token || null
  } catch (error) {
    console.error('Error getting GitHub token:', error)
    return null
  }
}

export async function fetchGitHubRepos(page: number = 1, perPage: number = 30, sort: string = 'updated', affiliation: string = 'owner,collaborator') {
  const token = await getGitHubToken()
  if (!token) {
    throw new Error('No GitHub token available')
  }

  const response = await fetch(
    `https://api.github.com/user/repos?sort=${sort}&per_page=${perPage}&page=${page}&affiliation=${affiliation}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  )

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`)
  }

  // Get pagination info from headers
  const linkHeader = response.headers.get('link')
  const totalPages = linkHeader ? extractTotalPages(linkHeader) : 1

  const repos = await response.json()
  
  return {
    repos: Array.isArray(repos) ? repos : [],
    pagination: {
      page,
      perPage,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}

function extractTotalPages(linkHeader: string): number {
  const links = linkHeader.split(',')
  const lastLink = links.find(link => link.includes('rel="last"'))
  if (lastLink) {
    const match = lastLink.match(/[?&]page=(\d+)/)
    return match ? parseInt(match[1], 10) : 1
  }
  return 1
}

export async function fetchGitHubUser() {
  const token = await getGitHubToken()
  if (!token) {
    throw new Error('No GitHub token available')
  }

  const response = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`)
  }

  return response.json()
}

export async function fetchRepoCommits(owner: string, repo: string) {
  const token = await getGitHubToken()
  if (!token) {
    throw new Error('No GitHub token available')
  }

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits?per_page=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  )

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`)
  }

  return response.json()
}

export async function fetchUserActivity() {
  const token = await getGitHubToken()
  if (!token) {
    throw new Error('No GitHub token available')
  }

  // Fetch user events to calculate activity
  const response = await fetch(
    'https://api.github.com/users/events/public?per_page=100',
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  )

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Fetch weekly commit activity for the authenticated user.
 * Returns an array of { day: 'Mon' | ... | 'Sun', commits: number }
 */
export async function fetchWeeklyCommitActivity() {
  const token = await getGitHubToken()
  if (!token) {
    throw new Error('No GitHub token available')
  }

  const user = await fetchGitHubUser()
  const username = user.login
  if (!username) {
    throw new Error('GitHub username not available')
  }

  // Fetch recent public events for the user
  const response = await fetch(
    `https://api.github.com/users/${username}/events/public?per_page=100`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  )

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`)
  }

  const events = await response.json()

  // Initialize counts for each weekday (Mon-Sun)
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
  const counts: Record<string, number> = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  }

  const now = new Date()
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(now.getDate() - 6) // last 7 days (inclusive)

  for (const event of events) {
    if (event.type !== 'PushEvent') continue
    const eventDate = new Date(event.created_at)
    if (eventDate < sevenDaysAgo || eventDate > now) continue

    const dayIndex = eventDate.getUTCDay()
    const dayLabel = weekdays[dayIndex]
    const commitsInEvent =
      Array.isArray(event.payload?.commits) && event.payload.commits.length > 0
        ? event.payload.commits.length
        : 1

    counts[dayLabel] += commitsInEvent
  }

  // Return data ordered Mon-Sun to match chart labels
  const orderedDays: Array<keyof typeof counts> = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun',
  ]

  return orderedDays.map((day) => ({
    day,
    commits: counts[day],
  }))
}

export async function fetchUserStats() {
  const token = await getGitHubToken()
  if (!token) {
    throw new Error('No GitHub token available')
  }

  // Fetch user and repos to calculate stats
  const [userResponse, reposResponse] = await Promise.all([
    fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }),
    fetch('https://api.github.com/user/repos?per_page=100&affiliation=owner,collaborator', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }),
  ])

  if (!userResponse.ok || !reposResponse.ok) {
    throw new Error(`GitHub API error`)
  }

  const user = await userResponse.json()
  const repos = await reposResponse.json()

  // Calculate stats
  const totalStars = repos.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0)
  const totalForks = repos.reduce((sum: number, repo: any) => sum + repo.forks_count, 0)
  const totalIssues = repos.reduce((sum: number, repo: any) => sum + repo.open_issues_count, 0)

  return {
    publicRepos: repos.filter((r: any) => !r.private).length,
    totalRepos: repos.length,
    totalStars,
    totalForks,
    totalIssues,
    followers: user.followers || 0,
    following: user.following || 0,
  }
}

/**
 * Calculate progress for a goal based on GitHub data
 */
export async function calculateGoalProgress(
  type: 'commits' | 'pull_requests' | 'code_reviews' | 'issues' | 'contributions' | 'repositories',
  startDate: Date,
  endDate: Date,
  username?: string
): Promise<number> {
  const token = await getGitHubToken()
  if (!token) {
    throw new Error('No GitHub token available')
  }

  // Get username if not provided
  let finalUsername = username
  if (!finalUsername) {
    const user = await fetchGitHubUser()
    finalUsername = user.login
  }

  if (!finalUsername) {
    throw new Error('GitHub username not available')
  }

  const since = startDate.toISOString()
  const until = endDate.toISOString()

  switch (type) {
    case 'commits': {
      return await calculateCommitsProgress(token, finalUsername, since, until)
    }
    case 'pull_requests': {
      return await calculatePullRequestsProgress(token, finalUsername, since, until)
    }
    case 'code_reviews': {
      return await calculateCodeReviewsProgress(token, finalUsername, since, until)
    }
    case 'issues': {
      return await calculateIssuesProgress(token, finalUsername, since, until)
    }
    case 'contributions': {
      return await calculateContributionsProgress(token, finalUsername, since, until)
    }
    case 'repositories': {
      return await calculateRepositoriesProgress(token, since, until)
    }
    default:
      return 0
  }
}

async function calculateCommitsProgress(
  token: string,
  username: string,
  since: string,
  until: string
): Promise<number> {
  // Fetch all repos
  const repos = await fetchGitHubRepos(1, 100)
  let totalCommits = 0

  // Fetch commits from each repo
  for (const repo of repos.repos) {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${repo.full_name}/commits?author=${username}&since=${since}&until=${until}&per_page=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      )

      if (response.ok) {
        const commits = await response.json()
        totalCommits += commits.length

        // Handle pagination
        const linkHeader = response.headers.get('link')
        if (linkHeader && linkHeader.includes('rel="next"')) {
          // For simplicity, we'll count up to 100 commits per repo
          // In production, you might want to paginate through all commits
        }
      }
    } catch (error) {
      console.error(`Error fetching commits for ${repo.full_name}:`, error)
    }
  }

  return totalCommits
}

async function calculatePullRequestsProgress(
  token: string,
  username: string,
  since: string,
  until: string
): Promise<number> {
  const response = await fetch(
    `https://api.github.com/search/issues?q=author:${username}+type:pr+created:${since}..${until}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  )

  if (!response.ok) {
    return 0
  }

  const data = await response.json()
  return data.total_count || 0
}

async function calculateCodeReviewsProgress(
  token: string,
  username: string,
  since: string,
  until: string
): Promise<number> {
  // Fetch user events to find review comments
  const response = await fetch(
    `https://api.github.com/users/${username}/events/public?per_page=100`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  )

  if (!response.ok) {
    return 0
  }

  const events = await response.json()
  const reviewEvents = events.filter((event: any) => {
    if (event.type !== 'PullRequestReviewEvent') return false
    const eventDate = new Date(event.created_at)
    return eventDate >= new Date(since) && eventDate <= new Date(until)
  })

  return reviewEvents.length
}

async function calculateIssuesProgress(
  token: string,
  username: string,
  since: string,
  until: string
): Promise<number> {
  const response = await fetch(
    `https://api.github.com/search/issues?q=author:${username}+type:issue+created:${since}..${until}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  )

  if (!response.ok) {
    return 0
  }

  const data = await response.json()
  return data.total_count || 0
}

async function calculateContributionsProgress(
  token: string,
  username: string,
  since: string,
  until: string
): Promise<number> {
  // Contributions = commits + PRs + issues + reviews
  const [commits, prs, issues, reviews] = await Promise.all([
    calculateCommitsProgress(token, username, since, until),
    calculatePullRequestsProgress(token, username, since, until),
    calculateIssuesProgress(token, username, since, until),
    calculateCodeReviewsProgress(token, username, since, until),
  ])

  return commits + prs + issues + reviews
}

async function calculateRepositoriesProgress(
  token: string,
  since: string,
  until: string
): Promise<number> {
  const repos = await fetchGitHubRepos(1, 100)
  const startDate = new Date(since)
  const endDate = new Date(until)

  return repos.repos.filter((repo: any) => {
    const createdAt = new Date(repo.created_at)
    return createdAt >= startDate && createdAt <= endDate
  }).length
}

/**
 * Get commits count for the last 7 days
 */
export async function getCommitsLast7Days(): Promise<number> {
  const token = await getGitHubToken()
  if (!token) {
    throw new Error('No GitHub token available')
  }

  const user = await fetchGitHubUser()
  const username = user.login
  if (!username) {
    throw new Error('GitHub username not available')
  }

  const now = new Date()
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(now.getDate() - 7)
  
  const since = sevenDaysAgo.toISOString()
  const until = now.toISOString()

  return await calculateCommitsProgress(token, username, since, until)
}

/**
 * Get pull requests count (open and recently closed)
 */
export async function getPullRequestsCount(): Promise<number> {
  const token = await getGitHubToken()
  if (!token) {
    throw new Error('No GitHub token available')
  }

  const user = await fetchGitHubUser()
  const username = user.login
  if (!username) {
    throw new Error('GitHub username not available')
  }

  // Get PRs created in the last 30 days (to show recent activity)
  const now = new Date()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(now.getDate() - 30)
  
  const since = thirtyDaysAgo.toISOString()
  const until = now.toISOString()

  return await calculatePullRequestsProgress(token, username, since, until)
}
