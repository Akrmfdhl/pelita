import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/api';
import {
  EvidenceCase,
  CreateCaseRequest,
  EvidenceItem,
  AddEvidenceItemRequest,
} from '../types';

export const useEvidenceCases = () => {
  return useQuery({
    queryKey: ['evidence', 'cases'],
    queryFn: async () => {
      return apiRequest<EvidenceCase[]>('/evidence/cases');
    },
  });
};

export const useCreateCase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateCaseRequest) => {
      return apiRequest<EvidenceCase>('/evidence/cases', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence', 'cases'] });
    },
  });
};

export const useAddEvidenceItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      caseId,
      item,
    }: {
      caseId: string;
      item: AddEvidenceItemRequest;
    }) => {
      return apiRequest<EvidenceItem>(`/evidence/cases/${caseId}/items`, {
        method: 'POST',
        body: JSON.stringify(item),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence', 'cases'] });
    },
  });
};
