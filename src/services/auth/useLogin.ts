import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';
import { setAccessToken, setUserRole, setUser } from '../localstorage';
import type { LoginCredentials, LoginResponse } from '../../types/User';
import { authorizeAxios } from '../AxiosInstance';

const getLoginEndpoint = () => '/login';

export const useLogin = (): UseMutationResult<
  LoginResponse,
  Error,
  LoginCredentials,
  unknown
> => {
  return useMutation<LoginResponse, Error, LoginCredentials, unknown>({
    mutationFn: async (credentials: LoginCredentials) => {
      console.log('🚀 INICIO useLogin - Datos recibidos:', credentials);
      console.log('🔐 Configuración:', {
        email: credentials.email,
        url: getLoginEndpoint(),
        API_URL_config: 'https://200.85.177.8:4003',
        fullUrl: `https://200.85.177.8:4003${getLoginEndpoint()}` // Ruta: /login
      });
      console.log('📡 A punto de llamar fetchServer...');

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

        console.log('✅ Respuesta del backend:', result);

        // Manejo de la respuesta según el formato del swagger
        if (result.token) {
          await setAccessToken(result.token);
          await authorizeAxios();
        }

        // Si el backend no devuelve user, crear un usuario básico con el email
        if (result.user) {
          setUser(result.user);
          if (result.user.role?.name) {
            setUserRole(result.user.role.name);
          }
          console.log('✅ Usuario del backend guardado:', result.user);
        } else {
          // Crear usuario básico con el email del login
          const emailPart = credentials.email.split('@')[0];
          const basicUser = {
            id: '1',
            email: credentials.email,
            name: emailPart,
            // Si el email tiene formato nombre.apellido, intentar separarlo
            firstName: emailPart.includes('.') ? emailPart.split('.')[0] : emailPart,
            lastName: emailPart.includes('.') ? emailPart.split('.').slice(1).join('.') : undefined,
          };
          setUser(basicUser);
          console.log('✅ Usuario básico creado:', basicUser);
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
