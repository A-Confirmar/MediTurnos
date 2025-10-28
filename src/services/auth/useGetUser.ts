import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';
import { setUser, setUserRole } from '../localstorage';
import type { User } from '../../types/User';

/**
 * Hook para obtener los datos del usuario autenticado
 * Endpoint: GET /obtenerUsuario
 * Requiere: Token en headers (automático con useToken: true)
 */

const getUserEndpoint = () => '/obtenerUsuario';

export const useGetUser = (): UseQueryResult<User, Error> => {
  return useQuery<User, Error>({
    queryKey: ['user', 'current'], // Clave única para el cache
    queryFn: async () => {
      console.log('🔍 Obteniendo datos del usuario autenticado...');
      
      try {
        // Importar getAccessToken para obtener el token
        const { getAccessToken } = await import('../localstorage');
        const token = await getAccessToken();
        
        console.log('🔑 Token obtenido:', token ? 'Sí (length: ' + token.length + ')' : 'No');
        
        // El endpoint es GET pero el authMiddleware puede leer el token de los headers
        // El frontend envía el token en headers automáticamente con useToken: true
        const result = await fetchServer({
          method: 'GET',
          url: getUserEndpoint(),
          useToken: true, // Envía el token en headers: Authorization: Bearer <token>
        });

        console.log('✅ Datos del usuario obtenidos (raw):', result);

        // El backend devuelve { user: {...} } donde user contiene los campos en español
        const userData = result.user || result;
        
        console.log('✅ userData procesado:', userData);
        console.log('   - nombre:', userData.nombre);
        console.log('   - apellido:', userData.apellido);
        console.log('   - email:', userData.email);
        console.log('   - telefono:', userData.telefono);
        console.log('   - fecha_nacimiento:', userData.fecha_nacimiento);
        console.log('   - rol:', userData.rol);
        console.log('   - imagenPerfil:', userData.imagenPerfil);

        // Mapear imagenPerfil del backend a imagenUrl del frontend
        const mappedUserData = {
          ...userData,
          imagenUrl: userData.imagenPerfil || userData.imagenUrl, // Priorizar imagenPerfil del backend
        };

        console.log('✅ userData mapeado con imagenUrl:', mappedUserData.imagenUrl);

        // Actualizar datos en localStorage
        if (mappedUserData) {
          setUser(mappedUserData);
          if (mappedUserData.role?.name) {
            setUserRole(mappedUserData.role.name);
          } else if (mappedUserData.rol) {
            setUserRole(mappedUserData.rol);
          }
        }

        return mappedUserData;
      } catch (error: unknown) {
        console.error('❌ Error al obtener usuario:', error);
        throw error;
      }
    },
    // Configuración de cache
    staleTime: 5 * 60 * 1000, // Los datos son frescos por 5 minutos
    gcTime: 10 * 60 * 1000, // Mantener en cache por 10 minutos
    retry: 1, // Reintentar una vez si falla
    enabled: true, // Puede controlarse desde el componente si se necesita
  });
};

/**
 * Hook con refetch manual deshabilitado por defecto
 * Útil cuando solo necesitas los datos una vez
 */
export const useGetUserOnce = (): UseQueryResult<User, Error> => {
  return useQuery<User, Error>({
    queryKey: ['user', 'current'],
    queryFn: async () => {
      const result = await fetchServer({
        method: 'GET',
        url: getUserEndpoint(),
        useToken: true,
      });
      
      const userData = result.user || result;
      
      // Mapear imagenPerfil del backend a imagenUrl del frontend
      const mappedUserData = {
        ...userData,
        imagenUrl: userData.imagenPerfil || userData.imagenUrl,
      };
      
      if (mappedUserData) {
        setUser(mappedUserData);
        if (mappedUserData.role?.name) {
          setUserRole(mappedUserData.role.name);
        }
      }
      
      return mappedUserData;
    },
    staleTime: Infinity, // Nunca considerar los datos obsoletos
    gcTime: Infinity, // Mantener en cache indefinidamente
    retry: false, // No reintentar
    refetchOnMount: false, // No refetch al montar
    refetchOnWindowFocus: false, // No refetch al enfocar ventana
    refetchOnReconnect: false, // No refetch al reconectar
  });
};

