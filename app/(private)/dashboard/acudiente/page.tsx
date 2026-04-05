import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Bell, UserCheck } from 'lucide-react'

export default async function AcudientePage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'GUARDIAN') redirect('/login')

  const guardianProfile = await prisma.guardianProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      studentGuardians: {
        include: {
          student: {
            include: {
              enrollments: { include: { workshop: true } },
              progressReports: {
                orderBy: { createdAt: 'desc' },
                take: 1,
              },
            },
          },
        },
      },
    },
  })

  const unreadNotifications = await prisma.notification.count({
    where: { userId: session.user.id, read: false },
  })

  const recentReports = guardianProfile?.studentGuardians.flatMap(
    (sg) => sg.student.progressReports
  ) ?? []

  function ratingLabel(rating: string) {
    const map: Record<string, { label: string; variant: 'success' | 'info' | 'warning' | 'destructive' }> = {
      EXCELLENT: { label: 'Excelente', variant: 'success' },
      GOOD: { label: 'Bueno', variant: 'info' },
      IN_PROGRESS: { label: 'En progreso', variant: 'warning' },
      NEEDS_SUPPORT: { label: 'Necesita apoyo', variant: 'destructive' },
    }
    return map[rating] ?? { label: rating, variant: 'outline' as const }
  }

  const students = guardianProfile?.studentGuardians.map((sg) => sg.student) ?? []

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1
          className="text-2xl font-extrabold text-[#1C1917]"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Bienvenido/a, {session.user.name}
        </h1>
        <p className="text-[#78716C] text-sm mt-1">
          Seguimiento de tus estudiantes en CERIC
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-[#78716C]">Mis estudiantes</CardTitle>
            <UserCheck size={18} className="text-[#F97316]" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#1C1917]">{students.length}</p>
            <p className="text-xs text-[#78716C] mt-1">vinculados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-[#78716C]">Informes</CardTitle>
            <BookOpen size={18} className="text-[#10B981]" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#1C1917]">{recentReports.length}</p>
            <p className="text-xs text-[#78716C] mt-1">disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-[#78716C]">Notificaciones</CardTitle>
            <Bell size={18} className="text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#1C1917]">{unreadNotifications}</p>
            <p className="text-xs text-[#78716C] mt-1">sin leer</p>
          </CardContent>
        </Card>
      </div>

      {/* Students list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#1C1917]">
            Mis estudiantes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {students.length === 0 ? (
            <p className="text-sm text-[#78716C]">No tienes estudiantes vinculados aún.</p>
          ) : (
            students.map((student) => {
              const latestReport = student.progressReports[0]
              const workshops = student.enrollments.map((e) => e.workshop.name)
              return (
                <div
                  key={student.id}
                  className="p-4 rounded-lg border border-[#E7E5E4] space-y-2 hover:bg-[#FAFAF9]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#1C1917]">{student.name}</p>
                      <p className="text-xs text-[#78716C]">
                        Grado {student.grade} · Nacido el {formatDate(student.birthDate)}
                      </p>
                    </div>
                    {latestReport && (
                      <Badge variant={ratingLabel(latestReport.rating).variant}>
                        {ratingLabel(latestReport.rating).label}
                      </Badge>
                    )}
                  </div>
                  {workshops.length > 0 && (
                    <p className="text-xs text-[#78716C]">
                      Talleres: {workshops.join(', ')}
                    </p>
                  )}
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
