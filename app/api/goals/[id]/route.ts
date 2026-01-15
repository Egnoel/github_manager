import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { title, target, current, type, deadline_days } = body

    // Build update object
    const updates: any = {}
    if (title !== undefined) updates.title = title
    if (target !== undefined) updates.target = parseInt(target)
    if (current !== undefined) updates.current = parseInt(current)
    if (type !== undefined) updates.type = type
    if (deadline_days !== undefined) {
      updates.deadline_days = parseInt(deadline_days)
      const deadlineDate = new Date()
      deadlineDate.setDate(deadlineDate.getDate() + parseInt(deadline_days))
      updates.deadline_date = deadlineDate.toISOString()
    }

    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating goal:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update goal' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting goal:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete goal' },
      { status: 500 }
    )
  }
}
