# Plataforma Digital CERIC
## Centro Educativo de Refuerzo e Innovación Cultural — Kennedy Cantonera

Plataforma web para la gestión del CERIC: comunicación entre colegios, familias y el centro de refuerzo.

## Requisitos previos
- Node.js 18 o superior
- PostgreSQL 14 o superior
- npm

## Instalación paso a paso

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus valores
```

### 3. Crear la base de datos
```bash
# En PostgreSQL, crear una base de datos llamada "ceric"
# createdb ceric
```

### 4. Correr las migraciones
```bash
npx prisma migrate dev --name init
```

### 5. Poblar la base de datos con datos de prueba
```bash
npx prisma db seed
```

### 6. Iniciar el servidor de desarrollo
```bash
npm run dev
```

Abrir http://localhost:3000

## Variables de entorno

| Variable | Descripción | Cómo obtenerla |
|---|---|---|
| `DATABASE_URL` | URL de conexión a PostgreSQL | `postgresql://usuario:password@localhost:5432/ceric` |
| `NEXTAUTH_SECRET` | Clave secreta para NextAuth (mínimo 32 caracteres) | Ejecutar: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL base de la aplicación | `http://localhost:3000` en desarrollo |
| `RESEND_API_KEY` | Clave API de Resend para envío de correos | Crear cuenta gratuita en resend.com |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Clave de Google Maps para mapa de contacto | console.cloud.google.com |

## ⚠️ Credenciales del administrador inicial

**CAMBIAR ESTAS CREDENCIALES ANTES DE IR A PRODUCCIÓN**

- Correo: `admin@ceric.edu.co`
- Contraseña inicial: `CERIC_Admin_2024!`

El sistema obliga a cambiar la contraseña en el primer inicio de sesión.

## Credenciales de prueba (seed)

| Usuario | Correo | Contraseña | Rol |
|---|---|---|---|
| Admin CERIC | admin@ceric.edu.co | CERIC_Admin_2024! | Docente Plataforma |
| Yovanny González | yovanny@ceric.edu.co | Test1234! | Docente Plataforma |
| Eiverson Moreno | eiverson@ceric.edu.co | Test1234! | Docente Plataforma |
| Carlos Martínez | carlos@iekennedy.edu.co | Test1234! | Docente Colegio |
| Ana Ruiz | ana@iecandelaria.edu.co | Test1234! | Docente Colegio |
| María López | maria.lopez@gmail.com | Test1234! | Acudiente |
| Pedro Gómez | pedro.gomez@gmail.com | Test1234! | Acudiente |
| Lucía Torres | lucia.torres@gmail.com | Test1234! | Acudiente |
| José Ramírez (sin email propio) | acudiente.5544332211@ceric.edu.co | Test1234! | Acudiente |

## Comandos útiles

```bash
npm run dev                      # Servidor de desarrollo en http://localhost:3000
npx prisma migrate dev           # Correr migraciones de base de datos
npx prisma db seed               # Poblar la base de datos con datos de prueba
npx prisma studio                # Explorar la base de datos en el navegador
npx prisma migrate reset         # Reiniciar la base de datos (⚠️ borra todos los datos)
npm test                         # Correr pruebas de autorización con Jest
```

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 14 (App Router), React 18, Tailwind CSS |
| Autenticación | NextAuth.js v4 (JWT + Prisma Adapter) |
| Base de datos | PostgreSQL + Prisma ORM |
| Correo | Resend |
| Tiempo real | Socket.IO |
| Estilos | Tailwind CSS + shadcn/ui |
| Iconos | Lucide React |

## Roles de usuario

| Rol | Descripción | Dashboard |
|---|---|---|
| `TEACHER_PLATFORM` | Docente Plataforma (admin CERIC) | `/admin` |
| `TEACHER_SCHOOL` | Docente de Colegio | `/dashboard/docente-colegio` |
| `GUARDIAN` | Acudiente | `/dashboard/acudiente` |

## Estructura del proyecto

```
plataforma-ceric/
├── app/
│   ├── (public)/login/             # Página de inicio de sesión
│   ├── (private)/
│   │   ├── admin/                  # Dashboard Docente Plataforma
│   │   ├── cambiar-contrasena/     # Cambio de contraseña obligatorio
│   │   └── dashboard/
│   │       ├── docente-colegio/    # Dashboard Docente Colegio
│   │       └── acudiente/          # Dashboard Acudiente
│   └── api/
│       ├── auth/[...nextauth]/     # Endpoints NextAuth
│       └── cambiar-contrasena/     # Endpoint cambio de contraseña
├── components/
│   ├── layout/                     # Sidebar, BottomNav
│   └── ui/                         # Componentes base (Button, Input, Card, Badge, Label)
├── lib/
│   ├── auth.ts                     # Configuración NextAuth
│   ├── prisma.ts                   # Cliente Prisma singleton
│   ├── email.ts                    # Envío de correos con Resend
│   └── utils.ts                    # Utilidades generales
├── prisma/
│   ├── schema.prisma               # Esquema completo de base de datos
│   └── seed.ts                     # Datos de prueba
├── middleware.ts                   # Protección de rutas por rol
├── tests/
│   └── auth/                       # Pruebas Jest de autorización
└── types/
    └── next-auth.d.ts              # Extensión de tipos NextAuth
```

## Seguridad

- Contraseñas hasheadas con **bcryptjs** (12 rondas)
- Bloqueo de cuenta tras **5 intentos fallidos** en 10 minutos desde la misma IP
- Cambio de contraseña obligatorio en el primer inicio de sesión (`forcePasswordChange`)
- Rutas protegidas por rol mediante middleware de Next.js
- Sesiones JWT firmadas con `NEXTAUTH_SECRET`
- Mensajes de error genéricos para no revelar si el correo existe

## Licencia

Uso interno — Plataforma CERIC © 2024
