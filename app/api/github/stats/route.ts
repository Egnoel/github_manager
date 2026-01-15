import { NextResponse } from 'next/server'
import { fetchUserStats } from '@/lib/github-api'

export async function GET() {
  try {
    const stats = await fetchUserStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error fetching statistics' },
      { status: 401 }
    )
  }
}
