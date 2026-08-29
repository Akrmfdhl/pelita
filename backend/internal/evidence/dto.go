package evidence

import "github.com/pelita/backend/internal/rules"

type CreateCaseRequest struct {
	CaseTitle                string  `json:"case_title"`
	PlatformName             string  `json:"platform_name"`
	DebtCollectorIdentifier string  `json:"debt_collector_identifier"`
	ClaimedDebtAmount        float64 `json:"claimed_debt_amount"`
	CaseSummary              string  `json:"case_summary"`
}

type AddEvidenceItemRequest struct {
	FileURL              string `json:"file_url"`
	MediaType            string `json:"media_type"`
	MessageTimestampHour int    `json:"message_timestamp_hour"`
	SenderPhone          string `json:"sender_phone"`
	MessageText          string `json:"message_text"`
	ThreatCategory       string `json:"threat_category"`
}

type EvidenceItemResponse struct {
	ID             string                  `json:"id"`
	CaseID         string                  `json:"case_id"`
	FileURL        string                  `json:"file_url"`
	SenderPhone    string                  `json:"sender_phone"`
	MessageText    string                  `json:"message_text"`
	ThreatCategory string                  `json:"threat_category"`
	Violations     []rules.ViolationResult `json:"violations"`
	CreatedAt      string                  `json:"created_at"`
}

type CaseDetailResponse struct {
	ID                      string                 `json:"id"`
	CaseTitle               string                 `json:"case_title"`
	PlatformName            string                 `json:"platform_name"`
	DebtCollectorIdentifier string                 `json:"debt_collector_identifier"`
	ClaimedDebtAmount       float64                `json:"claimed_debt_amount"`
	Status                  string                 `json:"status"`
	CaseSummary             string                 `json:"case_summary"`
	Items                   []EvidenceItemResponse `json:"items"`
	CreatedAt               string                 `json:"created_at"`
}
