# PELITA — AI-Powered Consumer Protection & Financial Integrity Platform

> **AI yang membaca kontrak sebelum Anda menandatangani, dan menyusun bukti setelah Anda diteror.**

Pelita adalah platform perlindungan konsumen dan advokasi hukum digital yang memadukan **Multimodal Document AI (Google Gemini)**, **Low-Latency LLM (Groq Llama 3)**, **Vector RAG (PostgreSQL pgvector)**, dan **Deterministic Legal Rule Engine** untuk memberdayakan masyarakat dari jeratan pinjaman online ilegal dan intimidasi penagihan kasar di Indonesia.

---

## 1. Arsitektur Modul Inti

1. **Pemindai Kontrak & Legalitas (Contract Scanner):** Ekstraksi instan klausul bunga harian, biaya provisi, tenor, dan izin gawai dari berkas PDF/gambar T&C, diverifikasi silang terhadap whitelist berizin OJK dan batasan POJK No. 10/2022.
2. **Penyusun Bukti & Lini Masa (Evidence Chronology Builder):** Rekonstruksi berkas kronologis dari tangkapan layar obrolan teror (WhatsApp/SMS) dengan penandaan pasal pelanggaran otomatis (POJK 22/2023, UU PDP No. 27/2022, KUHP 368/369) dan ekspor PDF resmi siap-lapor.
3. **Asisten Pelaporan & Generator Draf Surat (Reporting Assistant):** Chat interaktif berbasis RAG korpus regulasi yang memetakan jalur aduan tepat (OJK, AFPI, Polri) dan menghasilkan draf surat aduan formal siap-salin.
4. **Modul Literasi Mikro Personal (Contextual Micro-Literacy):** Materi edukasi 2 menit dan kuis interaktif yang dipersonalisasi sesuai red-flag kasus pengguna.

---

## 2. Struktur Repositori & Navigasi Berkas

```
pelita/
├── .agents/
│   └── rules/             # Standar & aturan rekayasa modular AI agents
├── backend/               # Go Modular Monolith (API, Worker, Seeder, SQLC)
├── docs/                  # 12 Dokumen Spesifikasi Teknis & Bisnis Lengkap
│   ├── prd.md             # Product Requirements Document
│   ├── arsitektur.md      # System Architecture & Multi-Model Orchestration
│   ├── erd.md             # Entity Relationship Diagram & Data Models
│   ├── brd.md             # Business Requirements & Social Impact
│   ├── database_struktur.md # DDL PostgreSQL, SQLC queries, & Migrasi
│   ├── design.md          # UI/UX Archival Legal Design System
│   ├── rules.md           # Engineering Rules & Quality Constraints
│   ├── techstack.md       # Stack Comparison & Trade-off Analysis
│   ├── build.md           # Setup, Build & Docker Deployment Guide
│   ├── test.md            # Testing Strategy & QA Runbook
│   ├── review.md          # Security, PDP & Code Review Checklist
│   ├── debug.md           # Troubleshooting & Debugging Runbook
│   └── plans/             # Master Roadmap & Scoped Development Plans
├── frontend/              # React 18 + TypeScript + Vite + Tailwind SPA
├── infra/                 # Konfigurasi Nginx, Docker, & Deployment
└── scripts/               # Script otomatisasi database backup & seeder
```

---

## 3. Menjalankan Sistem Secara Cepat (Quickstart)

```bash
# 1. Konfigurasi Environment
cp .env.example .env

# 2. Jalankan PostgreSQL & MinIO
docker compose up -d

# 3. Jalankan Backend Migrations & Seeder
cd backend
go run ./cmd/migrate up
go run ./cmd/seed

# 4. Jalankan Go API Server
go run ./cmd/api

# 5. Jalankan Frontend (Terminal Baru)
cd frontend
npm install
npm run dev
```

Aplikasi dapat diakses pada `http://localhost:5173`.
Dokumentasi lengkap tersedia pada folder `docs/`.
