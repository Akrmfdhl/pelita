import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '../lib/api';
import {
  ChatMessageRequest,
  ChatMessageResponse,
  GenerateComplaintDraftRequest,
  ComplaintDraftResponse,
} from '../types';

export const useAssistantChat = () => {
  return useMutation({
    mutationFn: async (payload: ChatMessageRequest) => {
      return apiRequest<ChatMessageResponse>('/reporting/chat', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
  });
};

export const useGenerateComplaintDraft = () => {
  return useMutation({
    mutationFn: async (payload: GenerateComplaintDraftRequest) => {
      return apiRequest<ComplaintDraftResponse>('/reporting/drafts', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
  });
};
