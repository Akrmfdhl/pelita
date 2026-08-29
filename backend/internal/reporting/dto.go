package reporting

type ChatHistoryItem struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type ChatMessageRequest struct {
	CaseID              string            `json:"case_id,omitempty"`
	Message             string            `json:"message"`
	ConversationHistory []ChatHistoryItem `json:"conversation_history,omitempty"`
}

type ChatMessageResponse struct {
	Reply            string   `json:"reply"`
	SuggestedChannel string   `json:"suggested_channel"`
	RelevantArticles []string `json:"relevant_articles"`
}

type GenerateComplaintDraftRequest struct {
	CaseID      string `json:"case_id"`
	ChannelCode string `json:"channel_code"` // 'ojk', 'afpi', 'polri'
	VictimName  string `json:"victim_name"`
	VictimNIK   string `json:"victim_nik"`
	VictimPhone string `json:"victim_phone"`
}

type ComplaintDraftResponse struct {
	ID                   string `json:"id"`
	CaseID               string `json:"case_id"`
	ChannelCode          string `json:"channel_code"`
	ChannelName          string `json:"channel_name"`
	DraftTitle           string `json:"draft_title"`
	GeneratedLetterBody  string `json:"generated_letter_body"`
	SubmissionGuidelines string `json:"submission_guidelines"`
	OfficialPortalURL    string `json:"official_portal_url"`
	OfficialEmail        string `json:"official_email"`
	OfficialWhatsApp     string `json:"official_whatsapp"`
}
