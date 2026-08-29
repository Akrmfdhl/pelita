package rules

type RiskLevel string

const (
	RiskLow           RiskLevel = "low"
	RiskMedium        RiskLevel = "medium"
	RiskDanger        RiskLevel = "danger"
	RiskIllegalEntity RiskLevel = "illegal_entity"
)

type Severity string

const (
	SeverityInfo     Severity = "info"
	SeverityWarning  Severity = "warning"
	SeverityCritical Severity = "critical"
)

type ContractAuditInput struct {
	PlatformName         string
	IsOJKLicensed        bool
	DailyInterestRate    float64
	AdminFeePercentage   float64
	LateFeeDailyRate     float64
	TenorDays            int
	PermissionsRequested []string
}

type ViolationResult struct {
	RuleCode         string   `json:"rule_code"`
	StatutoryArticle string   `json:"statutory_article"`
	ViolationType    string   `json:"violation_type"`
	ClauseSnippet    string   `json:"clause_snippet"`
	LegalExplanation string   `json:"legal_explanation"`
	Severity         Severity `json:"severity"`
}

type ContractAuditResult struct {
	RiskLevel          RiskLevel         `json:"risk_level"`
	SummaryExplanation string            `json:"summary_explanation"`
	Violations         []ViolationResult `json:"violations"`
}

type EvidenceItemInput struct {
	MessageTimestampHour int
	SenderIdentifier     string
	MessageText          string
	ThreatCategory       string
}
