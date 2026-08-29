CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid VARCHAR(128) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    display_name VARCHAR(150),
    phone_number VARCHAR(30),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_email ON users(email);

CREATE TABLE ojk_licensed_entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform_name VARCHAR(150) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'licensed',
    website_url VARCHAR(255),
    published_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ojk_platform_name_trgm ON ojk_licensed_entities USING gin (platform_name gin_trgm_ops);
CREATE INDEX idx_ojk_company_name_trgm ON ojk_licensed_entities USING gin (company_name gin_trgm_ops);

CREATE TABLE legal_regulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    official_reference_number VARCHAR(100) NOT NULL,
    effective_date DATE NOT NULL,
    full_text_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE legal_regulation_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    regulation_id UUID NOT NULL REFERENCES legal_regulations(id) ON DELETE CASCADE,
    article_number VARCHAR(50) NOT NULL,
    clause_identifier VARCHAR(50),
    content_text TEXT NOT NULL,
    embedding vector(768),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_chunks_regulation_id ON legal_regulation_chunks(regulation_id);
CREATE INDEX idx_chunks_embedding_hnsw ON legal_regulation_chunks USING hnsw (embedding vector_cosine_ops);

CREATE TABLE contract_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    matched_entity_id UUID REFERENCES ojk_licensed_entities(id) ON DELETE SET NULL,
    document_url TEXT NOT NULL,
    platform_name_extracted VARCHAR(150),
    daily_interest_rate NUMERIC(6,4),
    admin_fee_percentage NUMERIC(6,4),
    late_fee_daily_rate NUMERIC(6,4),
    tenor_days INT,
    permissions_requested JSONB NOT NULL DEFAULT '[]'::jsonb,
    risk_level VARCHAR(30) NOT NULL DEFAULT 'medium',
    summary_explanation TEXT NOT NULL,
    processing_status VARCHAR(30) NOT NULL DEFAULT 'completed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_contracts_user_id ON contract_analyses(user_id);
CREATE INDEX idx_contracts_created_at ON contract_analyses(created_at DESC);

CREATE TABLE contract_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_analysis_id UUID NOT NULL REFERENCES contract_analyses(id) ON DELETE CASCADE,
    regulation_id UUID REFERENCES legal_regulations(id) ON DELETE SET NULL,
    violation_type VARCHAR(100) NOT NULL,
    clause_text_snippet TEXT NOT NULL,
    legal_explanation TEXT NOT NULL,
    severity VARCHAR(30) NOT NULL DEFAULT 'warning',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_contract_violations_analysis_id ON contract_violations(contract_analysis_id);

CREATE TABLE evidence_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    case_title VARCHAR(200) NOT NULL,
    platform_name VARCHAR(150) NOT NULL,
    debt_collector_identifier VARCHAR(150),
    claimed_debt_amount NUMERIC(15,2) DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    case_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_evidence_cases_user_id ON evidence_cases(user_id);

CREATE TABLE evidence_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES evidence_cases(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    media_type VARCHAR(50) NOT NULL DEFAULT 'image/png',
    message_timestamp TIMESTAMPTZ,
    sender_phone VARCHAR(50),
    extracted_message_encrypted TEXT NOT NULL,
    threat_category VARCHAR(100) NOT NULL DEFAULT 'general',
    ocr_raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    sequence_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_evidence_items_case_id ON evidence_items(case_id);
CREATE INDEX idx_evidence_items_timestamp ON evidence_items(message_timestamp ASC);

CREATE TABLE evidence_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evidence_item_id UUID NOT NULL REFERENCES evidence_items(id) ON DELETE CASCADE,
    regulation_id UUID REFERENCES legal_regulations(id) ON DELETE SET NULL,
    violation_code VARCHAR(100) NOT NULL,
    violation_reason TEXT NOT NULL,
    statutory_article VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_evidence_violations_item_id ON evidence_violations(evidence_item_id);

CREATE TABLE reporting_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_code VARCHAR(50) UNIQUE NOT NULL,
    channel_name VARCHAR(150) NOT NULL,
    agency_name VARCHAR(150) NOT NULL,
    official_portal_url VARCHAR(255),
    official_email VARCHAR(255),
    official_whatsapp VARCHAR(50),
    submission_guidelines TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE complaint_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES evidence_cases(id) ON DELETE CASCADE,
    channel_id UUID NOT NULL REFERENCES reporting_channels(id) ON DELETE RESTRICT,
    draft_title VARCHAR(200) NOT NULL,
    generated_letter_body TEXT NOT NULL,
    recipient_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    manual_dispatch_status VARCHAR(50) NOT NULL DEFAULT 'draft',
    user_marked_sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_complaint_drafts_case_id ON complaint_drafts(case_id);

CREATE TABLE literacy_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    target_violation_category VARCHAR(100) NOT NULL,
    brief_content TEXT NOT NULL,
    reading_time_minutes INT NOT NULL DEFAULT 2,
    order_index INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE literacy_quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES literacy_modules(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    options_json JSONB NOT NULL,
    correct_option_index INT NOT NULL,
    explanation TEXT NOT NULL,
    order_index INT NOT NULL DEFAULT 0
);

CREATE TABLE user_quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES literacy_quizzes(id) ON DELETE CASCADE,
    selected_option_index INT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_quiz_attempts_user_id ON user_quiz_attempts(user_id);
