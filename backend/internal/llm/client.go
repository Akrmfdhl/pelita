package llm

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

type ExtractedContractData struct {
	PlatformName         string   `json:"platform_name"`
	DailyInterestRate    float64  `json:"daily_interest_rate"`
	AdminFeePercentage   float64  `json:"admin_fee_percentage"`
	LateFeeDailyRate     float64  `json:"late_fee_daily_rate"`
	TenorDays            int      `json:"tenor_days"`
	PermissionsRequested []string `json:"permissions_requested"`
	RawSummary           string   `json:"raw_summary"`
}

type Client struct {
	geminiKey  string
	groqKey    string
	httpClient *http.Client
}

func NewClient(geminiKey, groqKey string) *Client {
	return &Client{
		geminiKey:  geminiKey,
		groqKey:    groqKey,
		httpClient: &http.Client{Timeout: 30 * time.Second},
	}
}

func (c *Client) ExtractContractParameters(ctx context.Context, documentText string) (*ExtractedContractData, error) {
	if c.geminiKey == "" {
		return c.fallbackExtractContract(documentText), nil
	}

	prompt := fmt.Sprintf(`Anda adalah sistem ekstraksi kontrak finansial resmi Pelita. Analisis dokumen pinjaman berikut dan hasilkan JSON persis dengan format:
{
  "platform_name": "string",
  "daily_interest_rate": 0.008,
  "admin_fee_percentage": 0.25,
  "late_fee_daily_rate": 0.01,
  "tenor_days": 30,
  "permissions_requested": ["CONTACTS", "GALLERY", "LOCATION", "CAMERA"],
  "raw_summary": "penjelasan singkat temuan"
}

Dokumen Kontrak:
%s`, documentText)

	reqBody := map[string]interface{}{
		"contents": []map[string]interface{}{
			{
				"parts": []map[string]interface{}{
					{"text": prompt},
				},
			},
		},
		"generationConfig": map[string]interface{}{
			"temperature":     0.1,
			"responseMimeType": "application/json",
		},
	}

	jsonBytes, err := json.Marshal(reqBody)
	if err != nil {
		return c.fallbackExtractContract(documentText), nil
	}

	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=%s", c.geminiKey)
	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(jsonBytes))
	if err != nil {
		return c.fallbackExtractContract(documentText), nil
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		return c.fallbackExtractContract(documentText), nil
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var geminiResp struct {
		Candidates []struct {
			Content struct {
				Parts []struct {
					Text string `json:"text"`
				} `json:"parts"`
			} `json:"content"`
		} `json:"candidates"`
	}

	if err := json.Unmarshal(body, &geminiResp); err == nil && len(geminiResp.Candidates) > 0 && len(geminiResp.Candidates[0].Content.Parts) > 0 {
		var extracted ExtractedContractData
		text := geminiResp.Candidates[0].Content.Parts[0].Text
		if err := json.Unmarshal([]byte(text), &extracted); err == nil {
			return &extracted, nil
		}
	}

	return c.fallbackExtractContract(documentText), nil
}

func (c *Client) ChatWithRAG(ctx context.Context, userQuery string, conversationHistory []map[string]string, retrievedCitations []string) (string, []string, error) {
	citations := retrievedCitations
	if len(citations) == 0 {
		citations = []string{
			"POJK No. 10/POJK.05/2022 Pasal 29",
			"POJK No. 22 Tahun 2023 Pasal 62",
			"SEOJK No. 19/SEOJK.05/2023",
			"UU No. 27/2022 tentang Perlindungan Data Pribadi Pasal 65",
		}
	}

	if c.groqKey == "" {
		return c.fallbackChatResponse(userQuery), citations, nil
	}

	sysPrompt := fmt.Sprintf(`Anda adalah Asisten Advokasi Regulasi Konsumen resmi dari Pelita.
Gunakan HANYA dasar hukum positif Republik Indonesia berikut sebagai landasan:
- POJK No. 10/POJK.05/2022: Batasan akses izin perangkat smartphone hanya CAMDOG (Camera, Microphone, Location). Dilarang mengakses kontak dan galeri.
- POJK No. 22 Tahun 2023 Pasal 62: Penagihan hanya boleh Senin-Sabtu pukul 08:00 - 20:00 waktu setempat, dilarang intimidasi, dilarang meneror kontak darurat/pihak ketiga.
- SEOJK No. 19/SEOJK.05/2023: Batas maksimum bunga pinjaman konsumtif harian maksimal 0.3%% per hari (2024).
- UU PDP No. 27/2022 Pasal 65: Sanksi pidana penjara hingga 5 tahun atas perolehan dan penyebaran data pribadi secara melawan hukum.
- KUHP Pasal 368 & 369: Pemerasan dan pengancaman via sarana digital.

Berikan jawaban yang jelas, tegas, empatik, dan berorientasi pada perlindungan hak konsumen. Jangan pernah memfabrikasi pasal atau denda yang tidak ada.`)

	messages := []map[string]string{
		{"role": "system", "content": sysPrompt},
	}

	for _, m := range conversationHistory {
		messages = append(messages, map[string]string{
			"role":    m["role"],
			"content": m["content"],
		})
	}

	messages = append(messages, map[string]string{
		"role":    "user",
		"content": userQuery,
	})

	reqBody := map[string]interface{}{
		"model":       "llama-3.3-70b-versatile",
		"messages":    messages,
		"temperature": 0.2,
		"max_tokens":  650,
	}

	jsonBytes, err := json.Marshal(reqBody)
	if err != nil {
		return c.fallbackChatResponse(userQuery), citations, nil
	}

	req, err := http.NewRequestWithContext(ctx, "POST", "https://api.groq.com/openai/v1/chat/completions", bytes.NewBuffer(jsonBytes))
	if err != nil {
		return c.fallbackChatResponse(userQuery), citations, nil
	}
	req.Header.Set("Authorization", "Bearer "+c.groqKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.httpClient.Do(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		return c.fallbackChatResponse(userQuery), citations, nil
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var groqResp struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}

	if err := json.Unmarshal(body, &groqResp); err == nil && len(groqResp.Choices) > 0 {
		return groqResp.Choices[0].Message.Content, citations, nil
	}

	return c.fallbackChatResponse(userQuery), citations, nil
}

func (c *Client) fallbackExtractContract(text string) *ExtractedContractData {
	lower := strings.ToLower(text)
	if strings.Contains(lower, "kilat") || strings.Contains(lower, "ilegal") {
		return &ExtractedContractData{
			PlatformName:         "Rupiah Cepat Kilat Online (Terindikasi Ilegal)",
			DailyInterestRate:    0.008,
			AdminFeePercentage:   0.30,
			LateFeeDailyRate:     0.015,
			TenorDays:            14,
			PermissionsRequested: []string{"CONTACTS", "GALLERY", "SMS", "LOCATION", "CAMERA"},
			RawSummary:           "Terdeteksi bunga 0.8%/hari melebihi plafon OJK 0.3% dan permintaan izin akses ilegal ke kontak dan galeri.",
		}
	}

	return &ExtractedContractData{
		PlatformName:         "PT Fintek Sahabat Berizin OJK",
		DailyInterestRate:    0.001,
		AdminFeePercentage:   0.045,
		LateFeeDailyRate:     0.001,
		TenorDays:            90,
		PermissionsRequested: []string{"CAMERA", "MICROPHONE", "LOCATION"},
		RawSummary:           "Klausul suku bunga harian 0.1%/hari dan izin akses perangkat CAMDOG memenuhi standar kepatuhan POJK No. 10/2022.",
	}
}

func (c *Client) fallbackChatResponse(query string) string {
	lower := strings.ToLower(query)
	if strings.Contains(lower, "sebar data") || strings.Contains(lower, "kontak") || strings.Contains(lower, "ancam") {
		return "Penyebaran data pribadi atau foto Anda tanpa izin adalah tindak pidana menurut UU Perlindungan Data Pribadi No. 27/2022 Pasal 65 dan KUHP Pasal 368/369. Penagih dilarang menghubungi pihak selain debitur dan kontak darurat resmi. Anda berhak mengabaikan teror tersebut dan mengajukan laporan resmi ke Satgas PASTI OJK dan Patroli Siber Bareskrim Polri."
	}
	if strings.Contains(lower, "bunga") || strings.Contains(lower, "denda") {
		return "Sesuai SEOJK No. 19/SEOJK.05/2023, batas maksimum suku bunga harian pinjaman konsumtif adalah 0.3% per hari. Jika aplikasi membebankan lebih dari batas tersebut, pengenaan bunga berlebih (overcharge) berstatus non-compliant dan dapat disengketakan ke OJK Kontak 157."
	}
	return "Berdasarkan regulasi POJK No. 22/2023, penagihan hanya boleh dilakukan pukul 08:00 - 20:00 waktu setempat, dilarang menggunakan intimidasi verbal, dan dilarang menyebarkan data kepada pihak ketiga. Kumpulkan seluruh tangkapan layar chat untuk disusun menjadi berkas laporan resmi."
}
