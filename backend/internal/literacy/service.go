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

func (s *Service) ListQuizzes(ctx context.Context) ([]QuizQuestionDTO, error) {
	return []QuizQuestionDTO{
		{
			ID:           "quiz-1",
			ModuleID:     "mod-2",
			QuestionText: "Manakah dari izin akses smartphone berikut yang secara hukum DILARANG untuk diminta oleh aplikasi pinjaman online berizin OJK?",
			Options: []QuizOptionDTO{
				{
					Text:        "Izin akses seluruh daftar kontak telepon dan galeri foto",
					IsCorrect:   true,
					Explanation: "Sesuai ketentuan POJK No. 10/2022 dan Surat Edaran AFPI, penyelenggara hanya diperbolehkan mengakses fitur CAMDOG (Camera, Microphone, Location). Akses ke daftar kontak dan galeri dilarang keras.",
				},
				{
					Text:        "Izin akses kamera (untuk verifikasi e-KTP & wajah)",
					IsCorrect:   false,
					Explanation: "Akses kamera diperbolehkan OJK khusus untuk keperluan e-KYC (verifikasi e-KTP dan liveness test).",
				},
				{
					Text:        "Izin akses mikrofon (untuk verifikasi panggilan suara)",
					IsCorrect:   false,
					Explanation: "Akses mikrofon diperbolehkan OJK dalam batasan verifikasi suara.",
				},
				{
					Text:        "Izin akses lokasi perangkat saat aplikasi digunakan",
					IsCorrect:   false,
					Explanation: "Akses lokasi perangkat (Location) diizinkan OJK untuk deteksi fraud domisili peminjam.",
				},
			},
		},
		{
			ID:           "quiz-2",
			ModuleID:     "mod-1",
			QuestionText: "Berapakah batas maksimum suku bunga harian yang ditetapkan oleh OJK untuk pinjaman online konsumtif jangka pendek di tahun 2024 - 2026?",
			Options: []QuizOptionDTO{
				{
					Text:        "0.8% per hari",
					IsCorrect:   false,
					Explanation: "0.8% per hari adalah batas lama AFPI sebelum 2023 yang sudah tidak berlaku.",
				},
				{
					Text:        "0.3% per hari (berangsur turun menjadi 0.1% per hari)",
					IsCorrect:   true,
					Explanation: "Berdasarkan SEOJK No. 19/SEOJK.05/2023, batas maksimum manfaat ekonomi adalah 0.3% per hari (2024) dan turun bertahap menjadi 0.1% per hari (2026).",
				},
				{
					Text:        "1.5% per hari",
					IsCorrect:   false,
					Explanation: "Bunga 1.5% per hari merupakan ciri khas pinjol ilegal dan bentuk pemerasan finansial.",
				},
				{
					Text:        "Bebas ditentukan tanpa batas oleh aplikasi",
					IsCorrect:   false,
					Explanation: "Seluruh pinjaman berizin OJK wajib tunduk pada capping suku bunga maksimum.",
				},
			},
		},
		{
			ID:           "quiz-3",
			ModuleID:     "mod-3",
			QuestionText: "Jam berapakah batas waktu resmi penagihan oleh debt collector menurut POJK No. 22/2023?",
			Options: []QuizOptionDTO{
				{
					Text:        "Bebas 24 jam selama debitur belum membayar",
					IsCorrect:   false,
					Explanation: "Penagihan 24 jam melanggar hukum dan merupakan bentuk tindak pidana intimidasi.",
				},
				{
					Text:        "Pukul 08:00 hingga pukul 20:00 waktu setempat",
					IsCorrect:   true,
					Explanation: "Pasal 62 POJK No. 22/2023 mengatur penagihan hanya boleh dilakukan pukul 08:00 - 20:00 waktu setempat.",
				},
				{
					Text:        "Pukul 06:00 hingga pukul 22:00 waktu setempat",
					IsCorrect:   false,
					Explanation: "Jam penagihan setelah pukul 20:00 dilarang oleh regulasi perlindungan konsumen OJK.",
				},
				{
					Text:        "Hanya pada akhir pekan saja",
					IsCorrect:   false,
					Explanation: "Penagihan dapat dilakukan pada hari kerja Senin - Sabtu dalam batas jam 08:00 - 20:00.",
				},
			},
		},
	}, nil
}

func (s *Service) SubmitQuizAnswer(ctx context.Context, userID string, req SubmitQuizAnswerRequest) (*SubmitQuizAnswerResponse, error) {
	quizzes, _ := s.ListQuizzes(ctx)
	for _, q := range quizzes {
		if q.ID == req.QuizID {
			if req.SelectedOptionIndex >= 0 && req.SelectedOptionIndex < len(q.Options) {
				opt := q.Options[req.SelectedOptionIndex]
				return &SubmitQuizAnswerResponse{
					IsCorrect:   opt.IsCorrect,
					Explanation: opt.Explanation,
				}, nil
			}
		}
	}

	return &SubmitQuizAnswerResponse{
		IsCorrect:   false,
		Explanation: "Jawaban dievaluasi berdasarkan ketentuan regulasi POJK & UU PDP.",
	}, nil
}
