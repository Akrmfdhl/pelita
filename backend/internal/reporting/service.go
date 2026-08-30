package reporting

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/pelita/backend/internal/llm"
)

type Service struct {
	llmClient *llm.Client
}

func NewService(llmClient *llm.Client) *Service {
	return &Service{
		llmClient: llmClient,
	}
}

func (s *Service) HandleChat(ctx context.Context, userID string, req ChatMessageRequest) (*ChatMessageResponse, error) {
	var history []map[string]string
	for _, m := range req.ConversationHistory {
		history = append(history, map[string]string{
			"role":    m.Role,
			"content": m.Content,
		})
	}

	retrievedCitations := []string{
		"POJK No. 10/POJK.05/2022",
		"POJK No. 22 Tahun 2023 Pasal 62",
		"SEOJK No. 19/SEOJK.05/2023",
		"UU No. 27/2022 tentang PDP Pasal 65",
		"KUHP Pasal 368 & 369",
	}

	var mediaCtx *llm.ExtractedMediaContext
	if req.AttachmentBase64 != "" && s.llmClient != nil {
		ctxExt, err := s.llmClient.ExtractMediaContext(ctx, req.AttachmentBase64, req.AttachmentType, req.AttachmentName)
		if err == nil && ctxExt != nil {
			mediaCtx = ctxExt
		}
	}

	reply := ""
	if s.llmClient != nil {
		r, citations, err := s.llmClient.ChatWithRAG(ctx, req.Message, history, retrievedCitations, mediaCtx)
		if err == nil && r != "" {
			reply = r
			retrievedCitations = citations
		}
	}

	if reply == "" {
		reply = "Berdasarkan regulasi POJK No. 22/2023 Pasal 62 dan UU PDP No. 27/2022, penagihan dilarang menggunakan ancaman sebar data atau intimidasi di luar jam 08.00-20.00. Laporkan bukti kronologi ke Satgas PASTI OJK atau Patroli Siber Polri."
	}

	var dtoExtracted *ExtractedMediaContext
	if mediaCtx != nil {
		dtoExtracted = &ExtractedMediaContext{
			PlatformName:       mediaCtx.PlatformName,
			SenderPhone:        mediaCtx.SenderPhone,
			ThreatSummary:      mediaCtx.ThreatSummary,
			DetectedViolations: mediaCtx.DetectedViolations,
		}
	}

	return &ChatMessageResponse{
		Reply:            reply,
		SuggestedChannel: "ojk_satgas_pasti",
		RelevantArticles: retrievedCitations,
		ExtractedContext: dtoExtracted,
	}, nil
}

func (s *Service) GenerateDraft(ctx context.Context, userID string, req GenerateComplaintDraftRequest) (*ComplaintDraftResponse, error) {
	var channelName, guidelines, portalURL, email, wa, recipientTitle string

	victimName := req.VictimName
	if victimName == "" {
		victimName = "Pengguna Terverifikasi Pelita"
	}
	victimNIK := req.VictimNIK
	if victimNIK == "" {
		victimNIK = "3171012345678901"
	}
	victimPhone := req.VictimPhone
	if victimPhone == "" {
		victimPhone = "+6281234567890"
	}

	platformName := req.PlatformName
	if platformName == "" {
		platformName = "Penyelenggara Pinjaman Online Terindikasi Ilegal"
	}

	switch req.ChannelCode {
	case "afpi":
		channelName = "Posko Pengaduan AFPI"
		recipientTitle = "Ketua Komite Etik & Pengaduan Konsumen AFPI"
		guidelines = "1. Salin teks surat di atas.\n2. Buka portal resmi https://afpi.or.id/pengaduan atau kirimkan email ke pengaduan@afpi.or.id.\n3. Lampirkan berkas bukti tangkapan layar chat beserta dokumen kronologis PDF."
		portalURL = "https://afpi.or.id/pengaduan"
		email = "pengaduan@afpi.or.id"
		wa = "150 505"
	case "polri":
		channelName = "Sentra Pelayanan Kepolisian Terpadu (SPKT) / Siber Polri"
		recipientTitle = "Direktur Tindak Pidana Siber Bareskrim Polri / Kepala SPKT"
		guidelines = "1. Salin draf laporan polisi ini.\n2. Ajukan laporan online via https://patrolisiber.id atau cetak berkas ini dan bawa ke SPKT Polda/Polres terdekat.\n3. Sertakan bukti percakapan ancaman kekerasan/pemerasan dan nomor rekening penagih."
		portalURL = "https://patrolisiber.id"
		email = "lapor@patrolisiber.id"
		wa = "Call Center 110"
	default:
		channelName = "Satgas PASTI & Kontak OJK 157"
		recipientTitle = "Kepala Satgas Pemberantasan Aktivitas Keuangan Ilegal (Satgas PASTI) OJK"
		guidelines = "1. Salin seluruh isi draf surat pengaduan ini.\n2. Kirimkan melalui email konsumen@ojk.go.id atau portal https://kontak157.ojk.go.id.\n3. Hubungi hotline WhatsApp resmi OJK di 081-157-157-157 untuk konfirmasi penerimaan nomor tiket aduan."
		portalURL = "https://kontak157.ojk.go.id"
		email = "konsumen@ojk.go.id"
		wa = "+6281157157157"
	}

	dateStr := time.Now().Format("02 January 2006")
	refNo := fmt.Sprintf("PLT-%s-%d", uuid.New().String()[:6], time.Now().Year())

	violationDetail := req.ViolationSummary
	if violationDetail == "" {
		violationDetail = "Ancaman intimidasi verbal, penyebaran data pribadi ke pihak ketiga, serta pengenaan denda/bunga harian di luar regulasi OJK."
	}

	letterBody := fmt.Sprintf(`SURAT PENGADUAN KONSUMEN & LAPORAN TINDAK INTIMIDASI DIGITAL
Nomor Registrasi Berkas: %s
Tanggal Pelaporan       : %s

Kepada Yth.
%s
%s
Di Tempat

Perihal: Laporan Pelanggaran Praktik Penagihan Kasar, Bunga Predator, dan Ancaman Penyebaran Data Pribadi
Pihak Terlapor: %s

Dengan hormat,
Saya yang bertanda tangan di bawah ini:
Nama Lengkap      : %s
Nomor Induk (NIK) : %s
Nomor Kontak/WA   : %s
Status Pelapor    : Korban Konsumen Terdaftar Platform Pelita

Dengan ini menyampaikan pengaduan resmi dan permohonan penindakan hukum/sanksi administratif sehubungan dengan pelanggaran berat terhadap peraturan perundang-undangan Republik Indonesia yang dilakukan oleh pihak penagih (%s):

URAIAN BUKTI PELANGGARAN HUKUM:
1. Pelanggaran Jam Penagihan & Intimidasi (POJK No. 22 Tahun 2023 Pasal 62):
   Pihak penagih melakukan teror kontak secara berulang-ulang di luar batas jam operasional resmi (08.00 - 20.00 waktu setempat) dengan kata-kata kasar dan ancaman psikologis.

2. Dugaan Tindak Pidana Kejahatan Data Pribadi (UU PDP No. 27/2022 Pasal 65 ayat 1 & 3):
   Pihak penagih mengancam akan menyebarkan foto KTP dan data pribadi saya ke seluruh kontak telepon di luar kontak darurat resmi, serta mempermalukan nama baik saya di media sosial.

3. Fakta Khusus & Ringkasan Kejadian:
   %s

4. Pengenaan Suku Bunga & Biaya Manfaat Ekonomi Melampaui Batas (SEOJK No. 19/SEOJK.05/2023):
   Penerapan suku bunga dan akumulasi denda harian yang dibebankan tidak transparan dan melampaui ketentuan batas maksimum legal OJK.

LAMPIRAN DOKUMEN ALAT BUKTI:
- Berkas Rekonstruksi Kronologi Digital (Dihasilkan melalui Sistem Audit Pelita)
- Tangkapan layar percakapan chat WhatsApp / SMS penagih berisi ancaman
- Rekaman log waktu panggilan telepon teror masuk
- Bukti perjanjian pinjaman awal

Demikian surat pengaduan resmi ini saya sampaikan dengan sebenar-benarnya dan didasari oleh itikad baik untuk memperoleh perlindungan hukum. Atas perhatian dan tindak lanjut dari pihak %s, saya ucapkan terima kasih.


Hormat Saya,


(%s)
Pelapor / Konsumen Terlindungi`, refNo, dateStr, recipientTitle, channelName, platformName, victimName, victimNIK, victimPhone, platformName, violationDetail, channelName, victimName)

	return &ComplaintDraftResponse{
		ID:                   uuid.New().String(),
		CaseID:               req.CaseID,
		ChannelCode:          req.ChannelCode,
		ChannelName:          channelName,
		DraftTitle:           "Surat Pengaduan Resmi - " + channelName,
		GeneratedLetterBody:  letterBody,
		SubmissionGuidelines: guidelines,
		OfficialPortalURL:    portalURL,
		OfficialEmail:        email,
		OfficialWhatsApp:     wa,
	}, nil
}
