import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';
import { setAccessToken, setUserRole, setUser } from '../localstorage';
import type { LoginCredentials, LoginResponse, User } from '../../types/User';
import { authorizeAxios } from '../AxiosInstance';

const getLoginEndpoint = () => '/login';
const getUserEndpoint = () => '/obtenerUsuario';

export const useLogin = (): UseMutationResult<
  LoginResponse,
  Error,
  LoginCredentials,
  unknown
> => {
  return useMutation<LoginResponse, Error, LoginCredentials, unknown>({
    mutationFn: async (credentials: LoginCredentials) => {

      try {
        const result = await fetchServer({
          method: 'POST', // Backend ahora es POST y puede leer req.body correctamente
          url: getLoginEndpoint(),
          data: {
            email: credentials.email,
            password: credentials.password
          }, // Enviamos en el body como JSON (más seguro)
          headers: {
            'Content-Type': 'application/json'
          },
          useToken: false,
        });


        // Manejo de la respuesta según el formato del swagger
        if (result.token) {
          await setAccessToken(result.token);
          await authorizeAxios();
        }

        // Intentar obtener los datos completos del usuario del backend
        let userData: User | null = null;

        if (result.user) {
          // Si el login devolvió el usuario, usarlo
          userData = result.user;
          console.log('✅ Usuario incluido en respuesta del login:', userData);
        } else {
          // Si no devolvió el usuario, obtenerlo del endpoint /obtenerUsuario
          console.log('⚠️ Login no devolvió usuario, obteniendo del endpoint...');
          try {
            const userResult = await fetchServer({
              method: 'GET',
              url: getUserEndpoint(),
              useToken: true,
            });
            
            userData = userResult.user || userResult;
            console.log('✅ Usuario obtenido del endpoint:', userData);
          } catch (userError) {
            console.error('❌ Error al obtener usuario del endpoint:', userError);
            // Si falla, crear usuario básico como fallback
            const emailPart = credentials.email.split('@')[0];
            userData = {
              email: credentials.email,
              name: emailPart,
              firstName: emailPart.includes('.') ? emailPart.split('.')[0] : emailPart,
              lastName: emailPart.includes('.') ? emailPart.split('.').slice(1).join('.') : undefined,
            } as User;
            console.log('⚠️ Usuario básico creado como fallback:', userData);
          }
        }

        // Guardar el usuario y su rol
        if (userData) {
          setUser(userData);
          
          // Guardar el rol del usuario - priorizar diferentes formatos
          let userRole: string | undefined;
          
          if (userData.role) {
            // Si role es un objeto con name
            if (typeof userData.role === 'object' && 'name' in userData.role) {
              userRole = userData.role.name;
            } 
            // Si role es un string directamente
            else if (typeof userData.role === 'string') {
              userRole = userData.role;
            }
          }
          
          // Fallback al campo rol (español)
          if (!userRole && userData.rol) {
            userRole = userData.rol;
          }
          
          if (userRole) {
            console.log('🎯 Guardando rol del usuario:', userRole);
            setUserRole(userRole);
          } else {
            console.warn('⚠️ No se encontró rol en los datos del usuario');
          }
          
          console.log('✅ Datos finales guardados:');
          console.log('  - Usuario:', userData);
          console.log('  - Rol:', userRole);
        }

        return result;
      } catch (error) {
        console.error('❌ Error en login:', error);
        throw error;
      }
    },
    onError: (error: Error) => {
      console.error('Error en login:', error);
    },
    onSuccess: (data) => {
      console.log('🎉 Login exitoso!');
      console.log('📋 Token recibido:', data.token ? 'SÍ' : 'NO');
      console.log('👤 Usuario recibido:', data.user || 'NO');
      console.log('📄 Respuesta completa:', data);
    }
  });
};
