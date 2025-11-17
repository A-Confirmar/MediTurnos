# Sistema de Pagos - MediTurnos

## Descripción General

El sistema de pagos permite gestionar el estado de pago de los turnos médicos. Cuando se crea un turno, automáticamente se genera un pago con estado "pendiente". Los profesionales pueden marcar los turnos como pagados, y tanto pacientes como profesionales pueden ver el estado de pago de sus turnos.

## Tipos de Datos

### Payment
```typescript
interface Payment {
  id?: number;
  turno_ID: number;
  estado: 'pagado' | 'pendiente';
  fecha?: string;
  monto?: number;
}
```

### PatientPayment / ProfessionalPayment
Extienden `Payment` con información adicional del turno asociado (nombre del profesional/paciente, fecha, horario, etc.).

## Hooks Disponibles

### useGetPatientPayments()
- **Descripción**: Obtiene todos los pagos del paciente autenticado
- **Endpoint**: `GET /VerPagos`
- **Requiere**: Token de autenticación
- **Retorna**: `GetPaymentsResponse` con array de pagos
- **Uso**:
  ```typescript
  const { data: paymentsData, isLoading, error } = useGetPatientPayments();
  ```

### useGetProfessionalPayments()
- **Descripción**: Obtiene todos los pagos de los turnos del profesional autenticado
- **Endpoint**: `GET /VerPagosProfesional`
- **Requiere**: Token de autenticación
- **Retorna**: `GetPaymentsResponse` con array de pagos
- **Uso**:
  ```typescript
  const { data: paymentsData, isLoading, error } = useGetProfessionalPayments();
  ```

### useMarkAsPaid()
- **Descripción**: Marca un turno como pagado
- **Endpoint**: `PUT /PagarTurno`
- **Requiere**: Token de autenticación + turnoId
- **Retorna**: `MarkAsPaidResponse`
- **Uso**:
  ```typescript
  const { mutate: markAsPaid, isPending } = useMarkAsPaid();
  
  // Marcar como pagado
  markAsPaid(
    { turnoId: 123 },
    {
      onSuccess: () => console.log('Marcado como pagado'),
      onError: (error) => console.error('Error', error)
    }
  );
  ```

## Flujo de Trabajo

### Para Pacientes (MyAppointments)
1. Al cargar la página, se obtienen los turnos y los pagos
2. Cada turno muestra un badge con su estado de pago:
   - 🟢 **Pagado**: Verde con ícono de check
   - 🟡 **Pendiente de Pago**: Amarillo con ícono de dólar
3. El paciente puede ver pero **no modificar** el estado de pago

### Para Profesionales (ProfessionalAppointments)
1. Al cargar la página, se obtienen los turnos y los pagos
2. Cada tarjeta de turno muestra un badge con el estado de pago
3. Al hacer clic en un turno, se abre un modal con:
   - Información completa del turno
   - Estado de pago actual
   - **Botón "Marcar Pagado"** (solo visible si el pago está pendiente)
4. Al marcar como pagado:
   - Se muestra un modal de confirmación
   - Si se confirma, se actualiza el estado en el backend
   - Se invalidan las queries para refrescar los datos
   - Se muestra un mensaje de éxito

## Componentes Modificados

### MyAppointments
- Importa `useGetPatientPayments`
- Función `getPaymentStatus(turnoId)` para obtener el estado de un turno
- Badge de pago en cada tarjeta de turno

### ProfessionalAppointments
- Importa `useGetProfessionalPayments` y `useMarkAsPaid`
- Función `getPaymentStatus(turnoId)` para obtener el estado de un turno
- Función `handleMarkAsPaid(turnoId)` para marcar como pagado con confirmación
- Badge de pago en cada tarjeta de turno
- Modal de notificación para confirmaciones y mensajes

### AppointmentDetailsModal
- Nuevos props opcionales:
  - `paymentStatus`: Estado actual del pago
  - `onMarkAsPaid`: Callback para marcar como pagado
  - `isMarkingAsPaid`: Indicador de carga
- Sección de estado de pago con botón de acción

## Invalidación de Queries

Cuando se marca un turno como pagado, se invalidan automáticamente las siguientes queries:
- `professional-payments`
- `patient-payments`
- `professional-appointments`
- `patient-appointments`

Esto asegura que todos los datos se actualicen correctamente en la UI.

## Colores y Estilos

### Estado "Pagado"
- Background: `#d1fae5` (verde claro)
- Texto: `#065f46` (verde oscuro)
- Ícono: Check

### Estado "Pendiente"
- Background: `#fef3c7` (amarillo claro)
- Texto: `#92400e` (amarillo oscuro)
- Ícono: DollarSign

## Notas Técnicas

1. **Creación Automática**: Los pagos se crean automáticamente en el backend cuando se genera un turno nuevo (estado inicial: "pendiente")

2. **Solo Lectura para Pacientes**: Los pacientes pueden ver el estado pero no modificarlo

3. **Gestión por Profesionales**: Solo los profesionales pueden cambiar el estado a "pagado"

4. **Sincronización**: El sistema usa React Query para mantener los datos sincronizados entre el frontend y el backend

5. **Manejo de Errores**: Todos los hooks incluyen manejo de errores con mensajes descriptivos

