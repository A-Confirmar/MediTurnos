import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';
import type { User } from '../../types/User';

interface HomeResponse {
  message: string;
  user: User;
  result: boolean;
}

const getHomeEndpoint = () => '/home';

export const useHome = (): UseQueryResult<HomeResponse, Error> => {
  return useQuery<HomeResponse, Error>({
    queryKey: ['homeData'],
    queryFn: async () => {
      const result = await fetchServer({
        method: 'GET',
        url: getHomeEndpoint(),
        useToken: true, // Este endpoint requiere token
      });
      return result;
    },
    // Opciones de reintento y refetch
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
