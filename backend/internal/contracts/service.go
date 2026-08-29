package contracts

import (
	"context"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/pelita/backend/internal/rules"
)

type Service struct {
	ruleEngine *rules.RuleEngine
}

func NewService(ruleEngine *rules.RuleEngine) *Service {
	return &Service{
		ruleEngine: ruleEngine,
	}
}

func (s *Service) AuditContract(ctx context.Context, userID string, req AuditContractRequest) (*ContractAuditResponse, error) {
	isOJK := s.checkOJKWhitelist(req.PlatformName)
	licenseNo := ""
	if isOJK {
		licenseNo = "KEP-19/D.05/2021"
	}

	auditInput := rules.ContractAuditInput{
		PlatformName:         req.PlatformName,
		IsOJKLicensed:        isOJK,
		DailyInterestRate:    req.DailyInterestRate,
		AdminFeePercentage:   req.AdminFeePercentage,
		LateFeeDailyRate:     req.LateFeeDailyRate,
		TenorDays:            req.TenorDays,
		PermissionsRequested: req.PermissionsRequested,
	}

	auditResult := s.ruleEngine.AuditContract(auditInput)

	return &ContractAuditResponse{
		ID:                 uuid.New().String(),
		PlatformName:       req.PlatformName,
		IsOJKLicensed:      isOJK,
		LicenseNumber:      licenseNo,
		RiskLevel:          auditResult.RiskLevel,
		SummaryExplanation: auditResult.SummaryExplanation,
		Violations:         auditResult.Violations,
		CreatedAt:          time.Now().Format(time.RFC3339),
	}, nil
}

func (s *Service) checkOJKWhitelist(platformName string) bool {
	lower := strings.ToLower(strings.TrimSpace(platformName))
	legalPlatforms := []string{"easycash", "adakami", "kredivo", "akulaku", "indodana", "julo", "rupiah cepat"}
	for _, p := range legalPlatforms {
		if strings.Contains(lower, p) {
			return true
		}
	}
	return false
}
