import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, ClipboardList, AlertTriangle } from 'lucide-react'

async function getMetrics() {
  const [
    totalStudents,
    activeStudents,
    atRiskStudents,
    totalWorkshops,
    pendingObservations,
    urgentObservations,
    lastObservations,
  ] = await Promise.all([
    prisma.student.count(),
    prisma.student.count({ where: { status: 'ACTIVE' } }),
    prisma.student.count({ where: { status: { in: ['AT_RISK', 'FOLLOW_UP'] } } }),
    prisma.workshop.count({ where: { status: 'ACTIVE' } }),
    prisma.observation.count({ where: { status: 'PENDING' } }),
    prisma.observation.count({ where: { status: 'PENDING', urgencyLevel: 'URGENT' } }),
    prisma.observation.findMany({
      where: { status: 'PENDING' },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        student: { select: { name: true, grade: true } },
        creator: { select: { name: true } },
      },
    }),
  ])

  return {
    totalStudents,
    activeStudents,
    atRiskStudents,
    totalWorkshops,
    pendingObservations,
    urgentObservations,
    lastObservations,
  }
}

function urgencyBadge(level: string) {
  if (level === 'URGENT') return <Badge variant="destructive">Urgente</Badge>
  if (level === 'PRIORITY') return <Badge variant="warning">Prioritaria</Badge>
  return <Badge variant="outline">Normal</Badge>
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'TEACHER_PLATFORM') redirect('/login')

  const m = await getMetrics()

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-extrabold text-[#1C1917]"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Panel de administración
        </h1>
        <p className="text-[#78716C] text-sm mt-1">
          Bienvenido, {session.user.name}
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-[#78716C]">Total estudiantes</CardTitle>
            <Users size={18} className="text-[#F97316]" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#1C1917]">{m.totalStudents}</p>
            <p className="text-xs text-[#78716C] mt-1">{m.activeStudents} activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-[#78716C]">En seguimiento</CardTitle>
            <AlertTriangle size={18} className="text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#1C1917]">{m.atRiskStudents}</p>
            <p className="text-xs text-[#78716C] mt-1">Seguimiento / En riesgo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-[#78716C]">Talleres activos</CardTitle>
            <BookOpen size={18} className="text-[#10B981]" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#1C1917]">{m.totalWorkshops}</p>
            <p className="text-xs text-[#78716C] mt-1">En ejecución</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-[#78716C]">Observaciones</CardTitle>
            <ClipboardList size={18} className="text-red-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#1C1917]">{m.pendingObservations}</p>
            <p className="text-xs text-[#78716C] mt-1">
              {m.urgentObservations} urgentes pendientes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Last pending observations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#1C1917]">
            Últimas observaciones pendientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {m.lastObservations.length === 0 ? (
            <p className="text-sm text-[#78716C]">No hay observaciones pendientes.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E7E5E4]">
                    <th className="text-left py-3 pr-4 font-medium text-[#78716C]">Estudiante</th>
                    <th className="text-left py-3 pr-4 font-medium text-[#78716C]">Área</th>
                    <th className="text-left py-3 pr-4 font-medium text-[#78716C]">Creado por</th>
                    <th className="text-left py-3 pr-4 font-medium text-[#78716C]">Fecha</th>
                    <th className="text-left py-3 font-medium text-[#78716C]">Urgencia</th>
                  </tr>
                </thead>
                <tbody>
                  {m.lastObservations.map((obs) => (
                    <tr key={obs.id} className="border-b border-[#E7E5E4] last:border-0 hover:bg-[#FAFAF9]">
                      <td className="py-3 pr-4">
                        <p className="font-medium text-[#1C1917]">{obs.student.name}</p>
                        <p className="text-xs text-[#78716C]">{obs.student.grade}</p>
                      </td>
                      <td className="py-3 pr-4 text-[#1C1917]">{obs.subjectArea}</td>
                      <td className="py-3 pr-4 text-[#78716C]">{obs.creator.name}</td>
                      <td className="py-3 pr-4 text-[#78716C]">{formatDate(obs.createdAt)}</td>
                      <td className="py-3">{urgencyBadge(obs.urgencyLevel)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
