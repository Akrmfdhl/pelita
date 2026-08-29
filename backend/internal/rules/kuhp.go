package rules

import "strings"

func evaluateKUHPRules(input EvidenceItemInput) []ViolationResult {
	var violations []ViolationResult
	lowerText := strings.ToLower(input.MessageText)

	if strings.Contains(lowerText, "mati") || strings.Contains(lowerText, "bunuh") || strings.Contains(lowerText, "hancur") || strings.Contains(lowerText, "didatangi") || strings.Contains(lowerText, "habisi") {
		violations = append(violations, ViolationResult{
			RuleCode:         "KUHP-PASAL-368-PEMERASAN",
			StatutoryArticle: "Pasal 368 & Pasal 369 KUHP / Pasal 27B UU ITE",
			ViolationType:    "Tindak Pidana Pemerasan dan Pengancaman Fisik/Psikis",
			ClauseSnippet:    input.MessageText,
			LegalExplanation: "Pengancaman kekerasan atau penistaan untuk memaksa seseorang memberikan sesuatu diancam pidana penjara.",
			Severity:         SeverityCritical,
		})
	}

	if input.MessageTimestampHour < 8 || input.MessageTimestampHour >= 20 {
		violations = append(violations, ViolationResult{
			RuleCode:         "POJK-22-2023-PASAL-62-JAM-PENAGIHAN",
			StatutoryArticle: "POJK No. 22 Tahun 2023 Pasal 62 ayat (2)",
			ViolationType:    "Penagihan di Luar Batas Jam Operasional Resmi (08.00 - 20.00)",
			ClauseSnippet:    input.MessageText,
			LegalExplanation: "Penagihan dilarang dilakukan di luar hari Senin sampai dengan Sabtu, di luar pukul 08.00 sampai dengan 20.00 waktu setempat.",
			Severity:         SeverityWarning,
		})
	}

	return violations
}
