package rules

func evaluateAFPIRules(input ContractAuditInput) []ViolationResult {
	var violations []ViolationResult

	if input.LateFeeDailyRate > 0.003 {
		violations = append(violations, ViolationResult{
			RuleCode:         "AFPI-2024-LATE-FEE-CAP",
			StatutoryArticle: "Pedoman Perilaku Layanan Pinjam Meminjam Uang Berbasis Teknologi Informasi AFPI",
			ViolationType:    "Denda Keterlambatan Harian Melebihi Batas Wajar",
			ClauseSnippet:    "Denda harian tercantum: di atas batas maksimum AFPI",
			LegalExplanation: "Akumulasi biaya denda keterlambatan dilarang melebihi nilai pokok pinjaman.",
			Severity:         SeverityWarning,
		})
	}

	return violations
}
