export type RiskLevel = 'low' | 'medium' | 'danger' | 'illegal_entity' | 'high';
export type Severity = 'info' | 'warning' | 'critical';

export interface ViolationResult {
  rule_code: string;
  statutory_article: string;
  violation_type: string;
  clause_snippet: string;
  legal_explanation: string;
  severity: Severity;
}

export interface ExtractContractRequest {
  document_text?: string;
  file_name?: string;
}

export interface ExtractedContractData {
  platform_name: string;
  daily_interest_rate: number;
  admin_fee_percentage: number;
  late_fee_daily_rate: number;
  tenor_days: number;
  permissions_requested: string[];
  raw_summary?: string;
}

export interface AuditContractRequest {
  platform_name: string;
  document_url: string;
  daily_interest_rate: number;
  admin_fee_percentage: number;
  late_fee_daily_rate: number;
  tenor_days: number;
  permissions_requested: string[];
}

export interface ContractAuditResponse {
  id: string;
  platform_name: string;
  is_ojk_licensed: boolean;
  license_number?: string;
  risk_level: RiskLevel;
  summary_explanation: string;
  violations: ViolationResult[];
  created_at: string;
}

export interface CreateCaseRequest {
  case_title: string;
  platform_name: string;
  debt_collector_identifier: string;
  claimed_debt_amount: number;
  case_summary: string;
}

export interface AddEvidenceItemRequest {
  file_url: string;
  media_type: string;
  message_timestamp_hour: number;
  sender_phone: string;
  message_text: string;
  threat_category: string;
}

export interface EvidenceItem {
  id: string;
  case_id: string;
  file_url: string;
  sender_phone: string;
  message_text: string;
  threat_category: string;
  message_timestamp_hour?: number;
  violations: ViolationResult[];
  created_at: string;
}

export interface EvidenceCase {
  id: string;
  case_title: string;
  platform_name: string;
  debt_collector_identifier: string;
  claimed_debt_amount: number;
  status: string;
  case_summary: string;
  items: EvidenceItem[];
  created_at: string;
}

export interface ChatHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatMessageRequest {
  case_id?: string;
  message: string;
  conversation_history?: ChatHistoryItem[];
}

export interface ChatMessageResponse {
  reply: string;
  suggested_channel: string;
  relevant_articles: string[];
}

export interface GenerateComplaintDraftRequest {
  case_id: string;
  channel_code: 'ojk' | 'afpi' | 'polri' | string;
  victim_name: string;
  victim_nik: string;
  victim_phone: string;
}

export interface ComplaintDraftResponse {
  id: string;
  case_id: string;
  channel_code: string;
  channel_name: string;
  draft_title: string;
  generated_letter_body: string;
  submission_guidelines: string;
  official_portal_url: string;
  official_email: string;
  official_whatsapp: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  legal_citations?: string[];
}

export interface QuizOption {
  key: string;
  text: string;
  is_correct?: boolean;
  explanation?: string;
}

export interface QuizData {
  question_text: string;
  correct_answer_key: string;
  explanation: string;
  options: QuizOption[];
}

export interface LiteracyModule {
  id: string;
  title: string;
  category: string;
  target_violation_category: string;
  reading_content: string;
  brief_content: string;
  reading_time_minutes: number;
  quiz: QuizData;
}
