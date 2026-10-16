import type { Dictionary } from "./en";

export const id: Dictionary = {
  meta: {
    titleDefault: "UangCounsel — review kontrak AI dengan bukti",
    titleHome: "Review kontrak AI dengan bukti",
    titleQa: "Tanya jawab — tentang proyek ini",
    description:
      "Unggah kontrak, lihat LLM membacanya klausul demi klausul, dan dapatkan penanda risiko dengan teks persisnya disorot di dokumen. Bukan opini — bukti.",
    descriptionHome:
      "Unggah kontrak, lihat LLM membacanya klausul demi klausul, dan dapatkan penanda risiko yang menunjuk teks persis yang memicunya.",
    descriptionQa:
      "Pertanyaan dan jawaban lugas tentang UangCounsel: apa yang nyata, apa yang sudah dihitung sebelumnya, cara kerja pipeline, privasi, dan hubungannya dengan uang.ai.",
    ogTitle: "UangCounsel — review kontrak AI dengan bukti",
    ogDescription:
      "Review kontrak AI di mana setiap penanda risiko menunjuk teks klausul persis yang memicunya. Karya portofolio oleh Rico.",
  },
  common: {
    chooseLanguage: "Pilih bahasa",
    toLight: "Ganti ke mode terang",
    toDark: "Ganti ke mode gelap",
    toggleTheme: "Ganti tema",
  },
  nav: {
    review: "Review",
    samples: "Sampel",
    how: "Cara kerja",
    qa: "Tanya jawab",
  },
  home: {
    badge: "Review AI, tapi dengan bukti",
    heroTitleA: "Kontrak ditelaah klausul demi klausul —",
    heroTitleB: " dengan teks persisnya disorot.",
    heroBodyA:
      "Kebanyakan review AI hanya memberi opini di jendela chat. UangCounsel menandai klausul berisiko ",
    heroBodyEm: "langsung di dokumen",
    heroBodyB:
      ", menjelaskan dampak bisnisnya dalam satu kalimat, dan menyusun permintaan negosiasi. Anda membaca kontraknya; mesin menunjukkan tempat yang perlu dilihat.",
    step1: "① buka sampel atau unggah PDF",
    step2: "② LLM membacanya",
    step3: "③ setiap penanda tertaut ke teks asalnya",
    samplesTitle: "File sampel",
    samplesBody:
      "Tiga kontrak realistis dengan ketentuan sepihak yang sengaja ditanam — jebakan yang sama dengan yang dihadapi tim legal internal setiap minggu.",
    howTitle: "Tanpa kotak hitam",
    howBody:
      "Pipeline ini sengaja dibuat transparan — penanda kejujuran yang sama seperti build kami yang lain.",
    howSteps: [
      {
        n: "01",
        t: "Teks + geometri",
        d: "PDF diurai dengan pdf.js: setiap karakter diekstrak bersama posisi halamannya yang persis, membangun indeks koordinat yang dapat dicari.",
      },
      {
        n: "02",
        t: "Tahap LLM terstruktur",
        d: "Model wajib menjawab dalam bentuk JSON ketat: judul, kategori, risiko, kutipan verbatim, dampak bisnis, dan permintaan negosiasi. Keluaran tidak valid diperbaiki sekali, lalu ditolak.",
      },
      {
        n: "03",
        t: "Pelokalan kutipan",
        d: "Setiap kutipan verbatim dilokalisasi kembali ke indeks koordinat — baris demi baris. Jika model memotong kutipan, pencocokan fragmen memulihkannya. Kutipan yang tak ditemukan diberi label, tidak pernah dipalsukan.",
      },
      {
        n: "04",
        t: "Sorotan yang bisa diaudit",
        d: "Hasilnya bukan jawaban chat. Ini sorotan di halaman yang bisa Anda verifikasi dengan mata kepala sendiri, ditambah mode pra-hitung yang bekerja tanpa infrastruktur AI.",
      },
    ],
    disclaimer:
      "Dibantu AI dan bersifat indikatif — bukan nasihat hukum. PDF yang diunggah dianalisis di memori dan tidak pernah disimpan.",
  },
  samples: {
    "vendor-msa": {
      title: "Vendor Master Services Agreement",
      type: "MSA · konsultansi",
      blurb:
        "Naskah vendor klasik: perpanjangan otomatis dengan jebakan pemberitahuan 180 hari, ganti rugi sepihak, batas tanggung jawab 3 bulan — dan klausul perubahan sepihak.",
      traps: ["perpanjangan otomatis", "ganti rugi sepihak", "batas tanggung jawab rendah", "perubahan sepihak"],
    },
    "saas-subscription": {
      title: "SaaS Subscription Agreement",
      type: "SaaS · langganan",
      blurb:
        "Eskalasi harga perpanjangan otomatis bertumpuk, tanpa remedi SLA, terkunci data saat keluar, dan perubahan ketentuan 'penggunaan berlanjut berarti setuju'.",
      traps: ["eskalasi harga", "tanpa remedi SLA", "biaya pengambilan data", "perubahan ketentuan diam-diam"],
    },
    "employment-offer": {
      title: "Senior Consultant Employment Agreement",
      type: "Ketenagakerjaan",
      blurb:
        "Klausul tidak bersaing yang luas, kerahasiaan selamanya, clawback pemberitahuan tak dibayar, dan penugasan IP yang meluas ke proyek pribadi.",
      traps: ["tidak bersaing", "NDA selamanya", "clawback", "penugasan IP luas"],
    },
  },
  reviewer: {
    trySample: "Coba kontrak sampel",
    upload: "Unggah PDF Anda",
    samplesNote:
      "Sampel: PDF sungguhan yang dianalisis pipeline yang sama, dihitung sebelumnya agar terbuka seketika. Unggahan diproses langsung melalui pipeline LLM. Hanya PDF berbasis teks (maks 8 MB).",
    stages: [
      "Membaca dokumen…",
      "Mengekstrak klausul…",
      "Menimbang risiko…",
      "Melokalisasi kutipan di halaman…",
    ],
    analysisFailed: "Analisis gagal.",
    noLlmTip:
      "Tips: tiga kontrak sampel di bawah bekerja tanpa kunci API apa pun — analisisnya sudah dihitung sebelumnya.",
    networkError: "Kesalahan jaringan — tidak dapat menghubungi endpoint analisis.",
    choosePdf: "Silakan pilih file PDF.",
    tooLarge: "PDF terlalu besar (maks 8 MB).",
    copied: "Tersalin ✓",
    copySummary: "Salin ringkasan",
    pages: "{n} halaman",
    precomputed: "analisis pra-hitung",
    live: "analisis langsung",
    liveAnalysis: "analisis langsung dalam {s} dtk",
    flagsNote: "setiap penanda menunjuk teks asalnya",
    notFound: "kutipan tidak ditemukan",
    noClauses: "{n} klausul penting ditemukan.",
    riskLabel: { high: "Risiko tinggi", medium: "Perlu review", low: "Aman" },
    risk: { high: "tinggi", medium: "sedang", low: "rendah" },
    copyTitle: "Review kontrak — {doc}",
    copyExcerpt: "Kutipan",
    copyWhy: "Mengapa penting",
    copyAsk: "Permintaan negosiasi",
    copyDisclaimer: "Review dibantu AI — indikatif, bukan nasihat hukum.",
  },
  footer: {
    disclaimer:
      "Karya portofolio oleh Rico. Analisis dibantu AI dan bersifat indikatif — bukan nasihat hukum. Tidak berafiliasi dengan atau didukung oleh uang.ai.",
  },
  notFound: {
    text: "Halaman ini tidak ada dalam kontrak.",
    back: "Kembali ke review",
  },
  qa: {
    heading: "Tanya jawab",
    intro:
      "Jawaban lugas tentang UangCounsel sendiri: apa yang nyata, apa yang sudah dihitung sebelumnya, cara kerja pipeline, dan apa yang terjadi dengan data Anda.",
    cover: "Ada yang belum tercakup di tanya jawab? Coba ",
    coverLink: "reviewer",
    coverTail: " dan buktikan sendiri.",
    categories: {
      project: {
        label: "Proyeknya",
        items: [
          {
            q: "Apa itu UangCounsel?",
            a: "Alat review kontrak AI yang dibangun sebagai karya portofolio: unggah kontrak PDF berbasis teks dan dapatkan penanda risiko tingkat klausul, masing-masing menunjuk teks tersorot persis yang memicunya, ditambah penjelasan bisnis satu kalimat dan permintaan negosiasi per klausul.",
          },
          {
            q: "Mengapa ini dibangun?",
            a: "Sebagai bagian ketiga dari showcase untuk uang.ai (\"The AI Factory\"): UangLite membuktikan agen dapat mengoperasikan aplikasi bisnis dengan aman, UangFactory membuktikan sebuah situs bisa membuktikan alih-alih berceramah, dan UangCounsel membuktikan bahasa desain yang sama bekerja pada dokumen tak terstruktur — salah satu vertikal studi kasus uang.ai sendiri (legal).",
          },
          {
            q: "Apakah ini berafiliasi dengan uang.ai?",
            a: "Tidak. Karya portofolio independen oleh Rico — tidak berafiliasi dengan atau didukung oleh uang.ai. Terinspirasi dari positioning mereka: pemahaman bisnis + rekayasa + keahlian AI.",
          },
          {
            q: "Apakah ini nasihat hukum?",
            a: "Bukan. Analisisnya dibantu AI dan bersifat indikatif. Dirancang untuk memberi tahu Anda ke mana harus melihat dan apa yang harus ditanyakan, bukan menggantikan pengacara. Setiap keluaran menyatakannya.",
          },
        ],
      },
      real: {
        label: "Nyata vs. pra-hitung",
        items: [
          {
            q: "Apakah analisisnya AI sungguhan?",
            a: "Ya. PDF yang diunggah diproses langsung melalui pipeline LLM (endpoint apa pun yang kompatibel OpenAI). Tiga kontrak sampel disertakan dengan analisis pra-hitung — dihasilkan oleh pipeline yang persis sama, lalu dibekukan agar demo terbuka seketika tanpa biaya.",
          },
          {
            q: "Bagaimana saya tahu sorotannya tidak dipalsukan?",
            a: "Setiap sorotan adalah geometri, bukan tangkapan layar: server melokalisasi kutipan verbatim model kembali ke indeks koordinat tingkat karakter dari PDF. Jika kutipan tidak ditemukan — misalnya karena model memotongnya — kartu klausul menulis 'kutipan tidak ditemukan' alih-alih berpura-pura.",
          },
          {
            q: "Apa yang terjadi tanpa kunci API?",
            a: "Sampel tetap bekerja penuh (pra-hitung), dan unggahan mengembalikan pesan jelas 'endpoint LLM belum dikonfigurasi' alih-alih layar rusak. Degradasi yang anggun adalah prinsip desain di sini, bukan sesempatian.",
          },
          {
            q: "Bisakah model halusinasi?",
            a: "Model bisa berhalusinasi kutipan — justru itulah alasan langkah pelokalan ada. Pipeline hanya menampilkan kutipan yang dapat ditemukan verbatim di dokumen; sisanya diperbaiki (satu percobaan ulang) atau diberi label tidak ditemukan. Kolom 'mengapa' dan 'saran' adalah penilaian model dan ditandai indikatif.",
          },
        ],
      },
      pipeline: {
        label: "Cara kerja",
        items: [
          {
            q: "Bagaimana cara kerja sorotannya, secara teknis?",
            a: "pdf.js mengekstrak setiap karakter beserta posisi halamannya. Itu membangun indeks koordinat; kutipan model dicocokkan kembali ke sana (tak peka huruf besar-kecil, toleran spasi, dengan fallback fragmen elipsis) dan digabung menjadi satu persegi per baris visual. Penampil me-render PDF di canvas dan memposisikan overlay berwarna pada koordinat itu.",
          },
          {
            q: "Apa yang menjaga keluaran LLM tetap valid?",
            a: "Bentuk JSON ketat dijelaskan di prompt (endpoint kompatibel OpenAI sering berjalan tanpa penegakan skema keras), keluaran divalidasi dengan zod dan normalisasi longgar (mis. 'High' → 'high'), dan upaya gagal mendapat tepat satu putaran perbaikan sebelum jatuh ke pesan galat yang jelas.",
          },
          {
            q: "Apa saja batasannya?",
            a: "Hanya PDF berbasis teks — dokumen hasil pindai tidak punya teks yang dapat diekstrak dan ditolak dengan penjelasan. Maksimal 8 MB dan 40 halaman. Tata letak multi-kolom dapat menguji heuristik penggabungan baris. Dibatasi 10 analisis per menit per IP.",
          },
        ],
      },
      privacy: {
        label: "Privasi & data",
        items: [
          {
            q: "Apakah kontrak yang saya unggah disimpan?",
            a: "Tidak. Unggahan dianalisis di memori lalu dibuang. Tidak ada basis data di proyek ini — tidak ada tentang dokumen Anda yang tersisa setelah respons dikirim.",
          },
          {
            q: "Apa yang dilihat penyedia LLM?",
            a: "Teks hasil ekstraksi dokumen yang Anda unggah dikirim ke endpoint LLM yang dikonfigurasi untuk dianalisis. Itu melekat pada semua review LLM. Untuk kontrak sensitif, jalankan instansi Anda sendiri — seluruh pipeline bekerja self-hosted dengan endpoint model lokal.",
          },
        ],
      },
      stack: {
        label: "Stack & meta",
        items: [
          {
            q: "Dibangun dengan apa?",
            a: "Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript · AI SDK dengan endpoint apa pun yang kompatibel OpenAI · pdf.js untuk penguraian dan rendering · Vitest untuk uji unit · Playwright untuk uji end-to-end. Tanpa basis data oleh desain.",
          },
          {
            q: "Bagaimana pengujannya?",
            a: "Uji unit mencakup lapisan geometri (pelokalan kutipan, fallback fragmen) dan validasi keluaran. Uji end-to-end Playwright mencakup alur pengguna penuh: membuka sampel, melihat sorotan dirender, mengklik klausul untuk melompat ke teks asalnya, ganti tema, dan halaman tanya jawab.",
          },
          {
            q: "Dari mana mode gelap/terang berasal?",
            a: "Sistem token buatan sendiri (CSS custom properties + Tailwind 4), disimpan per peramban, mengikuti prefers-color-scheme pada kunjungan pertama. Tanpa pustaka UI.",
          },
          {
            q: "Bisakah saya menjalankan instansi sendiri?",
            a: "Ya — ini open source. Kloning repo, opsional atur LLM_BASE_URL / LLM_API_KEY / LLM_MODEL sebagai variabel lingkungan (endpoint apa pun yang kompatibel OpenAI bekerja, termasuk yang lokal), lalu deploy. Sisanya bekerja tanpa konfigurasi.",
          },
        ],
      },
    },
  },
};
