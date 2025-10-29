import { useQuery } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';

interface FullCountryInfoResult {
  sCapitality: string;
  sPhoneCode: string;
  sCurrencyISOCode: string;
  sCountryFlag: string;
  sISOCode: string;
  sName: string;
  sContinentCode: string;
  Languages: Array<{ sISOCode: string; sName: string }>;
}

interface CountryInfoResponse {
  message: string;
  result: boolean;
  data: {
    fullCountryInfoResult: FullCountryInfoResult;
  };
}

export const useGetCountryInfo = (isoCode: string) => {
  return useQuery<CountryInfoResponse>({
    queryKey: ['countryInfo', isoCode],
    queryFn: async () => {
      const response = await fetchServer({
        url: '/infoPais',
        method: 'GET',
        params: { isoCode },
        useToken: false
      });
      return response;
    },
    enabled: !!isoCode && isoCode.length === 2,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
  });
};
