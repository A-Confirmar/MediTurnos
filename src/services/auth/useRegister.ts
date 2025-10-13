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

      try {
        const result = await fetchServer({
          method: 'POST', // Backend definido como POST según swagger
          url: getRegisterEndpoint(),
          data: {
            nombre: credentials.nombre,
            email: credentials.email,
            password: credentials.password,
            apellido: credentials.apellido,
            fecha_nacimiento: credentials.fecha_nacimiento,
            telefono: credentials.telefono,
            localidad: credentials.localidad, // Campo nuevo obligatorio
            rol: credentials.rol,
            // Campos opcionales para profesionales
            ...(credentials.direccion && { direccion: credentials.direccion }),
            ...(credentials.especialidad && { especialidad: credentials.especialidad }),
            ...(credentials.descripcion && { descripcion: credentials.descripcion }),
            ...(credentials.calificacionPromedio && { calificacionPromedio: credentials.calificacionPromedio })
          },
          headers: {
            'Content-Type': 'application/json'
          },
          useToken: false, // No requiere token para registrarse
        });

        return result;
      } catch (error) {
        console.error('❌ Error en registro:', error);
        throw error;
      }
    },
    onError: (error: Error) => {
      console.error('Error en registro:', error);
    },
    onSuccess: (data) => {
      console.log('Registro exitoso:', data.message);
    }
  });
};
