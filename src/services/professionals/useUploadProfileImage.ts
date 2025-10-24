import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';

interface UploadImageResponse {
  imagenUrl: string;
  message: string;
  result: boolean;
}

const uploadProfileImage = async (imageFile: File): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append('imagen', imageFile);

  const response = await fetchServer<UploadImageResponse>({
    url: '/cargarImagenUsuario',
    method: 'POST',
    body: formData,
    useToken: true,
    isFormData: true, // Indicar que es multipart/form-data
  });

  return response;
};

export const useUploadProfileImage = (): UseMutationResult<
  UploadImageResponse,
  Error,
  File,
  unknown
> => {
  return useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: (data) => {
      console.log('✅ Imagen de perfil cargada exitosamente:', data.imagenUrl);
    },
    onError: (error) => {
      console.error('❌ Error al cargar imagen de perfil:', error);
    },
  });
};
