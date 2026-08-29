package rules

type RuleEngine struct{}

func NewRuleEngine() *RuleEngine {
	return &RuleEngine{}
}

func (e *RuleEngine) AuditContract(input ContractAuditInput) ContractAuditResult {
	if !input.IsOJKLicensed {
		return ContractAuditResult{
			RiskLevel:          RiskIllegalEntity,
			SummaryExplanation: "Entitas ini tidak terdaftar dalam database izin resmi Otoritas Jasa Keuangan (OJK). Segala aktivitas pinjaman berstatus ILEGAL dan berisiko tinggi.",
			Violations: []ViolationResult{
				{
					RuleCode:         "OJK-ILLEGAL-ENTITY",
					StatutoryArticle: "UU Pengembangan dan Penguatan Sektor Keuangan (UU P2SK) & Regulasi OJK",
					ViolationType:    "Penyelenggara Pinjaman Online Tanpa Izin Resmi (Ilegal)",
					ClauseSnippet:    input.PlatformName,
					LegalExplanation: "Penyelenggara tidak memiliki izin usaha dari OJK sehingga tidak tunduk pada batas bunga dan perlindungan konsumen.",
					Severity:         SeverityCritical,
				},
			},
		}
	}

	var allViolations []ViolationResult
	allViolations = append(allViolations, evaluatePOJKRules(input)...)
	allViolations = append(allViolations, evaluateAFPIRules(input)...)

	risk := RiskLow
	summary := "Parameter kontrak memenuhi ketentuan bunga dan izin wajar sesuai POJK No. 10/2022."

	hasCritical := false
	hasWarning := false
	for _, v := range allViolations {
		if v.Severity == SeverityCritical {
			hasCritical = true
		}
		if v.Severity == SeverityWarning {
			hasWarning = true
		}
	}

	if hasCritical {
		risk = RiskDanger
		summary = "Ditemukan klausul kritis yang melanggar ketentuan OJK/AFPI. Sangat tidak disarankan menandatangani kontrak ini."
	} else if hasWarning {
		risk = RiskMedium
		summary = "Terdapat indikasi biaya atau denda di atas batas rekomendasi. Harap teliti sebelum menyetujui."
	}

	return ContractAuditResult{
		RiskLevel:          risk,
		SummaryExplanation: summary,
		Violations:         allViolations,
	}
}

func (e *RuleEngine) AuditEvidenceItem(input EvidenceItemInput) []ViolationResult {
	var violations []ViolationResult
	violations = append(violations, evaluatePDPRules(input)...)
	violations = append(violations, evaluateKUHPRules(input)...)
	return violations
}
