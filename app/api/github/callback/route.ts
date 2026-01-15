import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    // Trocar código pelo access token
    const tokenResponse = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: code,
        }),
      }
    )

    const data = await tokenResponse.json()

    if (data.access_token) {
      // Buscar dados do utilizador do GitHub
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${data.access_token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      })
      const userData = await userResponse.json()

      return NextResponse.json({
        access_token: data.access_token,
        user: userData,
      })
    }

    return NextResponse.json(
      { error: 'Falha ao obter token' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Erro no callback:', error)
    return NextResponse.json(
      { error: 'Erro na autenticação' },
      { status: 500 }
    )
  }
}