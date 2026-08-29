package contracts

import "github.com/pelita/backend/internal/rules"

type AuditContractRequest struct {
	PlatformName         string   `json:"platform_name"`
	DocumentURL          string   `json:"document_url"`
	DailyInterestRate    float64  `json:"daily_interest_rate"`
	AdminFeePercentage   float64  `json:"admin_fee_percentage"`
	LateFeeDailyRate     float64  `json:"late_fee_daily_rate"`
	TenorDays            int      `json:"tenor_days"`
	PermissionsRequested []string `json:"permissions_requested"`
}

type ContractAuditResponse struct {
	ID                 string                  `json:"id"`
	PlatformName       string                  `json:"platform_name"`
	IsOJKLicensed      bool                    `json:"is_ojk_licensed"`
	LicenseNumber      string                  `json:"license_number,omitempty"`
	RiskLevel          rules.RiskLevel         `json:"risk_level"`
	SummaryExplanation string                  `json:"summary_explanation"`
	Violations         []rules.ViolationResult `json:"violations"`
	CreatedAt          string                  `json:"created_at"`
}
