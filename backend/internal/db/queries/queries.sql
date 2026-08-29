-- name: GetUserByFirebaseUID :one
SELECT id, firebase_uid, email, display_name, phone_number, created_at, updated_at
FROM users
WHERE firebase_uid = $1 AND deleted_at IS NULL;

-- name: UpsertUser :one
INSERT INTO users (firebase_uid, email, display_name, phone_number)
VALUES ($1, $2, $3, $4)
ON CONFLICT (firebase_uid) DO UPDATE
SET email = EXCLUDED.email,
    display_name = COALESCE(EXCLUDED.display_name, users.display_name),
    phone_number = COALESCE(EXCLUDED.phone_number, users.phone_number),
    updated_at = now()
RETURNING id, firebase_uid, email, display_name, phone_number, created_at, updated_at;

-- name: SearchOJKEntityByName :many
SELECT id, platform_name, company_name, license_number, status, website_url
FROM ojk_licensed_entities
WHERE platform_name ILIKE '%' || $1 || '%' OR company_name ILIKE '%' || $1 || '%'
LIMIT 10;

-- name: GetOJKEntityByExactName :one
SELECT id, platform_name, company_name, license_number, status, website_url
FROM ojk_licensed_entities
WHERE LOWER(platform_name) = LOWER($1)
LIMIT 1;

-- name: CreateContractAnalysis :one
INSERT INTO contract_analyses (
    user_id, matched_entity_id, document_url, platform_name_extracted,
    daily_interest_rate, admin_fee_percentage, late_fee_daily_rate,
    tenor_days, permissions_requested, risk_level, summary_explanation, processing_status
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
RETURNING *;

-- name: GetContractAnalysisByID :one
SELECT c.*, o.platform_name as official_platform_name, o.license_number, o.company_name
FROM contract_analyses c
LEFT JOIN ojk_licensed_entities o ON c.matched_entity_id = o.id
WHERE c.id = $1 AND c.user_id = $2;

-- name: ListContractAnalysesByUser :many
SELECT c.*, o.platform_name as official_platform_name, o.license_number
FROM contract_analyses c
LEFT JOIN ojk_licensed_entities o ON c.matched_entity_id = o.id
WHERE c.user_id = $1
ORDER BY c.created_at DESC;

-- name: CreateContractViolation :one
INSERT INTO contract_violations (
    contract_analysis_id, regulation_id, violation_type, clause_text_snippet, legal_explanation, severity
) VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: ListContractViolationsByAnalysisID :many
SELECT v.*, r.code as reg_code, r.title as reg_title, r.official_reference_number
FROM contract_violations v
LEFT JOIN legal_regulations r ON v.regulation_id = r.id
WHERE v.contract_analysis_id = $1
ORDER BY v.created_at ASC;

-- name: CreateEvidenceCase :one
INSERT INTO evidence_cases (user_id, case_title, platform_name, debt_collector_identifier, claimed_debt_amount, status, case_summary)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: GetEvidenceCaseByID :one
SELECT * FROM evidence_cases
WHERE id = $1 AND user_id = $2;

-- name: ListEvidenceCasesByUser :many
SELECT * FROM evidence_cases
WHERE user_id = $1
ORDER BY updated_at DESC;

-- name: DeleteEvidenceCase :exec
DELETE FROM evidence_cases
WHERE id = $1 AND user_id = $2;

-- name: CreateEvidenceItem :one
INSERT INTO evidence_items (
    case_id, file_url, media_type, message_timestamp, sender_phone,
    extracted_message_encrypted, threat_category, ocr_raw_payload, sequence_order
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING *;

-- name: ListEvidenceItemsByCase :many
SELECT * FROM evidence_items
WHERE case_id = $1
ORDER BY sequence_order ASC, message_timestamp ASC;

-- name: CreateEvidenceViolation :one
INSERT INTO evidence_violations (
    evidence_item_id, regulation_id, violation_code, violation_reason, statutory_article
) VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: ListReportingChannels :many
SELECT * FROM reporting_channels
WHERE is_active = true
ORDER BY channel_name ASC;

-- name: CreateComplaintDraft :one
INSERT INTO complaint_drafts (
    case_id, channel_id, draft_title, generated_letter_body, recipient_metadata, manual_dispatch_status
) VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: GetComplaintDraftByCaseID :one
SELECT d.*, c.channel_name, c.official_portal_url, c.official_email, c.official_whatsapp
FROM complaint_drafts d
JOIN reporting_channels c ON d.channel_id = c.id
WHERE d.case_id = $1;

-- name: UpdateComplaintDraftDispatchStatus :one
UPDATE complaint_drafts
SET manual_dispatch_status = $2,
    user_marked_sent_at = CASE WHEN $2 = 'marked_as_sent' THEN now() ELSE user_marked_sent_at END,
    updated_at = now()
WHERE id = $1
RETURNING *;

-- name: ListLiteracyModules :many
SELECT * FROM literacy_modules
WHERE is_active = true
ORDER BY order_index ASC;

-- name: GetLiteracyModuleBySlug :one
SELECT * FROM literacy_modules
WHERE slug = $1 AND is_active = true;

-- name: ListQuizzesByModuleID :many
SELECT id, module_id, question_text, options_json, order_index
FROM literacy_quizzes
WHERE module_id = $1
ORDER BY order_index ASC;

-- name: GetQuizAnswerByID :one
SELECT id, correct_option_index, explanation
FROM literacy_quizzes
WHERE id = $1;

-- name: RecordQuizAttempt :one
INSERT INTO user_quiz_attempts (user_id, quiz_id, selected_option_index, is_correct)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: SearchRegulationChunksByVector :many
SELECT c.id, c.regulation_id, c.article_number, c.clause_identifier, c.content_text,
       r.code as reg_code, r.title as reg_title,
       1 - (c.embedding <=> $1) AS similarity
FROM legal_regulation_chunks c
JOIN legal_regulations r ON c.regulation_id = r.id
WHERE r.is_active = true
ORDER BY c.embedding <=> $1
LIMIT $2;
