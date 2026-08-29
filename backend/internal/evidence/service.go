package evidence

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/pelita/backend/internal/rules"
	"github.com/pelita/backend/internal/security"
)

type Service struct {
	ruleEngine *rules.RuleEngine
	encryptor  *security.Encryptor
}

func NewService(ruleEngine *rules.RuleEngine, encryptor *security.Encryptor) *Service {
	return &Service{
		ruleEngine: ruleEngine,
		encryptor:  encryptor,
	}
}

func (s *Service) CreateCase(ctx context.Context, userID string, req CreateCaseRequest) (*CaseDetailResponse, error) {
	caseID := uuid.New().String()
	return &CaseDetailResponse{
		ID:                      caseID,
		CaseTitle:               req.CaseTitle,
		PlatformName:            req.PlatformName,
		DebtCollectorIdentifier: req.DebtCollectorIdentifier,
		ClaimedDebtAmount:       req.ClaimedDebtAmount,
		Status:                  "active",
		CaseSummary:             req.CaseSummary,
		Items:                   []EvidenceItemResponse{},
		CreatedAt:               time.Now().Format(time.RFC3339),
	}, nil
}

func (s *Service) AddEvidenceItem(ctx context.Context, userID, caseID string, req AddEvidenceItemRequest) (*EvidenceItemResponse, error) {
	_, err := s.encryptor.Encrypt(req.MessageText)
	if err != nil {
		return nil, err
	}

	auditInput := rules.EvidenceItemInput{
		MessageTimestampHour: req.MessageTimestampHour,
		SenderIdentifier:     req.SenderPhone,
		MessageText:          req.MessageText,
		ThreatCategory:       req.ThreatCategory,
	}

	violations := s.ruleEngine.AuditEvidenceItem(auditInput)

	return &EvidenceItemResponse{
		ID:             uuid.New().String(),
		CaseID:         caseID,
		FileURL:        req.FileURL,
		SenderPhone:    req.SenderPhone,
		MessageText:    req.MessageText,
		ThreatCategory: req.ThreatCategory,
		Violations:     violations,
		CreatedAt:      time.Now().Format(time.RFC3339),
	}, nil
}
