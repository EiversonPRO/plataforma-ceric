import { NextRequest } from 'next/server'
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export async function GET(req: NextRequest) {
  return handler(req as never, undefined as never)
}

export async function POST(req: NextRequest) {
  return handler(req as never, undefined as never)
}
