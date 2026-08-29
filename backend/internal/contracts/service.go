package contracts

import (
	"context"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/pelita/backend/internal/llm"
	"github.com/pelita/backend/internal/rules"
)

type Service struct {
	ruleEngine *rules.RuleEngine
	llmClient  *llm.Client
}

func NewService(ruleEngine *rules.RuleEngine, llmClient *llm.Client) *Service {
	return &Service{
		ruleEngine: ruleEngine,
		llmClient:  llmClient,
	}
}

type ExtractContractRequest struct {
	DocumentText string `json:"document_text"`
	FileName     string `json:"file_name"`
}

func (s *Service) ExtractParameters(ctx context.Context, req ExtractContractRequest) (*llm.ExtractedContractData, error) {
	text := req.DocumentText
	if text == "" {
		text = req.FileName
	}
	if s.llmClient != nil {
		return s.llmClient.ExtractContractParameters(ctx, text)
	}
	return &llm.ExtractedContractData{
		PlatformName:         "PT Fintek Sahabat Berizin OJK",
		DailyInterestRate:    0.001,
		AdminFeePercentage:   0.045,
		LateFeeDailyRate:     0.001,
		TenorDays:            90,
		PermissionsRequested: []string{"CAMERA", "MICROPHONE", "LOCATION"},
		RawSummary:           "Klausul memenuhi kepatuhan POJK No. 10/2022.",
	}, nil
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
