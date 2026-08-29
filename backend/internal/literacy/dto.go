package literacy

type QuizOptionDTO struct {
	Key         string `json:"key"`
	Text        string `json:"text"`
	IsCorrect   bool   `json:"is_correct"`
	Explanation string `json:"explanation"`
}

type QuizDataDTO struct {
	QuestionText     string          `json:"question_text"`
	CorrectAnswerKey string          `json:"correct_answer_key"`
	Explanation      string          `json:"explanation"`
	Options          []QuizOptionDTO `json:"options"`
}

type LiteracyModuleDTO struct {
	ID                      string      `json:"id"`
	Slug                    string      `json:"slug"`
	Title                   string      `json:"title"`
	Category                string      `json:"category"`
	TargetViolationCategory string      `json:"target_violation_category"`
	ReadingContent          string      `json:"reading_content"`
	BriefContent            string      `json:"brief_content"`
	ReadingTimeMinutes      int         `json:"reading_time_minutes"`
	Quiz                    QuizDataDTO `json:"quiz"`
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
