import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function getRolLabel(role: string): string {
  const labels: Record<string, string> = {
    TEACHER_PLATFORM: 'Docente Plataforma',
    TEACHER_SCHOOL: 'Docente Colegio',
    GUARDIAN: 'Acudiente',
  }
  return labels[role] || role
}

export function getDashboardByRole(role: string): string {
  const dashboards: Record<string, string> = {
    TEACHER_PLATFORM: '/admin',
    TEACHER_SCHOOL: '/dashboard/docente-colegio',
    GUARDIAN: '/dashboard/acudiente',
  }
  return dashboards[role] || '/dashboard'
}
