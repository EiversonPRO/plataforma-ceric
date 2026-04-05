import { PrismaClient, Role, UserStatus, StudentStatus, WorkshopStatus, AttendanceStatus, ProgressRating, UrgencyLevel, ObservationStatus, NotificationType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed de la base de datos...')

  // ─── Contraseña por defecto ───────────────────────────────────────────────
  const defaultPasswordHash = await bcrypt.hash('Ceric2024*', 12)

  // ─── Docente Plataforma (Admin) ───────────────────────────────────────────
  const teacherPlatform = await prisma.user.upsert({
    where: { email: 'admin@ceric.edu.co' },
    update: {},
    create: {
      name: 'Administrador CERIC',
      email: 'admin@ceric.edu.co',
      passwordHash: defaultPasswordHash,
      role: Role.TEACHER_PLATFORM,
      status: UserStatus.ACTIVE,
      forcePasswordChange: false,
    },
  })
  console.log(`✔ Docente plataforma creado: ${teacherPlatform.email}`)

  // ─── Colegio ──────────────────────────────────────────────────────────────
  const school = await prisma.school.upsert({
    where: { id: 'school-kennedy-001' },
    update: {},
    create: {
      id: 'school-kennedy-001',
      name: 'Colegio Kennedy',
      address: 'Cra. 80 #38-00, Bogotá',
      phone: '601-4567890',
      contactEmail: 'rector@kennedy.edu.co',
    },
  })
  console.log(`✔ Colegio creado: ${school.name}`)

  // ─── Docente Colegio ──────────────────────────────────────────────────────
  const teacherSchool = await prisma.user.upsert({
    where: { email: 'docente@kennedy.edu.co' },
    update: {},
    create: {
      name: 'Carlos Ramírez',
      email: 'docente@kennedy.edu.co',
      passwordHash: defaultPasswordHash,
      role: Role.TEACHER_SCHOOL,
      status: UserStatus.ACTIVE,
      forcePasswordChange: false,
      teacherSchoolProfile: {
        create: {
          schoolId: school.id,
          subjectArea: 'Matemáticas',
        },
      },
    },
  })
  console.log(`✔ Docente colegio creado: ${teacherSchool.email}`)

  // ─── Acudiente ────────────────────────────────────────────────────────────
  const guardian = await prisma.user.upsert({
    where: { email: 'acudiente@example.com' },
    update: {},
    create: {
      name: 'María López',
      email: 'acudiente@example.com',
      passwordHash: defaultPasswordHash,
      role: Role.GUARDIAN,
      status: UserStatus.ACTIVE,
      forcePasswordChange: false,
      guardianProfile: {
        create: {
          docType: 'CC',
          docNumber: '52345678',
          phone: '3101234567',
          address: 'Calle 38 Sur #80-15, Bogotá',
          relationship: 'Madre',
          hasEmail: true,
          dataConsent: true,
          dataConsentDate: new Date(),
          dataConsentRegisteredBy: teacherPlatform.id,
        },
      },
    },
    include: { guardianProfile: true },
  })
  console.log(`✔ Acudiente creado: ${guardian.email}`)

  // ─── Estudiantes ──────────────────────────────────────────────────────────
  const student1 = await prisma.student.upsert({
    where: { id: 'student-001' },
    update: {},
    create: {
      id: 'student-001',
      name: 'Sofía López',
      birthDate: new Date('2015-03-12'),
      grade: '3°',
      schoolId: school.id,
      gender: 'F',
      status: StudentStatus.ACTIVE,
    },
  })

  const student2 = await prisma.student.upsert({
    where: { id: 'student-002' },
    update: {},
    create: {
      id: 'student-002',
      name: 'Andrés Martínez',
      birthDate: new Date('2013-07-22'),
      grade: '5°',
      schoolId: school.id,
      gender: 'M',
      status: StudentStatus.FOLLOW_UP,
      specialNotes: 'Requiere apoyo en comprensión lectora',
    },
  })

  const student3 = await prisma.student.upsert({
    where: { id: 'student-003' },
    update: {},
    create: {
      id: 'student-003',
      name: 'Valentina Torres',
      birthDate: new Date('2014-11-05'),
      grade: '4°',
      schoolId: school.id,
      gender: 'F',
      status: StudentStatus.AT_RISK,
      specialNotes: 'Alta inasistencia escolar',
    },
  })
  console.log(`✔ Estudiantes creados: ${student1.name}, ${student2.name}, ${student3.name}`)

  // ─── Relación acudiente - estudiantes ────────────────────────────────────
  const guardianProfile = guardian.guardianProfile!
  await prisma.studentGuardian.upsert({
    where: { studentId_guardianId: { studentId: student1.id, guardianId: guardianProfile.id } },
    update: {},
    create: { studentId: student1.id, guardianId: guardianProfile.id, isPrimary: true },
  })
  await prisma.studentGuardian.upsert({
    where: { studentId_guardianId: { studentId: student2.id, guardianId: guardianProfile.id } },
    update: {},
    create: { studentId: student2.id, guardianId: guardianProfile.id, isPrimary: false },
  })
  console.log(`✔ Relaciones acudiente-estudiante creadas`)

  // ─── Talleres ─────────────────────────────────────────────────────────────
  const workshop1 = await prisma.workshop.upsert({
    where: { id: 'workshop-001' },
    update: {},
    create: {
      id: 'workshop-001',
      name: 'Taller de Lectura',
      description: 'Fortalecimiento de habilidades lectoras y comprensión de textos',
      schedule: 'Lunes y Miércoles 2:00 PM - 4:00 PM',
      teacherId: teacherPlatform.id,
      maxCapacity: 20,
      status: WorkshopStatus.ACTIVE,
      ageGroup: '7-10 años',
    },
  })

  const workshop2 = await prisma.workshop.upsert({
    where: { id: 'workshop-002' },
    update: {},
    create: {
      id: 'workshop-002',
      name: 'Taller de Matemáticas',
      description: 'Nivelación y refuerzo en operaciones matemáticas básicas',
      schedule: 'Martes y Jueves 2:00 PM - 4:00 PM',
      teacherId: teacherPlatform.id,
      maxCapacity: 15,
      status: WorkshopStatus.ACTIVE,
      ageGroup: '9-12 años',
    },
  })
  console.log(`✔ Talleres creados: ${workshop1.name}, ${workshop2.name}`)

  // ─── Matrículas ───────────────────────────────────────────────────────────
  await prisma.enrollment.upsert({
    where: { studentId_workshopId: { studentId: student1.id, workshopId: workshop1.id } },
    update: {},
    create: { studentId: student1.id, workshopId: workshop1.id },
  })
  await prisma.enrollment.upsert({
    where: { studentId_workshopId: { studentId: student2.id, workshopId: workshop2.id } },
    update: {},
    create: { studentId: student2.id, workshopId: workshop2.id },
  })
  await prisma.enrollment.upsert({
    where: { studentId_workshopId: { studentId: student3.id, workshopId: workshop1.id } },
    update: {},
    create: { studentId: student3.id, workshopId: workshop1.id },
  })
  console.log(`✔ Matrículas creadas`)

  // ─── Asistencias ──────────────────────────────────────────────────────────
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  await prisma.attendance.createMany({
    skipDuplicates: true,
    data: [
      { studentId: student1.id, workshopId: workshop1.id, date: yesterday, status: AttendanceStatus.PRESENT },
      { studentId: student2.id, workshopId: workshop2.id, date: yesterday, status: AttendanceStatus.ABSENT },
      { studentId: student3.id, workshopId: workshop1.id, date: yesterday, status: AttendanceStatus.LATE },
    ],
  })
  console.log(`✔ Asistencias creadas`)

  // ─── Reportes de progreso ─────────────────────────────────────────────────
  await prisma.progressReport.create({
    data: {
      studentId: student1.id,
      workshopId: workshop1.id,
      period: 'Primer semestre 2024',
      rating: ProgressRating.EXCELLENT,
      notes: 'Sofía demuestra excelente comprensión lectora y participa activamente en todas las actividades.',
      createdBy: teacherPlatform.id,
    },
  })

  await prisma.progressReport.create({
    data: {
      studentId: student2.id,
      workshopId: workshop2.id,
      period: 'Primer semestre 2024',
      rating: ProgressRating.IN_PROGRESS,
      notes: 'Andrés muestra progreso gradual. Se recomienda refuerzo en multiplicación y división.',
      createdBy: teacherPlatform.id,
    },
  })
  console.log(`✔ Reportes de progreso creados`)

  // ─── Observaciones ────────────────────────────────────────────────────────
  const obs1 = await prisma.observation.create({
    data: {
      studentId: student2.id,
      createdBy: teacherSchool.id,
      subjectArea: 'Matemáticas',
      difficultyType: 'Académica',
      description: 'El estudiante presenta dificultades persistentes en la resolución de problemas con fracciones y decimales. Ha reprobado los últimos dos quizzes.',
      urgencyLevel: UrgencyLevel.PRIORITY,
      recommendation: 'Se sugiere sesiones de refuerzo individualizadas y comunicación con el acudiente.',
      status: ObservationStatus.PENDING,
    },
  })

  const obs2 = await prisma.observation.create({
    data: {
      studentId: student3.id,
      createdBy: teacherSchool.id,
      subjectArea: 'General',
      difficultyType: 'Asistencia',
      description: 'Valentina ha faltado 8 días en el último mes sin justificación. Se han enviado comunicados al acudiente sin respuesta.',
      urgencyLevel: UrgencyLevel.URGENT,
      recommendation: 'Contacto urgente con acudiente. Posible visita domiciliaria.',
      status: ObservationStatus.IN_PROGRESS,
    },
  })

  await prisma.observation.create({
    data: {
      studentId: student1.id,
      createdBy: teacherSchool.id,
      subjectArea: 'Convivencia',
      difficultyType: 'Comportamental',
      description: 'Sofía presentó una discusión con compañeros durante el recreo. Fue mediada y resuelta satisfactoriamente.',
      urgencyLevel: UrgencyLevel.NORMAL,
      status: ObservationStatus.RESOLVED,
    },
  })
  console.log(`✔ Observaciones creadas`)

  // ─── Acciones y seguimientos ─────────────────────────────────────────────
  await prisma.observationAction.create({
    data: {
      observationId: obs2.id,
      createdBy: teacherPlatform.id,
      actionPlan: 'Se programó llamada con la acudiente María López para el próximo lunes. Se coordina con la trabajadora social del colegio para visita domiciliaria si no hay respuesta.',
    },
  })

  await prisma.observationFollowup.create({
    data: {
      observationId: obs2.id,
      createdBy: teacherPlatform.id,
      note: 'Llamada realizada sin contestar. Se dejó mensaje de voz. Se enviará comunicado físico al colegio.',
    },
  })
  console.log(`✔ Acciones y seguimientos creados`)

  // ─── Notificaciones ───────────────────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      {
        userId: guardian.id,
        type: NotificationType.REPORT_AVAILABLE,
        message: 'Nuevo informe de progreso disponible para Sofía López - Primer semestre 2024',
        read: false,
      },
      {
        userId: guardian.id,
        type: NotificationType.ABSENCE_REGISTERED,
        message: 'Se registró una inasistencia para Andrés Martínez el día de ayer en Taller de Matemáticas',
        read: false,
      },
      {
        userId: teacherPlatform.id,
        type: NotificationType.OBSERVATION_CREATED,
        message: 'Nueva observación urgente creada para Valentina Torres por Carlos Ramírez',
        read: false,
      },
      {
        userId: teacherSchool.id,
        type: NotificationType.OBSERVATION_ACTION,
        message: 'Se registró un plan de acción para la observación de Valentina Torres',
        read: true,
      },
    ],
  })
  console.log(`✔ Notificaciones creadas`)

  // ─── Configuración del sitio ──────────────────────────────────────────────
  await prisma.siteConfig.upsert({
    where: { key: 'platform_name' },
    update: {},
    create: {
      key: 'platform_name',
      value: 'Plataforma Digital CERIC',
      updatedBy: teacherPlatform.id,
    },
  })

  await prisma.siteConfig.upsert({
    where: { key: 'institution_name' },
    update: {},
    create: {
      key: 'institution_name',
      value: 'Kennedy Cantonera',
      updatedBy: teacherPlatform.id,
    },
  })
  console.log(`✔ Configuración del sitio creada`)

  console.log('\n✅ Seed completado exitosamente')
  console.log('\nCredenciales de acceso:')
  console.log('  Admin:    admin@ceric.edu.co      / Ceric2024*')
  console.log('  Docente:  docente@kennedy.edu.co  / Ceric2024*')
  console.log('  Acudiente: acudiente@example.com  / Ceric2024*')
}

main()
  .catch((e) => {
    console.error('Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
