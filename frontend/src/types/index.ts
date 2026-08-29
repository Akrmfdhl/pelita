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

export interface ComplaintDraft {
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

export interface LiteracyModule {
  id: string;
  slug: string;
  title: string;
  target_violation_category: string;
  brief_content: string;
  reading_time_minutes: number;
}
