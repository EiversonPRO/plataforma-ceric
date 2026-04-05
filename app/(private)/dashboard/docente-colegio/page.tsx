import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, ClipboardList, CheckCircle2 } from 'lucide-react'

export default async function DocenteColegioPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'TEACHER_SCHOOL') redirect('/login')

  const teacherProfile = await prisma.teacherSchoolProfile.findUnique({
    where: { userId: session.user.id },
    include: { school: true },
  })

  const [myObservations, pendingObs, resolvedObs, totalStudents] = await Promise.all([
    prisma.observation.findMany({
      where: { createdBy: session.user.id },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        student: { select: { name: true, grade: true } },
      },
    }),
    prisma.observation.count({ where: { createdBy: session.user.id, status: 'PENDING' } }),
    prisma.observation.count({ where: { createdBy: session.user.id, status: 'RESOLVED' } }),
    teacherProfile?.schoolId
      ? prisma.student.count({ where: { schoolId: teacherProfile.schoolId, status: 'ACTIVE' } })
      : Promise.resolve(0),
  ])

  function statusBadge(status: string) {
    if (status === 'RESOLVED') return <Badge variant="success">Resuelta</Badge>
    if (status === 'IN_PROGRESS') return <Badge variant="info">En gestión</Badge>
    return <Badge variant="warning">Pendiente</Badge>
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1
          className="text-2xl font-extrabold text-[#1C1917]"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Panel docente
        </h1>
        <p className="text-[#78716C] text-sm mt-1">
          {teacherProfile?.school.name} · {teacherProfile?.subjectArea}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-[#78716C]">Estudiantes activos</CardTitle>
            <Users size={18} className="text-[#F97316]" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#1C1917]">{totalStudents}</p>
            <p className="text-xs text-[#78716C] mt-1">en {teacherProfile?.school.name}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-[#78716C]">Mis observaciones</CardTitle>
            <ClipboardList size={18} className="text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#1C1917]">{pendingObs}</p>
            <p className="text-xs text-[#78716C] mt-1">pendientes de gestión</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-[#78716C]">Resueltas</CardTitle>
            <CheckCircle2 size={18} className="text-[#10B981]" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#1C1917]">{resolvedObs}</p>
            <p className="text-xs text-[#78716C] mt-1">observaciones resueltas</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent observations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#1C1917]">
            Mis observaciones recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {myObservations.length === 0 ? (
            <p className="text-sm text-[#78716C]">No has creado observaciones aún.</p>
          ) : (
            <div className="space-y-3">
              {myObservations.map((obs) => (
                <div
                  key={obs.id}
                  className="flex items-start justify-between gap-4 p-4 rounded-lg border border-[#E7E5E4] hover:bg-[#FAFAF9]"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1C1917] truncate">{obs.student.name}</p>
                    <p className="text-xs text-[#78716C]">
                      {obs.subjectArea} · {formatDate(obs.createdAt)}
                    </p>
                    <p className="text-sm text-[#1C1917] mt-1 line-clamp-2">{obs.description}</p>
                  </div>
                  <div className="shrink-0">{statusBadge(obs.status)}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
