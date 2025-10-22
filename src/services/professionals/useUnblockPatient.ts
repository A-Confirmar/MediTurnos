import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';

interface UnblockPatientParams {
  emailPaciente: string;
}

interface UnblockPatientResponse {
  message: string;
  result: boolean;
}

export const useUnblockPatient = () => {
  const queryClient = useQueryClient();

  return useMutation<UnblockPatientResponse, Error, UnblockPatientParams>({
    mutationFn: async ({ emailPaciente }: UnblockPatientParams) => {
      console.log('✅ Desbloqueando paciente:', emailPaciente);
      const response = await fetchServer({
        method: 'DELETE',
        url: '/desbloquearUsuario',
        data: {
          emailPaciente
        },
        useToken: true,
      });
      console.log('✅ Paciente desbloqueado:', response);
      return response;
    },
    onSuccess: () => {
      // Invalidar la lista de pacientes para refrescar
      queryClient.invalidateQueries({ queryKey: ['linkedPatients'] });
      // Invalidar la lista de bloqueados para refrescar
      queryClient.invalidateQueries({ queryKey: ['blockedPatients'] });
    },
  });
};
