import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';

interface BlockPatientParams {
  emailPaciente: string;
  motivo: string;
}

interface BlockPatientResponse {
  message: string;
  result: boolean;
}

export const useBlockPatient = () => {
  const queryClient = useQueryClient();

  return useMutation<BlockPatientResponse, Error, BlockPatientParams>({
    mutationFn: async ({ emailPaciente, motivo }: BlockPatientParams) => {
      console.log('🚫 Bloqueando paciente:', emailPaciente, 'Motivo:', motivo);
      const response = await fetchServer({
        method: 'POST',
        url: '/bloquearUsuario',
        data: {
          emailPaciente,
          motivo
        },
        useToken: true,
      });
      console.log('✅ Paciente bloqueado:', response);
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
