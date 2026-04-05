import {
  PrismaClient,
  Role,
  UserStatus,
  StudentStatus,
  WorkshopStatus,
  AttendanceStatus,
  UrgencyLevel,
  ObservationStatus,
} from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // ─── Contraseñas ───────────────────────────────────────────────────────────
  const adminPasswordHash = await bcrypt.hash('CERIC_Admin_2024!', 12)
  const testPasswordHash = await bcrypt.hash('Test1234!', 12)

  // ─── Colegios ─────────────────────────────────────────────────────────────
  const schoolKennedy = await prisma.school.upsert({
    where: { id: 'school-kennedy' },
    update: {},
    create: {
      id: 'school-kennedy',
      name: 'IE Kennedy',
      address: 'Barrio Kennedy Cantonera',
      phone: '6044000001',
      contactEmail: 'kennedy@edu.co',
    },
  })

  const schoolCandelaria = await prisma.school.upsert({
    where: { id: 'school-candelaria' },
    update: {},
    create: {
      id: 'school-candelaria',
      name: 'IE La Candelaria',
      address: 'Barrio La Candelaria',
      phone: '6044000002',
      contactEmail: 'candelaria@edu.co',
    },
  })

  const schoolSanJavier = await prisma.school.upsert({
    where: { id: 'school-sanjavier' },
    update: {},
    create: {
      id: 'school-sanjavier',
      name: 'IE San Javier',
      address: 'Barrio San Javier',
      phone: '6044000003',
      contactEmail: 'sanjavier@edu.co',
    },
  })

  console.log(`✔ 3 colegios creados`)

  // ─── Admin CERIC ───────────────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ceric.edu.co' },
    update: {},
    create: {
      name: 'Admin CERIC',
      email: 'admin@ceric.edu.co',
      passwordHash: adminPasswordHash,
      role: Role.TEACHER_PLATFORM,
      status: UserStatus.ACTIVE,
      forcePasswordChange: true,
    },
  })

  // ─── Docentes Plataforma ───────────────────────────────────────────────────
  const yovanny = await prisma.user.upsert({
    where: { email: 'yovanny@ceric.edu.co' },
    update: {},
    create: {
      name: 'Yovanny González',
      email: 'yovanny@ceric.edu.co',
      passwordHash: testPasswordHash,
      role: Role.TEACHER_PLATFORM,
      status: UserStatus.ACTIVE,
      forcePasswordChange: false,
    },
  })

  const eiverson = await prisma.user.upsert({
    where: { email: 'eiverson@ceric.edu.co' },
    update: {},
    create: {
      name: 'Eiverson Moreno',
      email: 'eiverson@ceric.edu.co',
      passwordHash: testPasswordHash,
      role: Role.TEACHER_PLATFORM,
      status: UserStatus.ACTIVE,
      forcePasswordChange: false,
    },
  })

  console.log(`✔ 3 usuarios docentes plataforma creados`)

  // ─── Docentes Colegio ──────────────────────────────────────────────────────
  const carlosMartinez = await prisma.user.upsert({
    where: { email: 'carlos@iekennedy.edu.co' },
    update: {},
    create: {
      name: 'Carlos Martínez',
      email: 'carlos@iekennedy.edu.co',
      passwordHash: testPasswordHash,
      role: Role.TEACHER_SCHOOL,
      status: UserStatus.ACTIVE,
      forcePasswordChange: false,
      teacherSchoolProfile: {
        create: {
          schoolId: schoolKennedy.id,
          subjectArea: 'Matemáticas',
        },
      },
    },
  })

  const anaRuiz = await prisma.user.upsert({
    where: { email: 'ana@iecandelaria.edu.co' },
    update: {},
    create: {
      name: 'Ana Ruiz',
      email: 'ana@iecandelaria.edu.co',
      passwordHash: testPasswordHash,
      role: Role.TEACHER_SCHOOL,
      status: UserStatus.ACTIVE,
      forcePasswordChange: false,
      teacherSchoolProfile: {
        create: {
          schoolId: schoolCandelaria.id,
          subjectArea: 'Español',
        },
      },
    },
  })

  console.log(`✔ 2 docentes de colegio creados`)

  // ─── Acudientes ───────────────────────────────────────────────────────────
  const mariaLopez = await prisma.user.upsert({
    where: { email: 'maria.lopez@gmail.com' },
    update: {},
    create: {
      name: 'María López',
      email: 'maria.lopez@gmail.com',
      passwordHash: testPasswordHash,
      role: Role.GUARDIAN,
      status: UserStatus.ACTIVE,
      forcePasswordChange: false,
      guardianProfile: {
        create: {
          docType: 'CC',
          docNumber: '1234567890',
          phone: '3101234567',
          address: 'Barrio Kennedy Cantonera, Calle 10 #20-30',
          relationship: 'madre',
          hasEmail: true,
          dataConsent: true,
          dataConsentDate: new Date(),
          dataConsentRegisteredBy: admin.id,
        },
      },
    },
    include: { guardianProfile: true },
  })

  const pedroGomez = await prisma.user.upsert({
    where: { email: 'pedro.gomez@gmail.com' },
    update: {},
    create: {
      name: 'Pedro Gómez',
      email: 'pedro.gomez@gmail.com',
      passwordHash: testPasswordHash,
      role: Role.GUARDIAN,
      status: UserStatus.ACTIVE,
      forcePasswordChange: false,
      guardianProfile: {
        create: {
          docType: 'CC',
          docNumber: '0987654321',
          phone: '3112345678',
          address: 'Barrio Kennedy Cantonera, Cra 80 #38-15',
          relationship: 'padre',
          hasEmail: true,
          dataConsent: true,
          dataConsentDate: new Date(),
          dataConsentRegisteredBy: admin.id,
        },
      },
    },
    include: { guardianProfile: true },
  })

  const luciaTorres = await prisma.user.upsert({
    where: { email: 'lucia.torres@gmail.com' },
    update: {},
    create: {
      name: 'Lucía Torres',
      email: 'lucia.torres@gmail.com',
      passwordHash: testPasswordHash,
      role: Role.GUARDIAN,
      status: UserStatus.ACTIVE,
      forcePasswordChange: false,
      guardianProfile: {
        create: {
          docType: 'CC',
          docNumber: '1122334455',
          phone: '3123456789',
          address: 'Barrio Kennedy Cantonera, Calle 38 Sur #80-10',
          relationship: 'madre',
          hasEmail: true,
          dataConsent: true,
          dataConsentDate: new Date(),
          dataConsentRegisteredBy: admin.id,
        },
      },
    },
    include: { guardianProfile: true },
  })

  const joseRamirez = await prisma.user.upsert({
    where: { email: 'acudiente.5544332211@ceric.edu.co' },
    update: {},
    create: {
      name: 'José Ramírez',
      email: 'acudiente.5544332211@ceric.edu.co',
      passwordHash: testPasswordHash,
      role: Role.GUARDIAN,
      status: UserStatus.ACTIVE,
      forcePasswordChange: false,
      guardianProfile: {
        create: {
          docType: 'CC',
          docNumber: '5544332211',
          phone: '3134567890',
          address: 'Barrio San Javier, Calle 44 #100-20',
          relationship: 'padre',
          hasEmail: false,
          dataConsent: true,
          dataConsentDate: new Date(),
          dataConsentRegisteredBy: admin.id,
        },
      },
    },
    include: { guardianProfile: true },
  })

  console.log(`✔ 4 acudientes creados`)

  // ─── Estudiantes ──────────────────────────────────────────────────────────
  const sofia = await prisma.student.upsert({
    where: { id: 'student-sofia' },
    update: {},
    create: {
      id: 'student-sofia',
      name: 'Sofía López',
      birthDate: new Date('2014-03-15'),
      grade: '4°',
      schoolId: schoolKennedy.id,
      gender: 'femenino',
      status: StudentStatus.ACTIVE,
    },
  })

  const juan = await prisma.student.upsert({
    where: { id: 'student-juan' },
    update: {},
    create: {
      id: 'student-juan',
      name: 'Juan López',
      birthDate: new Date('2016-07-22'),
      grade: '2°',
      schoolId: schoolKennedy.id,
      gender: 'masculino',
      status: StudentStatus.ACTIVE,
    },
  })

  const valentina = await prisma.student.upsert({
    where: { id: 'student-valentina' },
    update: {},
    create: {
      id: 'student-valentina',
      name: 'Valentina Gómez',
      birthDate: new Date('2012-11-08'),
      grade: '6°',
      schoolId: schoolCandelaria.id,
      gender: 'femenino',
      status: StudentStatus.ACTIVE,
    },
  })

  const miguel = await prisma.student.upsert({
    where: { id: 'student-miguel' },
    update: {},
    create: {
      id: 'student-miguel',
      name: 'Miguel Torres',
      birthDate: new Date('2013-05-30'),
      grade: '5°',
      schoolId: schoolKennedy.id,
      gender: 'masculino',
      status: StudentStatus.ACTIVE,
    },
  })

  const camila = await prisma.student.upsert({
    where: { id: 'student-camila' },
    update: {},
    create: {
      id: 'student-camila',
      name: 'Camila Ramírez',
      birthDate: new Date('2015-09-12'),
      grade: '3°',
      schoolId: schoolSanJavier.id,
      gender: 'femenino',
      status: StudentStatus.ACTIVE,
    },
  })

  const andres = await prisma.student.upsert({
    where: { id: 'student-andres' },
    update: {},
    create: {
      id: 'student-andres',
      name: 'Andrés Ramírez',
      birthDate: new Date('2017-01-25'),
      grade: '1°',
      schoolId: schoolSanJavier.id,
      gender: 'masculino',
      status: StudentStatus.FOLLOW_UP,
    },
  })

  console.log(`✔ 6 estudiantes creados`)

  // ─── Relaciones acudiente-estudiante ──────────────────────────────────────
  const mariaProfile = mariaLopez.guardianProfile!
  const pedroProfile = pedroGomez.guardianProfile!
  const luciaProfile = luciaTorres.guardianProfile!
  const joseProfile = joseRamirez.guardianProfile!

  await prisma.studentGuardian.upsert({
    where: { studentId_guardianId: { studentId: sofia.id, guardianId: mariaProfile.id } },
    update: {},
    create: { studentId: sofia.id, guardianId: mariaProfile.id, isPrimary: true },
  })
  await prisma.studentGuardian.upsert({
    where: { studentId_guardianId: { studentId: juan.id, guardianId: mariaProfile.id } },
    update: {},
    create: { studentId: juan.id, guardianId: mariaProfile.id, isPrimary: true },
  })
  await prisma.studentGuardian.upsert({
    where: { studentId_guardianId: { studentId: valentina.id, guardianId: pedroProfile.id } },
    update: {},
    create: { studentId: valentina.id, guardianId: pedroProfile.id, isPrimary: true },
  })
  await prisma.studentGuardian.upsert({
    where: { studentId_guardianId: { studentId: miguel.id, guardianId: luciaProfile.id } },
    update: {},
    create: { studentId: miguel.id, guardianId: luciaProfile.id, isPrimary: true },
  })
  await prisma.studentGuardian.upsert({
    where: { studentId_guardianId: { studentId: camila.id, guardianId: joseProfile.id } },
    update: {},
    create: { studentId: camila.id, guardianId: joseProfile.id, isPrimary: true },
  })
  await prisma.studentGuardian.upsert({
    where: { studentId_guardianId: { studentId: andres.id, guardianId: joseProfile.id } },
    update: {},
    create: { studentId: andres.id, guardianId: joseProfile.id, isPrimary: true },
  })

  console.log(`✔ Relaciones acudiente-estudiante creadas`)

  // ─── Talleres ─────────────────────────────────────────────────────────────
  const workshopMatematicas = await prisma.workshop.upsert({
    where: { id: 'workshop-matematicas' },
    update: {},
    create: {
      id: 'workshop-matematicas',
      name: 'Refuerzo Matemáticas',
      description: 'Nivelación y refuerzo en operaciones matemáticas para estudiantes de 7 a 12 años.',
      schedule: 'Lunes y Miércoles 2:00-3:30pm',
      teacherId: yovanny.id,
      maxCapacity: 15,
      status: WorkshopStatus.ACTIVE,
      ageGroup: '7-12 años',
    },
  })

  const workshopLectura = await prisma.workshop.upsert({
    where: { id: 'workshop-lectura' },
    update: {},
    create: {
      id: 'workshop-lectura',
      name: 'Lectura y Escritura',
      description: 'Fortalecimiento de competencias lectoras y de escritura para niños de 6 a 10 años.',
      schedule: 'Martes y Jueves 2:00-3:30pm',
      teacherId: eiverson.id,
      maxCapacity: 15,
      status: WorkshopStatus.ACTIVE,
      ageGroup: '6-10 años',
    },
  })

  const workshopArte = await prisma.workshop.upsert({
    where: { id: 'workshop-arte' },
    update: {},
    create: {
      id: 'workshop-arte',
      name: 'Arte y Cultura',
      description: 'Expresión artística y cultural para todos los estudiantes del CERIC.',
      schedule: 'Viernes 2:00-5:00pm',
      teacherId: yovanny.id,
      maxCapacity: 20,
      status: WorkshopStatus.ACTIVE,
      ageGroup: 'Todos',
    },
  })

  console.log(`✔ 3 talleres creados`)

  // ─── Inscripciones ─────────────────────────────────────────────────────────
  // Refuerzo Matemáticas: Sofía, Juan, Miguel, Valentina
  for (const studentId of [sofia.id, juan.id, miguel.id, valentina.id]) {
    await prisma.enrollment.upsert({
      where: { studentId_workshopId: { studentId, workshopId: workshopMatematicas.id } },
      update: {},
      create: { studentId, workshopId: workshopMatematicas.id },
    })
  }

  // Lectura y Escritura: Juan, Camila, Andrés
  for (const studentId of [juan.id, camila.id, andres.id]) {
    await prisma.enrollment.upsert({
      where: { studentId_workshopId: { studentId, workshopId: workshopLectura.id } },
      update: {},
      create: { studentId, workshopId: workshopLectura.id },
    })
  }

  // Arte y Cultura: todos los 6
  for (const studentId of [sofia.id, juan.id, valentina.id, miguel.id, camila.id, andres.id]) {
    await prisma.enrollment.upsert({
      where: { studentId_workshopId: { studentId, workshopId: workshopArte.id } },
      update: {},
      create: { studentId, workshopId: workshopArte.id },
    })
  }

  console.log(`✔ Inscripciones creadas`)

  // ─── Asistencias ──────────────────────────────────────────────────────────
  const today = new Date()

  function pastWeekday(daysAgo: number): Date {
    const d = new Date(today)
    d.setDate(d.getDate() - daysAgo)
    d.setHours(14, 0, 0, 0)
    return d
  }

  // Últimos 4 días hábiles para Refuerzo Matemáticas y Lectura
  const workdays = [1, 2, 3, 4].map(pastWeekday)

  const mathStudents = [sofia.id, juan.id, miguel.id, valentina.id]
  const readStudents = [juan.id, camila.id, andres.id]
  const allStudents = [sofia.id, juan.id, valentina.id, miguel.id, camila.id, andres.id]

  const statuses = [AttendanceStatus.PRESENT, AttendanceStatus.ABSENT, AttendanceStatus.LATE, AttendanceStatus.PRESENT]

  for (let i = 0; i < workdays.length; i++) {
    for (const studentId of mathStudents) {
      try {
        await prisma.attendance.create({
          data: {
            studentId,
            workshopId: workshopMatematicas.id,
            date: workdays[i],
            status: statuses[i % statuses.length],
          },
        })
      } catch { /* skip duplicates */ }
    }

    for (const studentId of readStudents) {
      try {
        await prisma.attendance.create({
          data: {
            studentId,
            workshopId: workshopLectura.id,
            date: workdays[i],
            status: statuses[(i + 1) % statuses.length],
          },
        })
      } catch { /* skip duplicates */ }
    }
  }

  // Últimos 2 viernes para Arte y Cultura
  const lastFridays: Date[] = []
  let check = new Date(today)
  while (lastFridays.length < 2) {
    check.setDate(check.getDate() - 1)
    if (check.getDay() === 5) {
      const d = new Date(check)
      d.setHours(14, 0, 0, 0)
      lastFridays.push(d)
    }
  }

  for (const friday of lastFridays) {
    for (const studentId of allStudents) {
      try {
        await prisma.attendance.create({
          data: {
            studentId,
            workshopId: workshopArte.id,
            date: friday,
            status: AttendanceStatus.PRESENT,
          },
        })
      } catch { /* skip duplicates */ }
    }
  }

  console.log(`✔ Asistencias de los últimos días creadas`)

  // ─── Observaciones ────────────────────────────────────────────────────────
  // Obs 1 - PENDING
  await prisma.observation.upsert({
    where: { id: 'obs-001' },
    update: {},
    create: {
      id: 'obs-001',
      studentId: sofia.id,
      createdBy: carlosMartinez.id,
      subjectArea: 'Matemáticas',
      difficultyType: 'Académica',
      description:
        'Sofía presenta dificultades con las operaciones de multiplicación y división. No logra resolver ejercicios básicos de manera autónoma.',
      urgencyLevel: UrgencyLevel.PRIORITY,
      status: ObservationStatus.PENDING,
    },
  })

  // Obs 2 - IN_PROGRESS
  const obs2 = await prisma.observation.upsert({
    where: { id: 'obs-002' },
    update: {},
    create: {
      id: 'obs-002',
      studentId: valentina.id,
      createdBy: anaRuiz.id,
      subjectArea: 'Lectura y Escritura',
      difficultyType: 'Académica',
      description:
        'Valentina tiene dificultades para comprender textos largos y hacer inferencias. Su nivel de lectura está por debajo del grado.',
      urgencyLevel: UrgencyLevel.NORMAL,
      status: ObservationStatus.IN_PROGRESS,
    },
  })

  await prisma.observationAction.upsert({
    where: { id: 'obs-002-action' },
    update: {},
    create: {
      id: 'obs-002-action',
      observationId: obs2.id,
      createdBy: anaRuiz.id,
      actionPlan:
        'Se trabajará comprensión lectora en el taller de Lectura y Escritura con ejercicios graduados. Inicio inmediato.',
    },
  })

  // Obs 3 - RESOLVED
  const obs3 = await prisma.observation.upsert({
    where: { id: 'obs-003' },
    update: {},
    create: {
      id: 'obs-003',
      studentId: miguel.id,
      createdBy: carlosMartinez.id,
      subjectArea: 'Comportamiento',
      difficultyType: 'Conductual',
      description:
        'Miguel presenta comportamiento agresivo con compañeros durante el recreo. Ha tenido tres incidentes esta semana.',
      urgencyLevel: UrgencyLevel.URGENT,
      status: ObservationStatus.RESOLVED,
    },
  })

  await prisma.observationAction.upsert({
    where: { id: 'obs-003-action' },
    update: {},
    create: {
      id: 'obs-003-action',
      observationId: obs3.id,
      createdBy: carlosMartinez.id,
      actionPlan:
        'Se realizaron sesiones de manejo de emociones y convivencia. Se habló con el acudiente.',
    },
  })

  await prisma.observationFollowup.upsert({
    where: { id: 'obs-003-followup' },
    update: {},
    create: {
      id: 'obs-003-followup',
      observationId: obs3.id,
      createdBy: carlosMartinez.id,
      note: 'Miguel muestra mejora notable. No ha habido incidentes en dos semanas.',
    },
  })

  await prisma.observationFollowup.upsert({
    where: { id: 'obs-003-close' },
    update: {},
    create: {
      id: 'obs-003-close',
      observationId: obs3.id,
      createdBy: admin.id,
      note: 'Situación resuelta satisfactoriamente. Se recomienda seguimiento mensual.',
    },
  })

  console.log(`✔ 3 observaciones creadas`)

  // ─── Historial de estados de estudiantes ─────────────────────────────────
  await prisma.studentStatusHistory.upsert({
    where: { id: 'hist-andres-1' },
    update: {},
    create: {
      id: 'hist-andres-1',
      studentId: andres.id,
      previousStatus: StudentStatus.ACTIVE,
      newStatus: StudentStatus.FOLLOW_UP,
      note: 'Andrés ha faltado 4 veces en el último mes. Se requiere seguimiento con la familia.',
      changedBy: admin.id,
    },
  })

  await prisma.studentStatusHistory.upsert({
    where: { id: 'hist-camila-1' },
    update: {},
    create: {
      id: 'hist-camila-1',
      studentId: camila.id,
      previousStatus: StudentStatus.ACTIVE,
      newStatus: StudentStatus.FOLLOW_UP,
      note: 'Situación familiar difícil. Asistencia irregular.',
      changedBy: admin.id,
    },
  })

  await prisma.studentStatusHistory.upsert({
    where: { id: 'hist-camila-2' },
    update: {},
    create: {
      id: 'hist-camila-2',
      studentId: camila.id,
      previousStatus: StudentStatus.FOLLOW_UP,
      newStatus: StudentStatus.ACTIVE,
      note: 'Situación familiar estabilizada. Camila retomó asistencia regular.',
      changedBy: yovanny.id,
    },
  })

  console.log(`✔ Historial de estados creado`)

  // ─── SiteConfig ───────────────────────────────────────────────────────────
  const siteConfigs = [
    { key: 'bank_name', value: 'Bancolombia' },
    { key: 'bank_account_type', value: 'Cuenta de Ahorros' },
    { key: 'bank_account_number', value: '123-456789-12' },
    { key: 'bank_account_holder', value: 'CERIC Kennedy Cantonera' },
    { key: 'bank_account_doc', value: '900.123.456-7' },
    {
      key: 'bank_custom_message',
      value:
        'Una vez realices la transferencia, escríbenos al correo con tu comprobante y te confirmaremos la recepción.',
    },
    { key: 'bank_contact_email', value: 'donaciones@ceric.edu.co' },
    {
      key: 'site_testimonial_text',
      value:
        'El CERIC cambió mi tarde. Antes no entendía las matemáticas y ahora soy de los mejores de mi clase.',
    },
    { key: 'site_testimonial_author', value: 'Estudiante, 11 años' },
  ]

  for (const cfg of siteConfigs) {
    await prisma.siteConfig.upsert({
      where: { key: cfg.key },
      update: { value: cfg.value },
      create: { key: cfg.key, value: cfg.value, updatedBy: admin.id },
    })
  }

  console.log(`✔ SiteConfig inicial creado`)

  console.log('\n✅ Seed completado exitosamente.')
  console.log('\n📋 Credenciales de prueba:')
  console.log('  Admin CERIC          → admin@ceric.edu.co         / CERIC_Admin_2024!')
  console.log('  Yovanny González     → yovanny@ceric.edu.co       / Test1234!')
  console.log('  Eiverson Moreno      → eiverson@ceric.edu.co      / Test1234!')
  console.log('  Carlos Martínez      → carlos@iekennedy.edu.co    / Test1234!')
  console.log('  Ana Ruiz             → ana@iecandelaria.edu.co    / Test1234!')
  console.log('  María López          → maria.lopez@gmail.com      / Test1234!')
  console.log('  Pedro Gómez          → pedro.gomez@gmail.com      / Test1234!')
  console.log('  Lucía Torres         → lucia.torres@gmail.com     / Test1234!')
  console.log('  José Ramírez         → acudiente.5544332211@ceric.edu.co / Test1234!')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
