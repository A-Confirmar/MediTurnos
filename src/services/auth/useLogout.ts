import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';
import { removeAuthorization } from '../AxiosInstance';
import { clearSession } from '../localstorage';
import { ROUTES } from '../../const/routes';

// Endpoint de logout (si el backend lo tiene)
const logoutEndpoint = '/logout';

interface LogoutResult {
  success: boolean;
  message?: string;
}

export const useLogout = (): UseMutationResult<LogoutResult, Error, void> => {
  return useMutation<LogoutResult, Error, void>({
    mutationFn: async () => {
      try {
        // Intentar hacer logout en el servidor
        const result = await fetchServer({
          method: 'POST',
          url: logoutEndpoint,
          useToken: true,
        });
        return result;
      } catch (error) {
        console.error('Error al cerrar sesión en el servidor:', error);
        // Continuamos con el logout local aunque falle el servidor
        return { success: true, message: 'Sesión cerrada localmente' };
      } finally {
        // Limpiar sesión local
        clearSession();
        removeAuthorization();

        // Redirigir al login
        window.location.href = ROUTES.login;
      }
    },
    onError: (error) => {
      console.error('Error en logout:', error);
      // Asegurar que se limpie la sesión incluso si hay error
      clearSession();
      removeAuthorization();
      window.location.href = ROUTES.login;
    },
    onSuccess: () => {
      console.log('Logout exitoso');
    }
  });
};
