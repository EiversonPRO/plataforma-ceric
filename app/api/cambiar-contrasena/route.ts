import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcryptjs'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const { password } = body as { password: string }

  if (!password || password.length < 8) {
    return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres' }, { status: 400 })
  }

  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)

  if (!hasUppercase || !hasNumber) {
    return NextResponse.json(
      { error: 'La contraseña debe tener al menos una mayúscula y un número' },
      { status: 400 }
    )
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      passwordHash,
      forcePasswordChange: false,
      status: 'ACTIVE',
    },
  })

  return NextResponse.json({ ok: true })
}
