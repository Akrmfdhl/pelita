export interface LegalDossierParams {
  channelCode: 'ojk' | 'afpi' | 'polri' | string;
  channelName: string;
  officialPortalUrl: string;
  officialWhatsapp: string;
  victimName: string;
  victimNIK: string;
  victimPhone: string;
  platformName: string;
  violationSummary: string;
  customLetterBody?: string;
  registrationNo?: string;
}

export function generateOfficialLegalDossierPDF(params: LegalDossierParams): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Harap izinkan popup pada peramban Anda untuk mengunduh dokumen resmi.');
    return;
  }

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const regNo =
    params.registrationNo ||
    `PLT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${new Date().getFullYear()}`;

  let tujuanNama = 'Kepala Kepolisian Daerah / Resor Setempat';
  let tujuanCQ = 'c.q. Sentra Pelayanan Kepolisian Terpadu (SPKT) / Unit Siber';
  let perihalTeks = 'Surat Pengaduan Dugaan Tindak Pidana Pemerasan dan Kejahatan Data Pribadi Melalui Media Elektronik';

  if (params.channelCode === 'ojk') {
    tujuanNama = 'Kepala Satgas Pemberantasan Aktivitas Keuangan Ilegal (Satgas PASTI)';
    tujuanCQ = 'c.q. Direktorat Pelayanan Konsumen Otoritas Jasa Keuangan (OJK)';
    perihalTeks = 'Surat Pengaduan Pelanggaran Praktik Penagihan Kasar, Bunga Predator, dan Akses Data Ilegal';
  } else if (params.channelCode === 'afpi') {
    tujuanNama = 'Ketua Komite Etik & Pengaduan Konsumen';
    tujuanCQ = 'c.q. Posko Pengaduan Asosiasi Fintech Pendanaan Bersama Indonesia (AFPI)';
    perihalTeks = 'Surat Pengaduan Pelanggaran Kode Etik Penagihan Layanan Pendanaan Bersama';
  }

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>SURAT PENGADUAN / LAPORAN KEJADIAN - ${params.victimName}</title>
  <style>
    @page {
      size: A4 portrait;
      margin-top: 30mm;
      margin-bottom: 30mm;
      margin-left: 40mm;
      margin-right: 30mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.5;
      color: #000000;
      background: #ffffff;
      margin: 0;
      padding: 0;
      text-align: justify;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .doc-title {
      text-align: center;
      font-size: 14pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 24px;
      letter-spacing: 0.5px;
      line-height: 1.3;
    }
    .meta-header {
      margin-bottom: 20px;
      font-size: 12pt;
      line-height: 1.5;
    }
    .meta-row {
      display: flex;
      margin-bottom: 2px;
    }
    .meta-label {
      width: 100px;
      flex-shrink: 0;
    }
    .meta-separator {
      width: 20px;
      flex-shrink: 0;
    }
    .meta-val {
      flex: 1;
    }
    .recipient-block {
      margin-top: 16px;
      margin-bottom: 20px;
      line-height: 1.4;
    }
    .section-header {
      font-size: 12pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-top: 18px;
      margin-bottom: 8px;
      page-break-after: avoid;
    }
    .subsection-header {
      font-size: 12pt;
      font-weight: bold;
      margin-top: 10px;
      margin-bottom: 4px;
      page-break-after: avoid;
    }
    .identity-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      font-size: 12pt;
    }
    .identity-table td {
      padding: 3px 0;
      vertical-align: top;
    }
    .identity-table .col-label {
      width: 210px;
    }
    .identity-table .col-sep {
      width: 20px;
    }
    .narrative-p {
      text-indent: 1.25cm;
      margin-top: 0;
      margin-bottom: 8px;
      line-height: 1.5;
      text-align: justify;
    }
    .timeline-list {
      margin-top: 4px;
      margin-bottom: 8px;
      padding-left: 24px;
      line-height: 1.5;
    }
    .timeline-list li {
      margin-bottom: 6px;
      text-align: justify;
    }
    .evidence-table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 16px 0;
      font-size: 11pt;
    }
    .evidence-table th, .evidence-table td {
      border: 1px solid #000000;
      padding: 6px 8px;
      vertical-align: top;
    }
    .evidence-table th {
      background-color: #f2f2f2;
      font-weight: bold;
      text-align: center;
    }
    .petitum-list {
      margin-top: 4px;
      margin-bottom: 12px;
      padding-left: 24px;
      line-height: 1.5;
    }
    .petitum-list li {
      margin-bottom: 6px;
      text-align: justify;
    }
    .sign-container {
      margin-top: 32px;
      display: flex;
      justify-content: flex-end;
      page-break-inside: avoid;
    }
    .sign-box {
      width: 260px;
      text-align: center;
      line-height: 1.4;
    }
    .materai-box {
      width: 110px;
      height: 65px;
      border: 1px dashed #777777;
      margin: 16px auto;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Arial, sans-serif;
      font-size: 8pt;
      color: #555555;
      text-align: center;
    }
    .sign-name {
      font-weight: bold;
      text-decoration: underline;
      text-transform: uppercase;
      margin-top: 8px;
    }
    .appendix-page {
      page-break-before: always;
      padding-top: 10px;
    }
    .appendix-title {
      text-align: center;
      font-size: 13pt;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
  </style>
</head>
<body>

  <!-- JUDUL DOKUMEN -->
  <div class="doc-title">
    SURAT PENGADUAN / LAPORAN KEJADIAN
  </div>

  <!-- METADATA SURAT -->
  <div class="meta-header">
    <div class="meta-row">
      <div class="meta-label">Nomor</div>
      <div class="meta-separator">:</div>
      <div class="meta-val">${regNo}</div>
    </div>
    <div class="meta-row">
      <div class="meta-label">Lampiran</div>
      <div class="meta-separator">:</div>
      <div class="meta-val">1 (Satu) Berkas Alat Bukti Elektronik</div>
    </div>
    <div class="meta-row">
      <div class="meta-label">Perihal</div>
      <div class="meta-separator">:</div>
      <div class="meta-val"><strong>${perihalTeks}</strong></div>
    </div>
  </div>

  <!-- TUJUAN SURAT -->
  <div class="recipient-block">
    Yth. <strong>${tujuanNama}</strong><br>
    ${tujuanCQ}<br>
    di<br>
    &nbsp;&nbsp;&nbsp;&nbsp;Tempat
  </div>

  <!-- PENGANTAR -->
  <p class="narrative-p">
    Dengan hormat, saya yang bertanda tangan di bawah ini menyampaikan laporan pengaduan mengenai dugaan peristiwa intimidasi, penagihan melawan hukum, pemerasan, dan ancaman penyebaran data pribadi yang dilakukan oleh pihak penyelenggara pinjaman online / penagih utang dengan uraian sebagai berikut:
  </p>

  <!-- I. IDENTITAS PELAPOR -->
  <div class="section-header">I. IDENTITAS PELAPOR</div>
  <table class="identity-table">
    <tr>
      <td class="col-label">Nama Lengkap</td>
      <td class="col-sep">:</td>
      <td><strong>${params.victimName}</strong></td>
    </tr>
    <tr>
      <td class="col-label">Nomor Induk Kependudukan (NIK)</td>
      <td class="col-sep">:</td>
      <td>${params.victimNIK}</td>
    </tr>
    <tr>
      <td class="col-label">Nomor Telepon / WhatsApp</td>
      <td class="col-sep">:</td>
      <td>${params.victimPhone}</td>
    </tr>
    <tr>
      <td class="col-label">Status Pelapor</td>
      <td class="col-sep">:</td>
      <td>Korban Konsumen Pengguna Layanan Finansial</td>
    </tr>
  </table>

  <!-- II. IDENTITAS TERLAPOR -->
  <div class="section-header">II. IDENTITAS TERLAPOR</div>
  <table class="identity-table">
    <tr>
      <td class="col-label">Nama Platform / Pinjol Terlapor</td>
      <td class="col-sep">:</td>
      <td><strong>${params.platformName}</strong></td>
    </tr>
    <tr>
      <td class="col-label">Pihak yang Melakukan Kontak</td>
      <td class="col-sep">:</td>
      <td>Desk Collection / Penagih Pihak Ketiga</td>
    </tr>
    <tr>
      <td class="col-label">Hubungan dengan Pelapor</td>
      <td class="col-sep">:</td>
      <td>Penyelenggara Layanan Pinjaman Online</td>
    </tr>
  </table>

  <!-- III. URAIAN KEJADIAN -->
  <div class="section-header">III. URAIAN KEJADIAN</div>

  <div class="subsection-header">A. Waktu Kejadian</div>
  <p class="narrative-p" style="text-indent: 0;">
    Peristiwa intimidasi dan penagihan melawan hukum terjadi sejak tanggal pelaporan awal dan berlangsung secara berulang, termasuk komunikasi yang dilakukan di luar batas jam kerja penagihan resmi (di atas pukul 20.00 malam waktu setempat).
  </p>

  <div class="subsection-header">B. Tempat Kejadian</div>
  <p class="narrative-p" style="text-indent: 0;">
    Media elektronik (saluran pesan singkat WhatsApp, SMS, dan panggilan seluler) yang diterima pada perangkat telepon seluler Pelapor.
  </p>

  <div class="subsection-header">C. Kronologi Kejadian</div>
  <p class="narrative-p" style="text-indent: 0;">
    Rangkaian fakta kejadian yang dialami Pelapor berlangsung dengan urutan sebagai berikut:
  </p>
  <ol class="timeline-list">
    <li>
      Pelapor merupakan pengguna layanan keuangan pada platform <strong>${params.platformName}</strong>.
    </li>
    <li>
      Pada saat proses penagihan, pihak Terlapor melakukan komunikasi dengan menggunakan kalimat intimidasi, ancaman verbal, dan teror psikologis yang tidak sesuai dengan norma etika dan ketentuan hukum yang berlaku.
    </li>
    <li>
      Pihak Terlapor mengancam akan menyebarluaskan data pribadi Pelapor (berupa foto identitas KTP dan nomor kontak) kepada daftar kontak darurat maupun pihak ketiga di luar kontak yang didaftarkan secara sah.
    </li>
    <li>
      Berdasarkan fakta tersebut, Pelapor menduga terdapat perbuatan yang melanggar ketentuan POJK No. 22 Tahun 2023 Pasal 62, Pasal 65 UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi, serta Pasal 368 dan 369 KUHP sehingga memerlukan pemeriksaan lebih lanjut oleh pihak berwenang.
    </li>
  </ol>

  <!-- IV. KERUGIAN / AKIBAT YANG DITIMBULKAN -->
  <div class="section-header">IV. KERUGIAN / AKIBAT YANG DITIMBULKAN</div>
  <p class="narrative-p">
    Akibat dari tindakan Terlapor, Pelapor mengalami kerugian immateriil berupa tekanan psikologis berat, terganggunya ketenteraman kehidupan pribadi dan keluarga, serta ancaman pencemaran nama baik di lingkungan kerja dan sosial.
  </p>

  <!-- V. SAKSI-SAKSI -->
  <div class="section-header">V. SAKSI-SAKSI</div>
  <ol class="timeline-list">
    <li>Pihak keluarga / rekan Pelapor yang turut dihubungi oleh pihak Terlapor.</li>
    <li>Saksi korban lain yang menerima ancaman serupa dari penyelenggara yang bersangkutan.</li>
  </ol>

  <!-- VI. BUKTI PENDUKUNG -->
  <div class="section-header">VI. BUKTI PENDUKUNG</div>
  <p class="narrative-p" style="text-indent: 0;">
    Sebagai bahan pendukung laporan pengaduan ini, Pelapor melampirkan daftar bukti berkode sebagai berikut:
  </p>

  <table class="evidence-table">
    <thead>
      <tr>
        <th style="width: 12%;">Kode</th>
        <th style="width: 38%;">Jenis Bukti</th>
        <th style="width: 50%;">Keterangan Bukti</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="text-align: center; font-weight: bold;">B-01</td>
        <td>Tangkapan Layar (Screenshot) Chat</td>
        <td>Bukti percakapan WhatsApp/SMS memuat pesan ancaman dan waktu teror penagihan.</td>
      </tr>
      <tr>
        <td style="text-align: center; font-weight: bold;">B-02</td>
        <td>Dokumen Tagihan / Kontrak Pinjaman</td>
        <td>Bukti rincian pengenaan suku bunga harian dan denda dari ${params.platformName}.</td>
      </tr>
      <tr>
        <td style="text-align: center; font-weight: bold;">B-03</td>
        <td>Log Riwayat Panggilan Telepon</td>
        <td>Catatan panggilan telepon masuk di luar jam operasional resmi (di atas pukul 20.00 WIB).</td>
      </tr>
    </tbody>
  </table>

  <!-- VII. PERMOHONAN -->
  <div class="section-header">VII. PERMOHONAN / TINDAKAN YANG DIHARAPKAN</div>
  <p class="narrative-p" style="text-indent: 0;">
    Berdasarkan uraian dan bukti-bukti tersebut di atas, Pelapor memohon kepada pihak berwenang untuk:
  </p>
  <ol class="petitum-list">
    <li>Menerima surat pengaduan ini sebagai bahan penanganan dan tindak lanjut laporan resmi.</li>
    <li>Melakukan pemeriksaan terhadap pihak Terlapor atas dugaan pelanggaran hukum dan peraturan perundang-undangan.</li>
    <li>Memberikan perlindungan bagi Pelapor dari segala bentuk ancaman dan intimidasi lebih lanjut.</li>
  </ol>

  <!-- PENUTUP -->
  <p class="narrative-p" style="margin-top: 14px;">
    Demikian surat pengaduan ini dibuat dengan sebenar-benarnya berdasarkan informasi dan dokumen yang dimiliki oleh Pelapor untuk dapat ditindaklanjuti sesuai ketentuan yang berlaku. Pelapor bersedia memberikan keterangan lebih lanjut serta menyerahkan bukti fisik yang diperlukan dalam proses pemeriksaan.
  </p>

  <!-- TANDA TANGAN -->
  <div class="sign-container">
    <div class="sign-box">
      <div>Indonesia, ${currentDate}</div>
      <div style="margin-top: 4px; font-weight: bold;">Pelapor,</div>
      
      <div class="materai-box">
        MATERAI<br>TEMPEL / ELEKTRONIK<br>Rp 10.000
      </div>

      <div class="sign-name">(${params.victimName})</div>
      <div style="font-size: 10pt; color: #333333;">NIK: ${params.victimNIK}</div>
    </div>
  </div>

  <!-- HALAMAN LAMPIRAN -->
  <div class="appendix-page">
    <div class="appendix-title">
      DAFTAR LAMPIRAN BUKTI PENDUKUNG
    </div>

    <table class="evidence-table">
      <thead>
        <tr>
          <th style="width: 8%;">No</th>
          <th style="width: 18%;">Kode Lampiran</th>
          <th style="width: 44%;">Nama Dokumen</th>
          <th style="width: 30%;">Status Fisik</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="text-align: center;">1</td>
          <td style="text-align: center; font-weight: bold;">Lampiran B-01</td>
          <td>Tangkapan Layar Pesan Intimidasi WhatsApp</td>
          <td>Berkas Digital Terlampir</td>
        </tr>
        <tr>
          <td style="text-align: center;">2</td>
          <td style="text-align: center; font-weight: bold;">Lampiran B-02</td>
          <td>Dokumen Perjanjian / Rincian Tagihan Finansial</td>
          <td>Berkas Digital Terlampir</td>
        </tr>
        <tr>
          <td style="text-align: center;">3</td>
          <td style="text-align: center; font-weight: bold;">Lampiran B-03</td>
          <td>Catatan Log Riwayat Panggilan Telepon Masuk</td>
          <td>Berkas Digital Terlampir</td>
        </tr>
      </tbody>
    </table>

    <div style="margin-top: 30px; font-size: 10pt; color: #555555; border-top: 1px solid #cccccc; padding-top: 8px;">
      <em>Catatan: Dokumen ini disusun sebagai bahan pengaduan mandiri terstruktur oleh korban konsumen sebelum proses formalisasi Berita Acara / Laporan Polisi oleh petugas di SPKT / Posko Layanan Konsumen Resmi.</em>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
