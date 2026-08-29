package reporting

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
)

type Service struct{}

func NewService() *Service {
	return &Service{}
}

func (s *Service) HandleChat(ctx context.Context, userID string, req ChatMessageRequest) (*ChatMessageResponse, error) {
	lower := strings.ToLower(req.Message)

	suggestedChannel := "ojk"
	articles := []string{"POJK No. 10/POJK.05/2022", "POJK No. 22/2023 Pasal 62"}
	reply := "Berdasarkan permasalahan Anda, kami sarankan untuk mengumpulkan bukti pesan penagihan dan menyiapkan laporan ke portal resmi OJK Kontak 157 atau Posko Pengaduan AFPI. Penagih dilarang melakukan intimidasi atau menagih di luar jam operasional resmi."

	if strings.Contains(lower, "sebar data") || strings.Contains(lower, "kontak darurat") {
		suggestedChannel = "polri"
		articles = append(articles, "UU No. 27/2022 tentang PDP Pasal 65", "Pasal 27B UU ITE")
		reply = "Tindakan menyebarkan data pribadi atau foto Anda tanpa izin adalah tindak pidana menurut UU Perlindungan Data Pribadi Pasal 65 dan UU ITE Pasal 27B. Kami sarankan membuat draf surat aduan ke Bareskrim Polri (Patroli Siber) serta tembusan ke Satgas PASTI OJK."
	}

	return &ChatMessageResponse{
		Reply:            reply,
		SuggestedChannel: suggestedChannel,
		RelevantArticles: articles,
	}, nil
}

func (s *Service) GenerateDraft(ctx context.Context, userID string, req GenerateComplaintDraftRequest) (*ComplaintDraftResponse, error) {
	channelName := "Satgas PASTI & Konsumen OJK"
	guidelines := "Kirimkan draf surat ini beserta lampiran berkas kronologis PDF ke email konsumen@ojk.go.id atau melalui WhatsApp resmi Kontak OJK 157 (081-157-157-157)."
	portalURL := "https://kontak157.ojk.go.id"
	email := "konsumen@ojk.go.id"
	wa := "+6281157157157"

	if req.ChannelCode == "afpi" {
		channelName = "Posko Pengaduan AFPI"
		guidelines = "Kirimkan laporan melalui form pengaduan resmi AFPI atau email pengaduan@afpi.or.id."
		portalURL = "https://afpi.or.id/pengaduan"
		email = "pengaduan@afpi.or.id"
		wa = "+6281119550000"
	} else if req.ChannelCode == "polri" {
		channelName = "Sentra Pelayanan Kepolisian Terpadu (SPKT) / Siber Polri"
		guidelines = "Bawa berkas kronologi cetak ke SPKT Polda/Polres terdekat atau daftarkan laporan di portal Patroli Siber Polri."
		portalURL = "https://patrolisiber.id"
		email = "lapor@patrolisiber.id"
		wa = "110"
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
1. Pihak penagih melakukan intimidasi verbal dan pengancaman di luar batas jam operasional resmi.
2. Pihak penagih mengancam akan menyebarluaskan data pribadi saya secara melawan hukum.
3. Bersama surat ini, saya lampirkan Berkas Bukti Kronologis Digital (PDF terverifikasi) beserta tangkapan layar percakapan.

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
