# 🏥 MediTurnos

Sistema integral de gestión de turnos médicos que conecta pacientes con profesionales de la salud de manera eficiente y segura.

![React](https://img.shields.io/badge/React-19.1.1-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?style=flat&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.13-38B2AC?style=flat&logo=tailwind-css)

---

## 📋 Descripción

**MediTurnos** es una plataforma web moderna que facilita la gestión de turnos médicos, permitiendo a pacientes buscar profesionales de la salud, reservar citas y gestionar su historial médico, mientras que los profesionales pueden administrar su agenda, disponibilidad y pacientes de forma centralizada.

---

## ✨ Características Principales

### 👤 Para Pacientes
- 🔍 **Búsqueda avanzada** de profesionales por especialidad y ubicación
- 📅 **Reserva de turnos** con disponibilidad en tiempo real
- ⚡ **Turnos express** para atención urgente
- 📱 **Gestión de citas** (ver, cancelar, reprogramar)
- ⭐ **Sistema de reseñas** y valoraciones
- 📋 **Historial de turnos** completo

### 👨‍⚕️ Para Profesionales
- 📊 **Dashboard con estadísticas** (turnos, pacientes, actividad)
- 🗓️ **Gestión de agenda** y disponibilidad personalizable
- 👥 **Administración de pacientes** vinculados
- 📝 **Historias clínicas** digitales
- ⚡ **Sistema de turnos express** con aprobación manual
- 💰 **Gestión de pagos** y tarifas de consulta
- 🚫 **Control de acceso** (bloquear pacientes)
- 📸 **Perfil profesional** con foto y descripción

### 🛡️ Para Administradores
- 📋 **Moderación de reseñas** y contenido
- 👥 **Gestión de usuarios** del sistema

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 19.1.1** - Biblioteca de UI
- **TypeScript 5.8.3** - Tipado estático
- **Vite 7.1.7** - Build tool y dev server
- **React Router DOM 7.9.3** - Enrutamiento SPA
- **TanStack Query 5.90.2** - Gestión de estado del servidor
- **TailwindCSS 4.1.13** - Framework de estilos
- **Formik 2.4.6 + Yup 1.7.1** - Formularios y validación
- **Axios 1.12.2** - Cliente HTTP
- **Lucide React 0.544.0** - Iconos
- **React PDF Renderer 4.3.1** - Generación de PDFs

### Backend
- API REST en `https://200.85.177.8:4003`
- Autenticación JWT

---

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Header/         # Navegación principal
│   ├── Sidebar/        # Menú lateral profesional
│   ├── Button/         # Botones personalizados
│   ├── InputField/     # Campos de formulario
│   └── ...
├── pages/              # Páginas de la aplicación
│   ├── Home/           # Landing page
│   ├── Login/          # Inicio de sesión
│   ├── Register/       # Registro de usuarios
│   ├── SearchProfessionals/  # Búsqueda
│   ├── BookAppointment/      # Reservar turno
│   ├── ProfessionalDashboard/  # Dashboard profesional
│   └── ...
├── services/           # Lógica de negocio y API
│   ├── auth/          # Autenticación
│   ├── appointments/  # Gestión de turnos
│   ├── professionals/ # Profesionales
│   ├── reviews/       # Reseñas
│   ├── medicalHistory/  # Historias clínicas
│   ├── payments/      # Pagos
│   └── georef/        # Geolocalización Argentina
├── types/             # Tipos TypeScript
├── const/             # Constantes
│   ├── routes.ts      # Rutas de la app
│   ├── colors.ts      # Paleta de colores
│   └── especialidades.ts  # 71 especialidades médicas
├── layouts/           # Layouts (Professional, Admin)
└── config/            # Configuración general
```

---

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- npm o pnpm

### Instalación

```bash
# Clonar el repositorio
git clone [url-del-repositorio]

# Navegar al directorio
cd MediTurnos

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173/`

### Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # Linter ESLint
```

---

## 🎨 Paleta de Colores

```javascript
PRIMARY_DARK: '#072769'      // Azul oscuro principal
PRIMARY_MEDIUM: '#075ba4'    // Azul medio
PRIMARY_LIGHT: '#5080fd'     // Azul claro
PRIMARY_CYAN: '#3dbdec'      // Cyan destacado
```

---

## 🔐 Roles de Usuario

### Paciente
- Buscar profesionales
- Reservar turnos
- Gestionar citas
- Dejar reseñas

### Profesional
- Gestionar disponibilidad
- Administrar turnos
- Gestionar pacientes
- Crear historias clínicas

### Administrador
- Moderar contenido
- Gestionar usuarios

---

## 🌍 Especialidades Médicas

El sistema soporta **71 especialidades** médicas incluyendo:
- Odontólogo, Ginecólogo, Psicólogo, Traumatólogo
- Médico Clínico, Dermatólogo, Oftalmólogo
- Cardiólogo, Pediatra, y muchas más...

---

## 📱 Características Técnicas

### Autenticación
- JWT Bearer tokens
- LocalStorage para persistencia
- Rutas protegidas por rol
- Interceptores automáticos de Axios

### Gestión de Estado
- React Query para cache y sincronización
- Invalidación automática de cache
- Optimistic updates

### UI/UX
- Diseño responsive
- Animaciones suaves
- Feedback visual inmediato
- Loading states
- Manejo de errores robusto

---

**MediTurnos** - Tu salud, nuestra prioridad 💙
