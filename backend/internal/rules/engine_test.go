package rules

import (
	"testing"
)

func TestAuditContractIllegalEntity(t *testing.T) {
	engine := NewRuleEngine()
	input := ContractAuditInput{
		PlatformName:         "Pinjaman Kilat Tak Berizin",
		IsOJKLicensed:        false,
		DailyInterestRate:    0.008,
		PermissionsRequested: []string{"CONTACTS", "LOCATION"},
	}

	result := engine.AuditContract(input)
	if result.RiskLevel != RiskIllegalEntity {
		t.Fatalf("expected risk level %s, got %s", RiskIllegalEntity, result.RiskLevel)
	}

	if len(result.Violations) == 0 {
		t.Fatal("expected at least 1 violation for illegal entity")
	}
}

func TestAuditContractHighInterest(t *testing.T) {
	engine := NewRuleEngine()
	input := ContractAuditInput{
		PlatformName:         "Fintech Berizin A",
		IsOJKLicensed:        true,
		DailyInterestRate:    0.005,
		PermissionsRequested: []string{"CAMERA", "LOCATION"},
	}

	result := engine.AuditContract(input)
	if result.RiskLevel != RiskDanger {
		t.Fatalf("expected risk level %s, got %s", RiskDanger, result.RiskLevel)
	}

	foundInterestViolation := false
	for _, v := range result.Violations {
		if v.RuleCode == "POJK-10-2022-INTEREST-CAP" {
			foundInterestViolation = true
			break
		}
	}

	if !foundInterestViolation {
		t.Fatal("expected interest cap violation")
	}
}

func TestAuditEvidenceItemLateNightAndDataDox(t *testing.T) {
	engine := NewRuleEngine()
	input := EvidenceItemInput{
		MessageTimestampHour: 23,
		SenderIdentifier:     "+628123456789",
		MessageText:          "Segera bayar sekarang atau kami sebar data foto Anda ke grup WA rekan kerja!",
	}

	violations := engine.AuditEvidenceItem(input)
	if len(violations) < 2 {
		t.Fatalf("expected at least 2 violations (late night + PDP violation), got %d", len(violations))
	}
}
