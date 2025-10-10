# Servicios de Autenticación - MediTurnos

## useGetUser Hook

Hook para obtener los datos del usuario autenticado desde el backend.

### Endpoint
- **Ruta**: `/obtenerUsuario`
- **Método**: `GET` (con fallback a `POST` si es necesario)
- **Autenticación**: Requiere token en headers (Bearer Token)

### Características
- ✅ Cache inteligente con React Query
- ✅ Intenta automáticamente GET y POST
- ✅ Actualiza localStorage automáticamente
- ✅ Reintentos automáticos
- ✅ TypeScript completo

---

## Uso Básico

```typescript
import { useGetUser } from '../../services/auth/useGetUser';

function MyComponent() {
  const { data: user, isLoading, error, refetch } = useGetUser();

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Hola, {user?.name}</h1>
      <p>Email: {user?.email}</p>
      <button onClick={() => refetch()}>Actualizar datos</button>
    </div>
  );
}
```

---

## Ejemplo: Actualizar Header con datos del servidor

```typescript
import React, { useEffect } from 'react';
import { useGetUser } from '../../services/auth/useGetUser';

const Header: React.FC = () => {
  const { data: user, isLoading, error } = useGetUser();

  const getDisplayName = () => {
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.name) {
      return user.name;
    }
    return 'Usuario';
  };

  return (
    <header>
      {isLoading ? (
        <span>Cargando...</span>
      ) : (
        <span>Bienvenido, {getDisplayName()}</span>
      )}
    </header>
  );
};
```

---

## Ejemplo: Perfil de Usuario

```typescript
import React from 'react';
import { useGetUser } from '../../services/auth/useGetUser';

const UserProfile: React.FC = () => {
  const { data: user, isLoading, error, refetch } = useGetUser();

  const handleRefresh = async () => {
    await refetch();
    alert('Datos actualizados');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error al cargar datos: {error.message}</p>
        <button onClick={() => refetch()} className="mt-2 text-red-700 underline">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Mi Perfil</h2>
      
      <div className="space-y-3">
        <div>
          <label className="font-semibold">Nombre:</label>
          <p>{user?.firstName} {user?.lastName}</p>
        </div>
        
        <div>
          <label className="font-semibold">Email:</label>
          <p>{user?.email}</p>
        </div>
        
        <div>
          <label className="font-semibold">Rol:</label>
          <p>{user?.role?.name || 'N/A'}</p>
        </div>
      </div>

      <button 
        onClick={handleRefresh}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Actualizar Datos
      </button>
    </div>
  );
};
```

---

## Hook useGetUserOnce

Para casos donde solo necesitas cargar los datos una vez y no quieres refetch automático:

```typescript
import { useGetUserOnce } from '../../services/auth/useGetUser';

function MyComponent() {
  const { data: user, isLoading } = useGetUserOnce();
  
  // Los datos se cargan una vez y nunca se revalidan automáticamente
  // Útil para páginas estáticas o datos que no cambian frecuentemente
  
  return <div>{user?.name}</div>;
}
```

---

## Control Manual del Hook

```typescript
import { useGetUser } from '../../services/auth/useGetUser';

function MyComponent() {
  const { 
    data: user,           // Datos del usuario
    isLoading,            // Estado de carga inicial
    isFetching,           // Estado de cualquier fetch (incluye refetch)
    error,                // Error si existe
    refetch,              // Función para refetch manual
    isSuccess,            // true si la query fue exitosa
    isError               // true si hubo error
  } = useGetUser();

  return (
    <div>
      {isFetching && <span>Actualizando...</span>}
      {isSuccess && <span>✓ Datos cargados</span>}
      {isError && <span>✗ Error</span>}
    </div>
  );
}
```

---

## Configuración de Cache

El hook usa la siguiente configuración de cache:

- **staleTime**: 5 minutos - Los datos son considerados frescos por 5 minutos
- **gcTime**: 10 minutos - Los datos permanecen en cache por 10 minutos
- **retry**: 1 - Reintenta automáticamente una vez si falla
- **refetchOnMount**: true - Refetch al montar el componente si los datos están obsoletos
- **refetchOnWindowFocus**: true - Refetch cuando la ventana recupera el foco

---

## Integración con useLogin

El hook `useLogin` ya guarda los datos del usuario en localStorage al hacer login.
`useGetUser` sirve para:

1. **Actualizar datos** después del login
2. **Sincronizar** con el servidor si los datos cambiaron
3. **Validar** que el token sigue siendo válido
4. **Obtener datos completos** si el login solo devuelve datos parciales

```typescript
// En Login
const { mutateAsync } = useLogin();
await mutateAsync({ email, password }); // Guarda user en localStorage

// En Dashboard (después del login)
const { data: user } = useGetUser(); // Obtiene datos actualizados del servidor
```

---

## Manejo de Errores

El hook maneja automáticamente:

- ✅ **Error 401**: El token no es válido → Redirige a login
- ✅ **Error 404**: Endpoint no encontrado → Intenta con POST
- ✅ **Error 405**: Method Not Allowed → Intenta con POST
- ✅ **Error 500+**: Error del servidor → Muestra mensaje de error

---

## TypeScript

El hook está completamente tipado:

```typescript
interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

const { data: user } = useGetUser();
// user es de tipo User | undefined
```

---

## Verificar si el backend es GET o POST

Si no estás seguro del método correcto, el hook lo detectará automáticamente:

1. **Primero** intenta con `GET` (lo correcto según REST)
2. Si recibe 404 o 405, **automáticamente** intenta con `POST`
3. Si ambos fallan, muestra el error

Esto te permite trabajar sin preocuparte por el método correcto.

