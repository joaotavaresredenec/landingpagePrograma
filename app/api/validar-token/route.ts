import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/lib/magic-link'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')

  if (!token) {
    return NextResponse.json({ valido: false }, { status: 400 })
  }

  const session = await validateToken(token)

  if (!session) {
    return NextResponse.json({ valido: false }, { status: 404 })
  }

  return NextResponse.json({ valido: true }, { status: 200 })
}
