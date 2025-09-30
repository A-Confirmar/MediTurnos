import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';
import type { RegisterCredentials, RegisterResponse } from '../../types/User';

const getRegisterEndpoint = () => '/register';

export const useRegister = (): UseMutationResult<
  RegisterResponse,
  Error,
  RegisterCredentials,
  unknown
> => {
  return useMutation<RegisterResponse, Error, RegisterCredentials, unknown>({
    mutationFn: async (credentials: RegisterCredentials) => {
      console.log('🚀 INICIO useRegister - Datos recibidos:', credentials);
      console.log('🔐 Configuración registro:', {
        email: credentials.email,
        nombre: credentials.nombre,
        url: getRegisterEndpoint(),
        API_URL_config: 'https://200.85.177.8:4003',
        fullUrl: `https://200.85.177.8:4003${getRegisterEndpoint()}`
      });
      console.log('📡 A punto de llamar fetchServer para registro...');

      try {
        const result = await fetchServer({
          method: 'PUT', // Backend definido como PUT
          url: getRegisterEndpoint(),
          data: {
            nombre: credentials.nombre,
            email: credentials.email,
            password: credentials.password,
            apellido: credentials.apellido,
            fecha_nacimiento: credentials.fecha_nacimiento,
            telefono: credentials.telefono
          },
          headers: {
            'Content-Type': 'application/json'
          },
          useToken: false, // No requiere token para registrarse
        });

        console.log('✅ Respuesta del registro:', result);
        return result;
      } catch (error) {
        console.error('❌ Error en registro:', error);
        throw error;
      }
    },
    onError: (error: any) => {
      console.error('Error en registro:', error);
    },
    onSuccess: (data) => {
      console.log('Registro exitoso:', data.message);
    }
  });
};
