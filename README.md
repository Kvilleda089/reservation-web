<div align="center">

# 🏟️ ReservaFácil — Frontend

Interfaz web para la gestión de reservas de canchas deportivas y salones de eventos.

<img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" />

</div>

<br/>

## 📖 Descripción

**ReservaFácil** es el frontend de la plataforma de reservas de dos canchas deportivas y salones de eventos. Permite consultar la agenda del día, gestionar reservaciones, administrar clientes y empleados, y visualizar estadísticas del negocio — todo según el rol del usuario autenticado.

Este frontend consume la API de [`api-reservation`](https://github.com/Kvilleda089/api-reservation).

<br/>

## ✨ Funcionalidades

- 🔐 **Autenticación** de empleados con sesión persistida y cierre de sesión automático ante un token expirado o inválido
- 📅 **Agenda del día** agrupada por recurso (Cancha 1, Cancha 2, Salón)
- 🗓️ **Reservaciones**: creación, edición, consulta de detalle, registro de depósitos y cancelación
- 👥 **Clientes**: listado e historial de reservaciones por cliente
- 🧑‍💼 **Empleados**: listado paginado, creación y edición, con roles y fecha de contratación
- 📊 **Estadísticas** del negocio con gráficas (barras, líneas y pastel) en Quetzales
- 🛡️ **Control de acceso por permisos**, no solo por rol, en cada vista y acción

<br/>

## 🔑 Roles y permisos

La aplicación controla el acceso con un sistema de permisos por rol:

| Rol | Permisos principales |
|---|---|
| **Super Administrador** | Acceso total: reservaciones, agenda, clientes, empleados y estadísticas |
| **Administrador** | Reservaciones (lectura y creación) |
| **Recepcionista** | Reservaciones (lectura y creación) |
| **Responsable de Cancha** | Agenda (lectura) |
| **Personal de Limpieza** | Agenda (lectura) |

Las rutas protegidas verifican el permiso requerido (`src/lib/auth/helper/permissions.helper.ts`) y, si el usuario no lo tiene, se muestra una pantalla de acceso denegado en vez de la vista.

<br/>

## 🧱 Arquitectura y organización

El proyecto usa **Next.js con App Router** y está organizado por *features* en vez de por tipo de archivo:

```
src/
├── app/
│   ├── (auth)/login/        → ruta pública de inicio de sesión
│   └── (home)/               → rutas protegidas: agenda, dashboard, employee, client, statistics
├── components/                → componentes compartidos (UI, auth, loading, paginación)
├── constants/                  → roles.ts y permissions.ts
├── features/
│   ├── agenda/
│   ├── auth/                  → context, store, service y tipos de autenticación
│   ├── clients/
│   ├── dashboard/              → reservaciones
│   ├── employee/
│   └── statistics/
└── lib/
    ├── axios/                  → cliente HTTP con interceptor de token
    ├── auth/helper/             → verificación de permisos
    └── errors/
```

Cada feature agrupa sus propios `components/`, `services/` y `types/`, para mantener la lógica de negocio cerca de la vista que la usa.

La sesión del empleado se maneja con `AuthContext` + `auth.store`, y las rutas se protegen con el componente `ProtectedRoute`, que valida el permiso contra `permissions.helper.ts` antes de renderizar la vista.

<p align="center">
  <img src="public/images/image-home.jpeg" width="70%" alt="Vista principal de ReservaFácil"/>
</p>

<br/>

## ⚙️ Configuración

### Requisitos

- Node.js 18 o superior
- La API de [`api-reservation`](https://github.com/Kvilleda089/api-reservation) corriendo (local o desplegada)

### Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Reemplaza la URL por donde esté corriendo la API (por ejemplo, tu instancia de Render).

### Instalación y ejecución

```bash
# instalar dependencias
npm install

# levantar en modo desarrollo
npm run dev

# compilar para producción
npm run build
npm start
```

La aplicación quedará disponible en `http://localhost:3000` (o el puerto que indique Next.js si el 3000 ya está ocupado por la API).

<br/>

## 🧰 Stack tecnológico

- **Next.js** (App Router) + **TypeScript**
- **TailwindCSS** + **shadcn/ui** para los componentes de interfaz
- **Axios** para el consumo de la API, con interceptores de request/response
- **Sonner** para notificaciones (toasts)
- Gráficas de estadísticas construidas sobre componentes propios (barras, líneas, pastel)

<br/>

## 🔗 Proyectos relacionados

- Backend / API: [`api-reservation`](https://github.com/Kvilleda089/api-reservation)
