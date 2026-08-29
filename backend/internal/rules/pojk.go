package rules

import "strings"

const MaxDailyInterestRatePOJK = 0.003
const MaxProductiveInterestRatePOJK = 0.001

func evaluatePOJKRules(input ContractAuditInput) []ViolationResult {
	var violations []ViolationResult

	if input.DailyInterestRate > MaxDailyInterestRatePOJK {
		violations = append(violations, ViolationResult{
			RuleCode:         "POJK-10-2022-INTEREST-CAP",
			StatutoryArticle: "POJK No. 10/POJK.05/2022 & Surat Edaran OJK No. 19/SEOJK.05/2023",
			ViolationType:    "Bunga Melebihi Batas Maksimum Regulasi",
			ClauseSnippet:    "Bunga harian tercantum: di atas batas ketentuan 0.3% per hari",
			LegalExplanation: "Penyelenggara mengenakan suku bunga harian di atas batas maksimal yang ditetapkan OJK.",
			Severity:         SeverityCritical,
		})
	}

	for _, perm := range input.PermissionsRequested {
		upper := strings.ToUpper(strings.TrimSpace(perm))
		if upper == "CONTACTS" || upper == "READ_CONTACTS" || upper == "KONTAK" {
			violations = append(violations, ViolationResult{
				RuleCode:         "POJK-10-2022-ILLEGAL-CONTACTS",
				StatutoryArticle: "POJK No. 10/POJK.05/2022 Pasal 52",
				ViolationType:    "Akses Izin Kontak Ilegal",
				ClauseSnippet:    "Aplikasi meminta izin membaca daftar kontak pengguna",
				LegalExplanation: "Penyelenggara dilarang meminta atau mengakses daftar kontak telepon seluler pengguna.",
				Severity:         SeverityCritical,
			})
		}
		if upper == "GALLERY" || upper == "STORAGE" || upper == "READ_EXTERNAL_STORAGE" || upper == "PENYIMPANAN" {
			violations = append(violations, ViolationResult{
				RuleCode:         "POJK-10-2022-ILLEGAL-STORAGE",
				StatutoryArticle: "POJK No. 10/POJK.05/2022 Pasal 52",
				ViolationType:    "Akses Izin Galeri / Penyimpanan Ilegal",
				ClauseSnippet:    "Aplikasi meminta izin akses berkas galeri dan media penyimpanan",
				LegalExplanation: "Penyelenggara hanya diperbolehkan mengakses Kamera, Mikrofon, dan Lokasi (CAMDOG).",
				Severity:         SeverityCritical,
			})
		}
	}

	return violations
}
