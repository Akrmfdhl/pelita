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
	}

	reply := ""
	if s.llmClient != nil {
		r, citations, err := s.llmClient.ChatWithRAG(ctx, req.Message, history, retrievedCitations)
		if err == nil && r != "" {
			reply = r
			retrievedCitations = citations
		}
	}

	if reply == "" {
		reply = "Berdasarkan regulasi POJK No. 22/2023 Pasal 62, penagihan hanya diperkenankan pada hari Senin - Sabtu pukul 08.00 - 20.00 waktu setempat, dilarang menggunakan intimidasi verbal atau ancaman, dan dilarang menyebarkan data pribadi kepada pihak ketiga selain kontak darurat resmi."
	}

	return &ChatMessageResponse{
		Reply:            reply,
		SuggestedChannel: "ojk_satgas_pasti",
		RelevantArticles: retrievedCitations,
	}, nil
}

func (s *Service) GenerateDraft(ctx context.Context, userID string, req GenerateComplaintDraftRequest) (*ComplaintDraftResponse, error) {
	var channelName, guidelines, portalURL, email, wa string

	switch req.ChannelCode {
	case "afpi":
		channelName = "Posko Pengaduan AFPI"
		guidelines = "Kirimkan laporan melalui form pengaduan resmi AFPI atau email pengaduan@afpi.or.id."
		portalURL = "https://afpi.or.id/pengaduan"
		email = "pengaduan@afpi.or.id"
		wa = "+6281119550000"
	case "polri":
		channelName = "Sentra Pelayanan Kepolisian Terpadu (SPKT) / Siber Polri"
		guidelines = "Bawa berkas kronologi cetak ke SPKT Polda/Polres terdekat atau daftarkan laporan di portal Patroli Siber Polri."
		portalURL = "https://patrolisiber.id"
		email = "lapor@patrolisiber.id"
		wa = "110"
	default:
		channelName = "Satgas PASTI & Konsumen OJK"
		guidelines = "Kirimkan draf surat ini beserta lampiran berkas kronologis PDF ke email konsumen@ojk.go.id atau melalui WhatsApp resmi Kontak OJK 157 (081-157-157-157)."
		portalURL = "https://kontak157.ojk.go.id"
		email = "konsumen@ojk.go.id"
		wa = "+6281157157157"
	}

	dateStr := time.Now().Format("02 January 2006")
	letterBody := fmt.Sprintf(`SURAT PENGADUAN KONSUMEN & LAPORAN TINDAK INTIMIDASI DIGITAL
Nomor Rujukan Kasus: PLT-%s
Tanggal: %s

Kepada Yth.
Pimpinan %s
Di Tempat

Perihal: Pengaduan Pelanggaran Penagihan Kasar, Bunga Ilegal, dan Ancaman Penyebaran Data Pribadi

Dengan hormat,
Saya yang bertanda tangan di bawah ini:
Nama Lengkap    : %s
Nomor Induk (NIK): %s
Nomor Telepon   : %s

Dengan ini menyampaikan laporan resmi sehubungan dengan adanya tindakan penagihan yang melanggar hukum dan peraturan perundang-undangan Republik Indonesia (POJK No. 10/POJK.05/2022, POJK No. 22/2023, serta UU No. 27/2022 tentang Pelindungan Data Pribadi).

Kronologi & Fakta Kejadian:
1. Pihak penagih melakukan intimidasi verbal dan pengancaman di luar batas jam operasional resmi (Pasal 62 POJK No. 22/2023).
2. Pihak penagih mengancam akan menyebarluaskan data pribadi saya secara melawan hukum (Pasal 65 UU PDP No. 27/2022).
3. Pengenaan bunga dan denda harian melampaui ketentuan batas maksimum manfaat ekonomi (SEOJK No. 19/SEOJK.05/2023).
4. Bersama surat ini, saya lampirkan Berkas Bukti Kronologis Digital (PDF terverifikasi) beserta tangkapan layar percakapan.

Demikian laporan pengaduan ini saya sampaikan dengan sebenar-benarnya agar dapat ditindaklanjuti sesuai hukum yang berlaku.

Hormat saya,

%s`, uuid.New().String()[:8], dateStr, channelName, req.VictimName, req.VictimNIK, req.VictimPhone, req.VictimName)

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
