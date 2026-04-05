# Plataforma Digital CERIC

Plataforma de gestión educativa para el programa **CERIC – Kennedy Cantonera**.

## Descripción

Sistema web construido con **Next.js 14** que facilita el seguimiento integral de estudiantes, la comunicación entre docentes de plataforma, docentes de colegio y acudientes, y la gestión de talleres, asistencias e informes de progreso.

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 14 (App Router), React 18, Tailwind CSS |
| Autenticación | NextAuth.js v4 (JWT + Prisma Adapter) |
| Base de datos | PostgreSQL + Prisma ORM |
| Correo | Resend |
| Tiempo real | Socket.IO |
| Estilos | Tailwind CSS + shadcn/ui |

## Roles de usuario

| Rol | Descripción | Dashboard |
|---|---|---|
| `TEACHER_PLATFORM` | Docente Plataforma (admin) | `/admin` |
| `TEACHER_SCHOOL` | Docente de Colegio | `/dashboard/docente-colegio` |
| `GUARDIAN` | Acudiente | `/dashboard/acudiente` |

## Instalación local

### Requisitos

- Node.js 18+
- PostgreSQL 14+
- npm / pnpm

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-org/plataforma-ceric.git
cd plataforma-ceric

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus valores reales

# 4. Ejecutar migraciones de la base de datos
npx prisma migrate dev --name init

# 5. Poblar la base de datos con datos de prueba
npx prisma db seed

# 6. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Credenciales de prueba (seed)

| Rol | Correo | Contraseña |
|---|---|---|
| Docente Plataforma | admin@ceric.edu.co | Ceric2024* |
| Docente Colegio | docente@kennedy.edu.co | Ceric2024* |
| Acudiente | acudiente@example.com | Ceric2024* |

## Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter
npm test         # Pruebas unitarias
npx prisma studio  # Explorador de base de datos
```

## Estructura del proyecto

```
plataforma-ceric/
├── app/
│   ├── (public)/login/         # Página de login
│   ├── (private)/
│   │   ├── admin/              # Dashboard Docente Plataforma
│   │   ├── cambiar-contrasena/ # Cambio de contraseña obligatorio
│   │   └── dashboard/
│   │       ├── docente-colegio/
│   │       └── acudiente/
│   └── api/
│       ├── auth/[...nextauth]/
│       └── cambiar-contrasena/
├── components/
│   ├── layout/                 # Sidebar, BottomNav
│   └── ui/                     # Componentes base (Button, Input, etc.)
├── lib/
│   ├── auth.ts                 # Configuración NextAuth
│   ├── prisma.ts               # Cliente Prisma singleton
│   ├── email.ts                # Envío de correos
│   └── utils.ts                # Utilidades
├── prisma/
│   ├── schema.prisma           # Esquema de base de datos
│   └── seed.ts                 # Datos iniciales
├── middleware.ts               # Protección de rutas
└── tests/                      # Pruebas unitarias
```

## Seguridad

- Contraseñas hasheadas con **bcryptjs** (12 rondas)
- Bloqueo de cuenta tras **5 intentos fallidos** en 10 minutos
- Cambio de contraseña obligatorio en primer inicio de sesión
- Rutas protegidas por rol mediante middleware de Next.js
- Sesiones JWT firmadas con `NEXTAUTH_SECRET`

## Licencia

Uso interno – Plataforma CERIC © 2024
