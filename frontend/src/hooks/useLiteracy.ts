import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../lib/api';
import { LiteracyModule } from '../types';

export const useLiteracyModules = () => {
  return useQuery({
    queryKey: ['literacy', 'modules'],
    queryFn: async () => {
      return apiRequest<LiteracyModule[]>('/literacy/modules');
    },
  });
};
