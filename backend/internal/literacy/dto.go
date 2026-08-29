package literacy

type LiteracyModuleDTO struct {
	ID                     string `json:"id"`
	Slug                   string `json:"slug"`
	Title                  string `json:"title"`
	TargetViolationCategory string `json:"target_violation_category"`
	BriefContent           string `json:"brief_content"`
	ReadingTimeMinutes     int    `json:"reading_time_minutes"`
}

type QuizOptionDTO struct {
	Text        string `json:"text"`
	IsCorrect   bool   `json:"is_correct"`
	Explanation string `json:"explanation"`
}

type QuizQuestionDTO struct {
	ID           string          `json:"id"`
	ModuleID     string          `json:"module_id"`
	QuestionText string          `json:"question_text"`
	Options      []QuizOptionDTO `json:"options"`
}

type SubmitQuizAnswerRequest struct {
	QuizID              string `json:"quiz_id"`
	SelectedOptionIndex int    `json:"selected_option_index"`
}

type SubmitQuizAnswerResponse struct {
	IsCorrect   bool   `json:"is_correct"`
	Explanation string `json:"explanation"`
}
