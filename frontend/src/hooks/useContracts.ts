import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '../lib/api';
import {
  ExtractContractRequest,
  ExtractedContractData,
  AuditContractRequest,
  ContractAuditResponse,
} from '../types';

export const useExtractContract = () => {
  return useMutation({
    mutationFn: async (payload: ExtractContractRequest) => {
      return apiRequest<ExtractedContractData>('/contracts/extract', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
  });
};

export const useAuditContract = () => {
  return useMutation({
    mutationFn: async (payload: AuditContractRequest) => {
      return apiRequest<ContractAuditResponse>('/contracts/audit', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
  });
};
