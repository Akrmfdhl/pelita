<div align="center">

```
  ██████╗ ███████╗██╗     ██╗████████╗ █████╗ 
  ██╔══██╗██╔════╝██║     ██║╚══██╔══╝██╔══██╗
  ██████╔╝█████╗  ██║     ██║   ██║   ███████║
  ██╔═══╝ ██╔══╝  ██║     ██║   ██║   ██╔══██║
  ██║     ███████╗███████╗██║   ██║   ██║  ██║
  ╚═╝     ╚══════╝╚══════╝╚═╝   ╚═╝   ╚═╝  ╚═╝
```

### **AI-Powered Consumer Protection & Financial Integrity Platform**
*AI yang membaca kontrak sebelum Anda menandatangani, dan menyusun bukti setelah Anda diteror.*

---

[![Go Version](https://img.shields.io/badge/Go-1.22+-00ADD8?style=flat&logo=go&logoColor=white)](https://golang.org)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16_pgvector-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 1. Ikhtisar Solusi

**Pelita** adalah platform advokasi perlindungan konsumen digital terintegrasi yang memberdayakan masyarakat dari jeratan pinjaman online ilegal dan intimidasi penagihan kasar di Indonesia.

Dibangun dengan memadukan **Multimodal Document AI (Google Gemini)**, **Low-Latency LLM (Groq Llama 3)**, **Vector RAG (PostgreSQL pgvector)**, dan **Deterministic Legal Rule Engine** sebagai sumber kebenaran tunggal (*single source of truth*).

---

## 2. Modul Operasional Inti

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           PELITA CORE MODULES                           │
├────────────────────────────┬────────────────────────────────────────────┤
│ 1. Pemindai Kontrak        │ Pindai T&C, kalkulasi bunga harian POJK,   │
│    (Contract Scanner)      │ deteksi izin berbahaya & verifikasi OJK.   │
├────────────────────────────┼────────────────────────────────────────────┤
│ 2. Penyusun Bukti          │ Ekstraksi batch chat teror, penandaan      │
│    (Evidence Chronology)   │ pasal hukum (UU PDP/KUHP), ekspor PDF.     │
├────────────────────────────┼────────────────────────────────────────────┤
│ 3. Asisten Pelaporan       │ Chat konsultasi RAG berlatensi rendah,     │
│    (Reporting Assistant)   │ pemetaan kanal & generator draf aduan.     │
├────────────────────────────┼────────────────────────────────────────────┤
│ 4. Literasi Mikro          │ Edukasi ringkas 2 menit & kuis interaktif  │
│    (Micro-Literacy)        │ berbasis pelanggaran yang dialami korban.  │
└────────────────────────────┴────────────────────────────────────────────┘
```

---

## 3. Struktur Direktori Repositori

```
pelita/
├── backend/
│   ├── cmd/
│   │   ├── api/             # Entrypoint REST API HTTP Server (Go Fiber)
│   │   ├── seed/            # Seeder data regulasi OJK & modul literasi
│   │   └── worker/          # Background processing worker
│   ├── internal/
│   │   ├── auth/            # Firebase JWT bridge & middleware
│   │   ├── config/          # Environment configuration loader
│   │   ├── contracts/       # Handler, service, & DTO Pemindai Kontrak
│   │   ├── db/              # Migrasi skema database & kueri SQLC
│   │   │   ├── migrations/
│   │   │   └── queries/
│   │   ├── evidence/        # Handler, service, & DTO Penyusun Bukti
│   │   ├── literacy/        # Handler, service, & DTO Literasi & Kuis
│   │   ├── reporting/       # Handler, service, & DTO Asisten & Draf Surat
│   │   ├── rules/           # Deterministic Legal Rule Engine (POJK, PDP, KUHP)
│   │   └── security/        # Enkripsi data sensitif (AES-256-GCM)
│   ├── go.mod               # Definisi dependensi Go
│   └── sqlc.yaml            # Konfigurasi generator SQLC
├── frontend/
│   ├── src/
│   │   ├── components/      # Layout (Navbar, AppShell) & UI (StampBadge)
│   │   ├── features/        # Modul UI (Contracts, Evidence, Reporting, Literacy)
│   │   ├── lib/             # API client, utilitas, & helpers
│   │   ├── routes/          # Konfigurasi perutean halaman
│   │   ├── types/           # Definisi antarmuka TypeScript
│   │   ├── App.tsx          # Komponen root aplikasi
│   │   ├── index.css        # Tailwind CSS & custom design tokens
│   │   └── main.tsx         # Entrypoint React DOM
│   ├── index.html           # HTML template
│   ├── package.json         # Dependensi frontend
│   ├── tailwind.config.js   # Konfigurasi palet Archival Legal 60-30-10
│   ├── tsconfig.json        # Konfigurasi kompilator TypeScript
│   └── vite.config.ts       # Konfigurasi bundler Vite
├── .env.example             # Template konfigurasi variabel lingkungan
├── .gitignore               # Aturan pengabaian berkas git
├── docker-compose.yml       # Orkestrasi kontainer PostgreSQL & MinIO
└── README.md                # Dokumentasi utama proyek
```

---

## 4. Matriks Endpoint API

| Metode | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/healthz` | Pemeriksaan status keaktifan server (Liveness probe) |
| `GET` | `/readyz` | Pemeriksaan kesiapan basis data dan dependensi (Readiness probe) |
| `POST` | `/api/v1/contracts/audit` | Evaluasi parameter kontrak terhadap batasan POJK No. 10/2022 |
| `POST` | `/api/v1/evidence/cases` | Inisialisasi berkas kasus aduan baru |
| `POST` | `/api/v1/evidence/cases/:id/items` | Penambahan bukti pesan teror & penandaan pasal UU PDP/KUHP |
| `POST` | `/api/v1/reporting/chat` | Percakapan asisten advokasi berbasis korpus hukum |
| `POST` | `/api/v1/reporting/drafts` | Pembuatan draf surat aduan formal siap-salin |
| `GET` | `/api/v1/literacy/modules` | Pengambilan daftar modul edukasi hukum mikro |
| `POST` | `/api/v1/literacy/quiz/submit` | Evaluasi jawaban kuis pemahaman regulasi |

---

## 5. Panduan Instalasi & Menjalankan Aplikasi

### 1. Konfigurasi Lingkungan
```bash
cp .env.example .env
```

### 2. Jalankan Kontainer Infrastruktur (PostgreSQL & MinIO)
```bash
docker compose up -d
```

### 3. Jalankan Backend API Server (Go)
```bash
cd backend
go run ./cmd/api
```

### 4. Jalankan Frontend Web Application (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

Aplikasi web dapat diakses pada: `http://localhost:5173`.

---

## 6. Pengujian & Verifikasi Kualitas

```bash
# Menjalankan unit test backend
cd backend
go test -v ./internal/rules/... ./internal/security/...

# Menjalankan typecheck frontend
cd frontend
npm run typecheck

# Menjalankan build produksi frontend
npm run build
```

---

<div align="center">

**Pelita - Menegakkan Integritas Finansial & Keadilan Konsumen Digital**  
*Dikembangkan untuk IT FEST 2026 - Human-Centered AI with Integrity*

</div>
