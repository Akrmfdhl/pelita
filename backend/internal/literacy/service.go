package literacy

import (
	"context"
)

type Service struct{}

func NewService() *Service {
	return &Service{}
}

func (s *Service) ListModules(ctx context.Context) ([]LiteracyModuleDTO, error) {
	return []LiteracyModuleDTO{
		{
			ID:                      "mod-1",
			Slug:                    "batas-bunga-pojk",
			Title:                   "Mengenali Batas Maksimum Bunga & Denda Menurut POJK",
			TargetViolationCategory: "interest_rate",
			BriefContent:           "OJK membatasi bunga harian pinjol konsumtif maksimal 0.3% per hari (tahun 2024) dan akan turun menjadi 0.1% per hari. Pinjol yang menetapkan bunga di atas angka ini berstatus melanggar ketentuan atau ilegal.",
			ReadingTimeMinutes:     2,
		},
		{
			ID:                      "mod-2",
			Slug:                    "hak-data-pribadi",
			Title:                   "Perlindungan Data Pribadi: Larangan Akses Kontak & Galeri (CAMDOG)",
			TargetViolationCategory: "data_privacy",
			BriefContent:           "Sesuai regulasi OJK dan UU PDP No. 27/2022, aplikasi pinjaman online legal HANYA boleh meminta izin Kamera, Mikrofon, dan Lokasi (CAMDOG). Permintaan izin kontak, SMS, atau penyimpanan galeri adalah pelanggaran berat.",
			ReadingTimeMinutes:     2,
		},
		{
			ID:                      "mod-3",
			Slug:                    "etika-penagihan",
			Title:                   "Etika Penagihan: Jam Operasional & Batasan Teror Debt Collector",
			TargetViolationCategory: "harassment",
			BriefContent:           "Penagihan dilarang dilakukan di luar pukul 08.00 hingga 20.00 waktu setempat, dilarang menggunakan kekerasan, ancaman, mempermalukan debitur, atau menghubungi pihak ketiga yang bukan kontak darurat.",
			ReadingTimeMinutes:     2,
		},
	}, nil
}

func (s *Service) SubmitQuizAnswer(ctx context.Context, userID string, req SubmitQuizAnswerRequest) (*SubmitQuizAnswerResponse, error) {
	isCorrect := req.SelectedOptionIndex == 0
	explanation := "Benar! Menurut POJK dan UU PDP, aplikasi pinjol legal dilarang mengakses kontak dan galeri peminjam."
	if !isCorrect {
		explanation = "Kurang tepat. Aplikasi pinjol berizin OJK hanya diizinkan mengakses Kamera, Mikrofon, dan Lokasi (CAMDOG)."
	}

	return &SubmitQuizAnswerResponse{
		IsCorrect:   isCorrect,
		Explanation: explanation,
	}, nil
}
