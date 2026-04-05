'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { LayoutDashboard, Users, BookOpen, MessageSquare, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'

const adminItems = [
  { href: '/admin', label: 'Inicio', icon: LayoutDashboard },
  { href: '/admin/estudiantes', label: 'Estudiantes', icon: Users },
  { href: '/admin/talleres', label: 'Talleres', icon: BookOpen },
  { href: '/admin/observaciones', label: 'Observaciones', icon: ClipboardList },
  { href: '/admin/mensajes', label: 'Mensajes', icon: MessageSquare },
]

const teacherItems = [
  { href: '/dashboard/docente-colegio', label: 'Inicio', icon: LayoutDashboard },
  { href: '/dashboard/docente-colegio/estudiantes', label: 'Estudiantes', icon: Users },
  { href: '/dashboard/docente-colegio/observaciones', label: 'Observaciones', icon: ClipboardList },
  { href: '/dashboard/docente-colegio/mensajes', label: 'Mensajes', icon: MessageSquare },
]

const guardianItems = [
  { href: '/dashboard/acudiente', label: 'Inicio', icon: LayoutDashboard },
  { href: '/dashboard/acudiente/reportes', label: 'Informes', icon: BookOpen },
  { href: '/dashboard/acudiente/mensajes', label: 'Mensajes', icon: MessageSquare },
]

function getItems(role: string) {
  if (role === 'TEACHER_PLATFORM') return adminItems
  if (role === 'TEACHER_SCHOOL') return teacherItems
  return guardianItems
}

export function BottomNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = session?.user?.role ?? ''
  const items = getItems(role)

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[#E7E5E4] z-40 safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {items.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors min-w-[60px]',
                isActive ? 'text-[#F97316]' : 'text-[#78716C]'
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.75} />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
