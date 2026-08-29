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
			Category:                "Batas Suku Bunga POJK",
			TargetViolationCategory: "interest_rate",
			ReadingContent:          "Otoritas Jasa Keuangan (OJK) melalui SEOJK No. 19/SEOJK.05/2023 secara ketat membatasi total manfaat ekonomi (suku bunga + biaya admin harian) untuk pinjaman konsumtif jangka pendek maksimal 0.3% per hari pada tahun 2024 dan bertahap turun menjadi 0.1% per hari pada 2026.\n\nPinjaman online ilegal kerap membebankan bunga 1% hingga 2% per hari ditambah biaya administrasi siluman yang dipotong di awal pencairan hingga 30%-40%. Setiap pengenaan bunga di atas batas resmi berstatus non-compliant dan dapat digugat serta dilaporkan ke Satgas PASTI.",
			BriefContent:            "OJK membatasi bunga harian pinjol konsumtif maksimal 0.3% per hari (tahun 2024) dan akan turun menjadi 0.1% per hari. Pinjol yang menetapkan bunga di atas angka ini berstatus melanggar ketentuan atau ilegal.",
			ReadingTimeMinutes:      2,
			Quiz: QuizDataDTO{
				QuestionText:     "Berapakah batas maksimum suku bunga harian resmi yang ditetapkan oleh OJK untuk pinjaman online konsumtif di tahun 2024 - 2026?",
				CorrectAnswerKey: "B",
				Explanation:      "Berdasarkan SEOJK No. 19/SEOJK.05/2023, batas maksimum manfaat ekonomi adalah 0.3% per hari (2024) dan turun bertahap menjadi 0.1% per hari (2026). Suku bunga di atas 0.3% per hari merupakan bentuk pelanggaran hukum.",
				Options: []QuizOptionDTO{
					{Key: "A", Text: "0.8% per hari tanpa batas", IsCorrect: false, Explanation: "0.8% per hari adalah plafon lama AFPI sebelum 2023 yang kini sudah diturunkan oleh OJK."},
					{Key: "B", Text: "Maksimal 0.3% per hari (turun bertahap ke 0.1%/hari)", IsCorrect: true, Explanation: "Tepat. SEOJK No. 19/2023 membatasi bunga harian maksimal 0.3% per hari pada 2024 dan 0.1% pada 2026."},
					{Key: "C", Text: "1.5% per hari sesuai perjanjian", IsCorrect: false, Explanation: "Bunga 1.5% per hari adalah ciri khas rentenir dan pinjol ilegal yang dilarang keras."},
					{Key: "D", Text: "Bebas ditentukan sepihak oleh aplikasi", IsCorrect: false, Explanation: "Seluruh fintech lending berizin OJK wajib patuh pada batas plafon bunga maksimum."},
				},
			},
		},
		{
			ID:                      "mod-2",
			Slug:                    "hak-data-pribadi",
			Title:                   "Perlindungan Data Pribadi: Batasan Akses Izin CAMDOG",
			Category:                "Perlindungan Data Pribadi (UU PDP)",
			TargetViolationCategory: "data_privacy",
			ReadingContent:          "Berdasarkan POJK No. 10/POJK.05/2022 dan UU Perlindungan Data Pribadi (UU PDP No. 27/2022), aplikasi pinjaman online berizin OJK HANYA diizinkan mengakses 3 fitur perangkat smartphone yang dikenal dengan singkatan CAMDOG:\n1. Camera (Kamera): Verifikasi identitas e-KTP dan foto selfie.\n2. Microphone (Mikrofon): Verifikasi suara saat proses KYC.\n3. Location (Lokasi): Mendeteksi lokasi saat pengajuan untuk mitigasi risiko fraud.\n\nAplikasi yang meminta akses ke Kontak Telepon, Galeri Foto/Video, SMS, atau Media Penyimpanan adalah ILEGAL dan melanggar Pasal 65 UU PDP dengan ancaman pidana penjara hingga 5 tahun.",
			BriefContent:            "Sesuai regulasi OJK dan UU PDP No. 27/2022, aplikasi pinjaman online legal HANYA boleh meminta izin Kamera, Mikrofon, dan Lokasi (CAMDOG). Permintaan izin kontak, SMS, atau penyimpanan galeri adalah pelanggaran berat.",
			ReadingTimeMinutes:      2,
			Quiz: QuizDataDTO{
				QuestionText:     "Manakah izin akses smartphone berikut yang secara hukum DILARANG KERAS untuk diminta oleh pinjol berizin OJK?",
				CorrectAnswerKey: "A",
				Explanation:      "Sesuai prinsip CAMDOG OJK dan UU PDP No. 27/2022, aplikasi dilarang mengakses daftar kontak dan galeri foto pribadi pengguna.",
				Options: []QuizOptionDTO{
					{Key: "A", Text: "Seluruh daftar kontak telepon dan galeri foto/video", IsCorrect: true, Explanation: "Akses kontak dan galeri dilarang keras oleh OJK untuk mencegah intimidasi dan doxing."},
					{Key: "B", Text: "Kamera untuk verifikasi e-KTP saat pendaftaran", IsCorrect: false, Explanation: "Kamera diizinkan khusus untuk verifikasi identitas e-KYC peminjam."},
					{Key: "C", Text: "Mikrofon untuk konfirmasi panggilan suara", IsCorrect: false, Explanation: "Mikrofon diizinkan dalam koridor verifikasi suara pengajuan."},
					{Key: "D", Text: "Lokasi GPS saat aplikasi digunakan", IsCorrect: false, Explanation: "Lokasi diizinkan untuk pencegahan penipuan domisili pengajuan."},
				},
			},
		},
		{
			ID:                      "mod-3",
			Slug:                    "etika-penagihan",
			Title:                   "Etika Penagihan: Jam Operasional & Batasan Teror Debt Collector",
			Category:                "Etika Penagihan POJK 22/2023",
			TargetViolationCategory: "harassment",
			ReadingContent:          "Pasal 62 POJK No. 22 Tahun 2023 mengatur tata cara penagihan yang wajib dipatuhi oleh Pelaku Usaha Jasa Keuangan (PUJK) dan pihak ketiga (Debt Collector):\n1. Jam Operasional: Penagihan hanya boleh dilakukan pada hari Senin sampai dengan Sabtu, di luar hari libur nasional, dari pukul 08.00 hingga pukul 20.00 waktu setempat.\n2. Larangan Ancaman: Dilarang menggunakan ancaman kekerasan, kata-kata kasar, mencemarkan nama baik, atau mempermalukan debitur.\n3. Larangan Teror Pihak Ketiga: Dilarang menghubungi nomor telepon keluarga, atasan kantor, atau teman di luar nomor kontak darurat resmi yang didaftarkan debitur.",
			BriefContent:            "Penagihan dilarang dilakukan di luar pukul 08.00 hingga 20.00 waktu setempat, dilarang menggunakan kekerasan, ancaman, mempermalukan debitur, atau menghubungi pihak ketiga yang bukan kontak darurat.",
			ReadingTimeMinutes:      2,
			Quiz: QuizDataDTO{
				QuestionText:     "Jam berapakah batas waktu resmi penagihan debt collector menurut ketentuan Pasal 62 POJK No. 22/2023?",
				CorrectAnswerKey: "C",
				Explanation:      "Pasal 62 POJK No. 22/2023 secara eksplisit menetapkan penagihan hanya diperkenankan pukul 08:00 hingga 20:00 waktu setempat pada hari Senin - Sabtu.",
				Options: []QuizOptionDTO{
					{Key: "A", Text: "Bebas 24 jam sampai hutang lunas", IsCorrect: false, Explanation: "Penagihan 24 jam adalah tindakan teror ilegal yang dapat dipidanakan."},
					{Key: "B", Text: "Pukul 06:00 hingga pukul 23:00 malam", IsCorrect: false, Explanation: "Penagihan malam hari di atas jam 20:00 dilarang oleh regulasi OJK."},
					{Key: "C", Text: "Pukul 08:00 hingga pukul 20:00 waktu setempat", IsCorrect: true, Explanation: "Tepat. Jam resmi penagihan OJK adalah pukul 08.00 - 20.00 waktu setempat."},
					{Key: "D", Text: "Hanya pada akhir pekan dan hari libur", IsCorrect: false, Explanation: "Penagihan pada hari libur nasional dilarang oleh OJK."},
				},
			},
		},
	}, nil
}

func (s *Service) ListQuizzes(ctx context.Context) ([]QuizQuestionDTO, error) {
	modules, _ := s.ListModules(ctx)
	var quizzes []QuizQuestionDTO
	for _, m := range modules {
		quizzes = append(quizzes, QuizQuestionDTO{
			ID:           "quiz-" + m.ID,
			ModuleID:     m.ID,
			QuestionText: m.Quiz.QuestionText,
			Options:      m.Quiz.Options,
		})
	}
	return quizzes, nil
}

func (s *Service) SubmitQuizAnswer(ctx context.Context, userID string, req SubmitQuizAnswerRequest) (*SubmitQuizAnswerResponse, error) {
	modules, _ := s.ListModules(ctx)
	for _, m := range modules {
		if "quiz-"+m.ID == req.QuizID || m.ID == req.QuizID {
			if req.SelectedOptionIndex >= 0 && req.SelectedOptionIndex < len(m.Quiz.Options) {
				opt := m.Quiz.Options[req.SelectedOptionIndex]
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
