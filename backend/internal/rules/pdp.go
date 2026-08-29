package rules

import "strings"

func evaluatePDPRules(input EvidenceItemInput) []ViolationResult {
	var violations []ViolationResult
	lowerText := strings.ToLower(input.MessageText)

	if strings.Contains(lowerText, "sebar data") || strings.Contains(lowerText, "sebar foto") || strings.Contains(lowerText, "kontak darurat") || strings.Contains(lowerText, "grup wa") {
		violations = append(violations, ViolationResult{
			RuleCode:         "UU-PDP-27-2022-PASAL-65",
			StatutoryArticle: "UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi Pasal 65 ayat (1) dan ayat (3)",
			ViolationType:    "Ancaman Penyebaran dan Penggunaan Data Pribadi Secara Melawan Hukum",
			ClauseSnippet:    input.MessageText,
			LegalExplanation: "Setiap orang dilarang secara melawan hukum memperoleh, menggunakan, atau menyebarluaskan Data Pribadi yang bukan miliknya.",
			Severity:         SeverityCritical,
		})
	}

	return violations
}
