'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  ClipboardList,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

function isNavItemActive(pathname: string, href: string): boolean {
  // Exact match for dashboard roots, prefix match for nested routes
  const exactMatchRoutes = ['/admin', '/dashboard/acudiente', '/dashboard/docente-colegio']
  if (exactMatchRoutes.includes(href)) {
    return pathname === href
  }
  return pathname.startsWith(href)
}

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/estudiantes', label: 'Estudiantes', icon: Users },
  { href: '/admin/talleres', label: 'Talleres', icon: BookOpen },
  { href: '/admin/observaciones', label: 'Observaciones', icon: ClipboardList },
  { href: '/admin/mensajes', label: 'Mensajes', icon: MessageSquare },
  { href: '/admin/notificaciones', label: 'Notificaciones', icon: Bell },
  { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
]

const teacherNavItems = [
  { href: '/dashboard/docente-colegio', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/docente-colegio/estudiantes', label: 'Mis Estudiantes', icon: Users },
  { href: '/dashboard/docente-colegio/observaciones', label: 'Observaciones', icon: ClipboardList },
  { href: '/dashboard/docente-colegio/mensajes', label: 'Mensajes', icon: MessageSquare },
]

const guardianNavItems = [
  { href: '/dashboard/acudiente', label: 'Inicio', icon: LayoutDashboard },
  { href: '/dashboard/acudiente/reportes', label: 'Informes', icon: BookOpen },
  { href: '/dashboard/acudiente/mensajes', label: 'Mensajes', icon: MessageSquare },
]

function getNavItems(role: string) {
  if (role === 'TEACHER_PLATFORM') return adminNavItems
  if (role === 'TEACHER_SCHOOL') return teacherNavItems
  return guardianNavItems
}

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = session?.user?.role ?? ''
  const navItems = getNavItems(role)

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white border-r border-[#E7E5E4] py-6 px-4">
      {/* Brand */}
      <div className="mb-8 px-2">
        <p className="font-display font-bold text-2xl text-[#F97316]">CERIC</p>
        <p className="text-xs text-[#78716C] mt-0.5">Kennedy Cantonera</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = isNavItemActive(pathname, href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#FFF7ED] text-[#F97316]'
                  : 'text-[#78716C] hover:bg-[#FAFAF9] hover:text-[#1C1917]'
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User & logout */}
      <div className="pt-4 border-t border-[#E7E5E4]">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium text-[#1C1917] truncate">{session?.user?.name}</p>
          <p className="text-xs text-[#78716C] truncate">{session?.user?.email}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-[#78716C] hover:text-danger"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <LogOut size={18} />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  )
}
