import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';
import { setUser, setUserRole } from '../localstorage';
import type { User } from '../../types/User';

/**
 * Hook para obtener los datos del usuario autenticado
 * Endpoint: GET /obtenerUsuario
 * Requiere: Token en headers (automático con useToken: true)
 */

interface GetUserResponse {
  user: User;
  message?: string;
}

const getUserEndpoint = () => '/obtenerUsuario';

export const useGetUser = (): UseQueryResult<User, Error> => {
  return useQuery<User, Error>({
    queryKey: ['user', 'current'], // Clave única para el cache
    queryFn: async () => {
      console.log('🔍 Obteniendo datos del usuario autenticado...');
      
      try {
        // Intentar con GET (lo más probable según REST)
        const result = await fetchServer({
          method: 'GET',
          url: getUserEndpoint(),
          useToken: true, // Envía el token automáticamente en headers
        });

        console.log('✅ Datos del usuario obtenidos:', result);

        // El backend puede devolver { user: {...} } o directamente el usuario
        const userData = result.user || result;

        // Actualizar datos en localStorage
        if (userData) {
          setUser(userData);
          if (userData.role?.name) {
            setUserRole(userData.role.name);
          }
        }

        return userData;
      } catch (error: any) {
        console.error('❌ Error al obtener usuario:', error);
        
        // Si el GET falla con 404 o 405 (Method Not Allowed), intentar con POST
        if (error.status === 404 || error.status === 405) {
          console.log('⚠️ GET no funciona, intentando con POST...');
          
          try {
            const resultPost = await fetchServer({
              method: 'POST',
              url: getUserEndpoint(),
              useToken: true,
              data: {}, // Algunos backends requieren body vacío
            });

            const userDataPost = resultPost.user || resultPost;

            if (userDataPost) {
              setUser(userDataPost);
              if (userDataPost.role?.name) {
                setUserRole(userDataPost.role.name);
              }
            }

            return userDataPost;
          } catch (postError) {
            console.error('❌ Error con POST también:', postError);
            throw postError;
          }
        }
        
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
      
      if (userData) {
        setUser(userData);
        if (userData.role?.name) {
          setUserRole(userData.role.name);
        }
      }
      
      return userData;
    },
    staleTime: Infinity, // Nunca considerar los datos obsoletos
    gcTime: Infinity, // Mantener en cache indefinidamente
    retry: false, // No reintentar
    refetchOnMount: false, // No refetch al montar
    refetchOnWindowFocus: false, // No refetch al enfocar ventana
    refetchOnReconnect: false, // No refetch al reconectar
  });
};

