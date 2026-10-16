import type { Locale } from "@/types/domain";

export const defaultLocale: Locale = "id";
export const localeCookieName = "fr_locale";

type Dictionary = {
  localeSwitch: {
    label: string;
    id: string;
    en: string;
  };
  header: {
    productTag: string;
    nav: { features: string; security: string; pricing: string };
    settings: string;
    activate: string;
  };
  footer: {
    description: string;
    activate: string;
    settings: string;
  };
  auth: {
    status: {
      signIn: string;
      createAccount: string;
      signOut: string;
      signingOut: string;
      profile: string;
      settings: string;
    };
    signInPage: {
      eyebrow: string;
      title: string;
    };
    signUpPage: {
      eyebrow: string;
      title: string;
    };
    profilePage: {
      eyebrow: string;
      title: string;
      description: string;
      accountCardTitle: string;
      accountCardDescription: string;
      signedInWith: string;
      quickLinksTitle: string;
      quickLinksDescription: string;
      settingsLink: string;
    };
    form: {
      signInTitle: string;
      signInDescription: string;
      signUpTitle: string;
      signUpDescription: string;
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      passwordLabel: string;
      passwordPlaceholder: string;
      processing: string;
      createAccount: string;
      signIn: string;
      continueWithGoogle: string;
      orContinueWithEmail: string;
      accountCreated: string;
      signedIn: string;
      authFailed: string;
      alreadyHaveAccount: string;
      needAccount: string;
      switchToSignIn: string;
      switchToSignUp: string;
    };
  };
  home: {
    heroBadge: string;
    heroTitle: string;
    heroDescription: string;
    primaryCta: string;
    secondaryCta: string;
    stats: Array<{ title: string; description: string }>;
    preview: {
      eyebrow: string;
      title: string;
      live: string;
      pairTitle: string;
      pairValue: string;
      readTitle: string;
      writeTitle: string;
      clientLabel: string;
      meLabel: string;
      clientMessage: string;
      meDraft: string;
      meTranslated: string;
      readTooltipLabel: string;
      readTooltipText: string;
      writeTooltipLabel: string;
      writeTooltipAction: string;
      writeTooltipText: string;
      rewriteTitle: string;
      rewriteDescription: string;
      secureTitle: string;
      secureDescription: string;
    };
    features: {
      eyebrow: string;
      title: string;
      description: string;
      cards: Array<{ title: string; description: string }>;
    };
    pricingPanel: {
      badge: string;
      title: string;
      description: string;
      priceSuffix: string;
      cards: Array<{ index: string; title: string; description: string }>;
    };
    security: {
      eyebrow: string;
      title: string;
      description: string;
      cards: Array<{ title: string; description: string }>;
    };
    finalCta: {
      badge: string;
      title: string;
      description: string;
      activate: string;
      settings: string;
    };
  };
  onboarding: Array<{ title: string; description: string }>;
  activatePage: {
    eyebrow: string;
    title: string;
    description: string;
    nextTitle: string;
    nextDescription: string;
    nextButton: string;
  };
  settingsPage: {
    eyebrow: string;
    title: string;
    description: string;
    signedInAs: string;
    readyEyebrow: string;
    readyTitle: string;
    readyDescription: string;
    backButton: string;
    extensionSetup: {
      eyebrow: string;
      title: string;
      description: string;
      readyBadge: string;
      pendingBadge: string;
      activeStatus: string;
      inactiveStatus: string;
      installGuide: string;
      downloadSoon: string;
      activateFirst: string;
      installHint: string;
    };
    howItWorks: {
      eyebrow: string;
      title: string;
      description: string;
      steps: string[];
    };
    playground: {
      eyebrow: string;
      title: string;
      description: string;
      sourceLabel: string;
      targetLabel: string;
      providerLabel: string;
      modeLabel: string;
      textLabel: string;
      textPlaceholder: string;
      readMode: string;
      writeMode: string;
      action: string;
      translating: string;
      resultLabel: string;
      resultEmpty: string;
      inactiveNotice: string;
      errorFallback: string;
      sampleText: string;
    };
  };
  installGuidePage: {
    eyebrow: string;
    title: string;
    description: string;
    availabilityTitle: string;
    availabilityDescription: string;
    downloadSoon: string;
    stepsTitle: string;
    steps: string[];
    backToSettings: string;
    syncEyebrow: string;
    syncTitle: string;
    syncDescription: string;
  };
  licenseStatus: {
    title: string;
    keyLabel: string;
    keyEmpty: string;
    checkedLabel: string;
    checkedEmpty: string;
    updateLabel: string;
    updateDescription: string;
    tones: {
      inactive: { label: string; helper: string };
      active: { label: string; helper: string };
      revoked: { label: string; helper: string };
    };
  };
  activationForm: {
    step: string;
    title: string;
    description: string;
    label: string;
    placeholder: string;
    verifying: string;
    button: string;
    stateTitle: string;
    initialState: string;
    mockTitle: string;
    mockItems: string[];
    messages: {
      empty: string;
      revoked: string;
      success: string;
      invalid: string;
    };
  };
  settingsForm: {
    title: string;
    description: string;
    step: string;
    sourceLabel: string;
    sourcePlaceholder: string;
    targetLabel: string;
    targetPlaceholder: string;
    providerLabel: string;
    providerPlaceholder: string;
    saving: string;
    save: string;
    saveSuccess: string;
    saveError: string;
    readinessTitle: string;
    readinessActive: string;
    readinessInactive: string;
    writeTitle: string;
    writeDescription: string;
    providerRouteTitle: string;
    providerOpenAI: string;
    providerMaia: string;
  };
  languages: Array<{ value: string; label: string }>;
  providers: Array<{
    value: "openai" | "maia_router";
    label: string;
    description: string;
  }>;
};

const dictionaries: Record<Locale, Dictionary> = {
  id: {
    localeSwitch: { label: "Bahasa", id: "ID", en: "EN" },
    header: {
      productTag: "Ekstensi Chrome",
      nav: { features: "Fitur", security: "Keamanan", pricing: "Harga" },
      settings: "Pengaturan",
      activate: "Beli Sekarang",
    },
    footer: {
      description:
        "FluentRemote dirancang untuk remote worker yang butuh bantuan terjemahan tanpa keluar dari percakapan.",
      activate: "Aktivasi",
      settings: "Pengaturan",
    },
    auth: {
      status: {
        signIn: "Masuk",
        createAccount: "Buat akun",
        signOut: "Keluar",
        signingOut: "Keluar",
        profile: "Profile",
        settings: "Pengaturan",
      },
      signInPage: {
        eyebrow: "Autentikasi",
        title: "Masuk untuk mengakses pengaturan tersinkron dan data server nyata.",
      },
      signUpPage: {
        eyebrow: "Autentikasi",
        title: "Buat akun FluentRemote Anda dengan Better Auth.",
      },
      profilePage: {
        eyebrow: "Akun",
        title: "Kelola identitas dan akses FluentRemote Anda.",
        description:
          "Halaman ini menampilkan ringkasan akun Better Auth yang sedang aktif, sekaligus pintasan cepat ke area kerja utama Anda.",
        accountCardTitle: "Identitas akun",
        accountCardDescription:
          "Akun ini dipakai untuk menyimpan sesi, lisensi, dan preferensi FluentRemote ke server.",
        signedInWith: "Masuk sebagai",
        quickLinksTitle: "Akses cepat",
        quickLinksDescription:
          "Lanjutkan ke pengaturan utama untuk mengelola preferensi dan kesiapan FluentRemote Anda.",
        settingsLink: "Buka pengaturan",
      },
      form: {
        signInTitle: "Masuk ke FluentRemote",
        signInDescription:
          "Gunakan akun Better Auth Anda untuk mengakses pengaturan tersinkron, lisensi, dan preferensi terjemahan.",
        signUpTitle: "Buat akun FluentRemote Anda",
        signUpDescription:
          "Daftar dengan email, password, atau lanjutkan dengan Google untuk akun nyata yang tersimpan di Postgres.",
        nameLabel: "Nama",
        namePlaceholder: "Remote worker",
        emailLabel: "Email",
        emailPlaceholder: "anda@example.com",
        passwordLabel: "Password",
        passwordPlaceholder: "••••••••",
        processing: "Memproses",
        createAccount: "Buat akun",
        signIn: "Masuk",
        continueWithGoogle: "Lanjutkan dengan Google",
        orContinueWithEmail: "Atau lanjutkan dengan email",
        accountCreated: "Akun berhasil dibuat. Mengarahkan ke pengaturan...",
        signedIn: "Berhasil masuk. Mengarahkan ke pengaturan...",
        authFailed: "Autentikasi gagal. Silakan coba lagi.",
        alreadyHaveAccount: "Sudah punya akun?",
        needAccount: "Belum punya akun?",
        switchToSignIn: "Masuk",
        switchToSignUp: "Buat akun",
      },
    },
    home: {
      heroBadge: "Dibuat untuk percakapan remote",
      heroTitle: "Terjemahkan chat klien tanpa memutus alur kerja.",
      heroDescription:
        "FluentRemote memberi freelancer dan remote worker lapisan terjemahan langsung di dalam percakapan web. Sorot untuk membaca, klik untuk menulis ulang, lalu lanjut bekerja.",
      primaryCta: "Beli sekarang",
      secondaryCta: "Buka pengaturan",
      stats: [
        {
          title: "Sekali bayar",
          description: "Bayar sekali, tetap dapat pembaruan.",
        },
        {
          title: "2 jalur AI",
          description: "OpenAI dan MAIA Router, bisa diganti di pengaturan.",
        },
        {
          title: "Universal",
          description: "Dirancang untuk aplikasi chat yang berjalan di browser.",
        },
      ],
      preview: {
        eyebrow: "Preview Produk",
        title: "Pusat kendali untuk kerja klien multibahasa",
        live: "Mock Live",
        pairTitle: "Pasangan bahasa Anda",
        pairValue: "Bahasa Indonesia ke Bahasa Inggris",
        readTitle: "Preview terjemahan baca",
        writeTitle: "Preview terjemahan tulis",
        clientLabel: "Klien",
        meLabel: "Saya",
        clientMessage: "Can we go over the final revision tomorrow morning?",
        meDraft: "Ya, tentu saja bisa.",
        meTranslated: "Yes, of course we can.",
        readTooltipLabel: "Terjemahan instan",
        readTooltipText: "Bisakah kita bahas revisi terakhir besok pagi?",
        writeTooltipLabel: "Balasan siap kirim",
        writeTooltipAction: "Terjemahkan & ganti",
        writeTooltipText: "Yes, of course we can.",
        rewriteTitle: "Tulis ulang instan",
        rewriteDescription:
          "Sorot draft Anda lalu ganti dengan terjemahan yang lebih rapi dalam satu aksi.",
        secureTitle: "Aman sejak awal",
        secureDescription:
          "Verifikasi lisensi, perlindungan privasi, dan overlay ringan tetap menjadi inti produk.",
      },
      features: {
        eyebrow: "Fitur inti",
        title: "Dibangun dari hambatan nyata dalam chat klien internasional",
        description:
          "Rilis pertama fokus pada momen yang paling sering memperlambat remote worker: membaca pesan masuk, menyusun balasan yang meyakinkan, dan mengganti konteks bahasa dengan cepat.",
        cards: [
          {
            title: "Terjemahan baca langsung di tempat",
            description:
              "Sorot pesan berbahasa asing dan dapatkan terjemahan instan tanpa meninggalkan percakapan.",
          },
          {
            title: "Tulis ulang sebelum dikirim",
            description:
              "Sorot draft Anda, terjemahkan ke bahasa target, lalu ganti teks asli dalam satu klik.",
          },
          {
            title: "Ganti bahasa kapan saja",
            description:
              "Atur bahasa sumber dan target kapan saja agar cocok dengan tiap klien atau marketplace.",
          },
          {
            title: "Pilih jalur AI",
            description:
              "Arahkan permintaan terjemahan melalui OpenAI atau MAIA Router dari satu panel pengaturan.",
          },
        ],
      },
      pricingPanel: {
        badge: "Sekali beli",
        title: "Miliki workflow-nya, bukan tagihan bulanannya.",
        description:
          "FluentRemote dirancang sebagai utilitas sekali beli untuk orang-orang yang menghabiskan hari di browser, marketplace, DM, dan thread proyek remote.",
        priceSuffix: "sekali bayar",
        cards: [
          {
            index: "A1",
            title: "Setup awal yang cepat",
            description:
              "Aktifkan kode, pilih pasangan bahasa, dan tentukan jalur AI sebelum membuka tab chat.",
          },
          {
            index: "A2",
            title: "Default yang cocok untuk workflow",
            description:
              "Pengaturan dimodelkan dari konfigurasi paling praktis yang dibutuhkan remote worker.",
          },
        ],
      },
      security: {
        eyebrow: "Keamanan dan privasi",
        title: "Alat terjemahan yang menghormati percakapan sensitif dengan klien",
        description:
          "UI ini menonjolkan prinsip operasi dari PRD agar implementasi server nanti punya kontrak produk yang jelas.",
        cards: [
          {
            title: "Penyimpanan lisensi lokal terenkripsi",
            description:
              "Nilai lisensi dan sesi dirancang terlindungi sebelum disimpan ke browser lokal.",
          },
          {
            title: "Kebijakan zero-log untuk teks terjemahan",
            description:
              "Teks percakapan diproses hanya untuk terjemahan dan tidak dimaksudkan untuk disimpan permanen.",
          },
          {
            title: "Overlay aman untuk berbagai platform",
            description:
              "UI ekstensi tetap ringan dan tidak mengambil alih antarmuka chat milik platform.",
          },
        ],
      },
      finalCta: {
        badge: "Siap mulai",
        title: "Siapkan akun hari ini, mulai menerjemahkan besok.",
        description:
          "Semua yang Anda butuhkan sudah tersedia: aktivasi lisensi, pengaturan bahasa, penyimpanan API key, dan panduan pemasangan ekstensi.",
        activate: "Mulai pembelian",
        settings: "Ke pengaturan",
      },
    },
    onboarding: [
      { title: "Aktivasi", description: "Masukkan kode sekali beli dan verifikasi akses." },
      { title: "Konfigurasi", description: "Pilih bahasa dan provider AI yang diinginkan." },
      { title: "Siap", description: "Buka tab chat dan terjemahkan langsung saat bekerja." },
    ],
    activatePage: {
      eyebrow: "Aktivasi",
      title: "Buka akses FluentRemote dengan lisensi sekali beli.",
      description:
        "Verifikasi lisensi, lihat statusnya, lalu lanjut ke konfigurasi.",
      nextTitle: "Langkah berikutnya",
      nextDescription:
        "Setelah lisensi aktif, Anda dapat langsung mengatur bahasa dan provider terjemahan.",
      nextButton: "Lanjut ke pengaturan",
    },
    settingsPage: {
      eyebrow: "Pengaturan",
      title: "Atur bagaimana FluentRemote menerjemahkan percakapan Anda.",
      description:
        "Atur pasangan bahasa, pilihan provider AI, dan status lisensi akun Anda dari satu tempat.",
      signedInAs: "Masuk sebagai",
      readyEyebrow: "Status siap",
      readyTitle: "Akun Anda siap digunakan di web dan ekstensi.",
      readyDescription:
        "Verifikasi lisensi dan penyimpanan preferensi berjalan otomatis, sehingga Anda cukup mengatur bahasa dan provider sekali saja.",
      backButton: "Kembali ke landing page",
      extensionSetup: {
        eyebrow: "Setup ekstensi",
        title: "Pasang alat browser agar FluentRemote bisa dipakai langsung di chat Anda.",
        description:
          "Setelah lisensi aktif dan preferensi tersimpan, langkah berikutnya adalah memasang ekstensi Chrome dan menyinkronkan akun yang sama.",
        readyBadge: "Siap",
        pendingBadge: "Menunggu",
        activeStatus: "Lisensi aktif. Akun Anda siap untuk proses instalasi ekstensi.",
        inactiveStatus: "Lisensi belum aktif. Aktifkan lisensi terlebih dahulu sebelum memasang ekstensi.",
        installGuide: "Buka panduan instalasi",
        downloadSoon: "Unduh ekstensi segera",
        activateFirst: "Aktivasi lisensi dulu",
        installHint:
          "Lisensi Anda aktif. Buka panduan instalasi untuk memasang ekstensi dan menyinkronkan akun.",
      },
      howItWorks: {
        eyebrow: "Cara kerja",
        title: "Bagaimana FluentRemote bekerja setelah Anda membeli.",
        description:
          "Web app mengelola akun, lisensi, dan preferensi. Ekstensi browser memakai data tersebut untuk menerjemahkan langsung di platform chat.",
        steps: [
          "1. Masuk dan aktifkan lisensi sekali beli di dasbor.",
          "2. Simpan bahasa sumber, bahasa target, dan provider AI di Pengaturan.",
          "3. Pasang ekstensi di Chrome dan masuk dengan akun yang sama.",
          "4. Saat membuka chat, ekstensi membaca status lisensi dan preferensi Anda, lalu menerjemahkan teks yang Anda sorot.",
        ],
      },
      playground: {
        eyebrow: "Uji server",
        title: "Uji terjemahan langsung dari web ke server.",
        description:
          "Gunakan contoh teks di bawah untuk memastikan lisensi aktif dan provider AI pilihan Anda bekerja.",
        sourceLabel: "Bahasa sumber",
        targetLabel: "Bahasa target",
        providerLabel: "Provider",
        modeLabel: "Mode terjemahan",
        textLabel: "Teks contoh",
        textPlaceholder: "Ketik pesan yang ingin diuji terjemahannya...",
        readMode: "Baca",
        writeMode: "Tulis",
        action: "Uji terjemahan",
        translating: "Menerjemahkan",
        resultLabel: "Hasil server",
        resultEmpty: "Belum ada hasil terjemahan.",
        inactiveNotice: "Aktifkan lisensi terlebih dahulu untuk mencoba terjemahan.",
        errorFallback: "Terjadi kendala saat memanggil server translate.",
        sampleText: "Ya, tentu saja bisa. Kita bisa bahas revisi akhirnya besok pagi.",
      },
    },
    installGuidePage: {
      eyebrow: "Panduan instalasi",
      title: "Siapkan ekstensi FluentRemote di browser Anda.",
      description:
        "Halaman ini menjelaskan langkah setelah pembelian: simpan preferensi di Pengaturan, pasang ekstensi, lalu sinkronkan akun agar fitur terjemahan berjalan langsung di chat.",
      availabilityTitle: "Ketersediaan paket ekstensi",
      availabilityDescription:
        "Ekstensi siap dipasang di Chrome. Setelah lisensi aktif dan preferensi tersimpan, Anda cukup menyematkan ekstensi di toolbar.",
      downloadSoon: "Unduh ekstensi segera",
      stepsTitle: "Langkah instalasi",
      steps: [
        "1. Pastikan lisensi Anda aktif dan preferensi bahasa sudah disimpan di Pengaturan.",
        "2. Pasang ekstensi FluentRemote di Chrome, lalu sematkan di toolbar.",
        "3. Masuk di ekstensi dengan akun yang sama agar lisensi dan preferensi tersinkron otomatis.",
        "4. Buka platform chat, sorot pesan untuk mode baca, atau sorot draf balasan untuk mode tulis.",
      ],
      backToSettings: "Kembali ke pengaturan",
      syncEyebrow: "Sinkron akun",
      syncTitle: "Gunakan akun yang sama di web dan ekstensi",
      syncDescription:
        "Pertahankan akun Better Auth, lisensi aktif, dan preferensi bahasa yang sama agar ekstensi bisa mengambil pengaturan Anda secara otomatis saat sudah dipasang.",
    },
    licenseStatus: {
      title: "Status lisensi",
      keyLabel: "Kunci lisensi",
      keyEmpty: "Belum diaktivasi",
      checkedLabel: "Terakhir dicek",
      checkedEmpty: "Belum ada verifikasi",
      updateLabel: "Perilaku pembaruan",
      updateDescription:
        "Lisensi aktif tetap mendapatkan pembaruan fitur dan perbaikan keamanan tanpa biaya perpanjangan bulanan.",
      tones: {
        inactive: {
          label: "Belum aktif",
          helper: "Aktifkan lisensi Anda untuk membuka akses penuh ke ekstensi.",
        },
        active: {
          label: "Aktif",
          helper: "Akses FluentRemote Anda siap dipakai di berbagai permukaan chat yang didukung.",
        },
        revoked: {
          label: "Dicabut",
          helper: "Kunci ini perlu ditinjau manual sebelum bisa dipakai kembali.",
        },
      },
    },
    activationForm: {
      step: "Langkah 1 dari 3",
      title: "Aktifkan lisensi sekali beli Anda",
      description:
        "Gunakan kode aktivasi FluentRemote untuk membuka ruang kerja terjemahan Anda. Contoh kode valid:",
      label: "Kode aktivasi",
      placeholder: "FLUENT-2026-ACCESS",
      verifying: "Memverifikasi",
      button: "Aktivasi lisensi",
      stateTitle: "Status aktivasi",
      initialState: "Ruang kerja Anda saat ini menunggu kode aktivasi yang valid.",
      mockTitle: "Kode pengujian",
      mockItems: [
        "`FLUENT-2026-ACCESS` menghasilkan lisensi aktif.",
        "`REVOKED-FLUENT-KEY` menghasilkan status dicabut.",
        "Nilai lainnya akan tetap tidak aktif.",
      ],
      messages: {
        empty: "Masukkan kode aktivasi untuk melanjutkan.",
        revoked: "Kode aktivasi ini sudah dicabut. Silakan hubungi dukungan.",
        success: "Lisensi berhasil diaktifkan. Ruang kerja Anda siap dikonfigurasi.",
        invalid: "Kode aktivasi tersebut belum terlihat valid.",
      },
    },
    settingsForm: {
      title: "Preferensi terjemahan",
      description:
        "Atur pasangan bahasa dan jalur AI yang akan digunakan ekstensi Anda.",
      step: "Langkah 2 dari 3",
      sourceLabel: "Bahasa Anda",
      sourcePlaceholder: "Pilih bahasa sumber",
      targetLabel: "Bahasa target",
      targetPlaceholder: "Pilih bahasa target",
      providerLabel: "Provider AI",
      providerPlaceholder: "Pilih provider AI",
      saving: "Menyimpan",
      save: "Simpan preferensi",
      saveSuccess: "Preferensi berhasil disimpan ke server akun Anda.",
      saveError: "Preferensi belum bisa disimpan saat ini.",
      readinessTitle: "Kesiapan ekstensi",
      readinessActive: "Lisensi aktif dan konfigurasi bisa langsung dipakai.",
      readinessInactive:
        "Aktifkan lisensi terlebih dahulu untuk membuka seluruh fitur.",
      writeTitle: "Terjemahan tulis",
      writeDescription: "Tulis dalam {source} lalu ubah otomatis ke {target}.",
      providerRouteTitle: "Rute provider",
      providerOpenAI:
        "OpenAI dipilih untuk terjemahan percakapan yang seimbang dan natural.",
      providerMaia: "MAIA Router dipilih sebagai jalur server alternatif.",
    },
    languages: [
      { value: "English", label: "Bahasa Inggris" },
      { value: "Indonesian", label: "Bahasa Indonesia" },
      { value: "Spanish", label: "Bahasa Spanyol" },
      { value: "French", label: "Bahasa Prancis" },
      { value: "German", label: "Bahasa Jerman" },
      { value: "Portuguese", label: "Bahasa Portugis" },
      { value: "Arabic", label: "Bahasa Arab" },
      { value: "Japanese", label: "Bahasa Jepang" },
      { value: "Korean", label: "Bahasa Korea" },
      { value: "Mandarin Chinese", label: "Bahasa Mandarin" },
    ],
    providers: [
      {
        value: "openai",
        label: "OpenAI GPT-4o-mini",
        description:
          "Terjemahan natural yang seimbang untuk percakapan kerja lintas negara.",
      },
      {
        value: "maia_router",
        label: "MAIA Router",
        description: "Jalur routing alternatif untuk pilihan server AI yang fleksibel.",
      },
    ],
  },
  en: {
    localeSwitch: { label: "Language", id: "ID", en: "EN" },
    header: {
      productTag: "Chrome Extension",
      nav: { features: "Features", security: "Security", pricing: "Pricing" },
      settings: "Settings",
      activate: "Buy Now",
    },
    footer: {
      description:
        "FluentRemote is designed for remote workers who need translation support without leaving the conversation.",
      activate: "Activate",
      settings: "Settings",
    },
    auth: {
      status: {
        signIn: "Sign in",
        createAccount: "Create account",
        signOut: "Sign out",
        signingOut: "Signing out",
        profile: "Profile",
        settings: "Settings",
      },
      signInPage: {
        eyebrow: "Authentication",
        title: "Sign in to access synced settings and real backend data.",
      },
      signUpPage: {
        eyebrow: "Authentication",
        title: "Create your FluentRemote account with Better Auth.",
      },
      profilePage: {
        eyebrow: "Account",
        title: "Manage your FluentRemote identity and access.",
        description:
          "This page shows the active Better Auth account summary, along with quick links back into your main workspace surfaces.",
        accountCardTitle: "Account identity",
        accountCardDescription:
          "This account is used to persist your FluentRemote session, license, and preferences to the backend.",
        signedInWith: "Signed in as",
        quickLinksTitle: "Quick access",
        quickLinksDescription:
          "Jump back to your main settings to manage your FluentRemote preferences and readiness.",
        settingsLink: "Open settings",
      },
      form: {
        signInTitle: "Sign in to FluentRemote",
        signInDescription:
          "Use your Better Auth account to access synced settings, license state, and translation preferences.",
        signUpTitle: "Create your FluentRemote account",
        signUpDescription:
          "Sign up with email, password, or continue with Google for a real account backed by Postgres.",
        nameLabel: "Name",
        namePlaceholder: "Remote worker",
        emailLabel: "Email",
        emailPlaceholder: "you@example.com",
        passwordLabel: "Password",
        passwordPlaceholder: "••••••••",
        processing: "Processing",
        createAccount: "Create account",
        signIn: "Sign in",
        continueWithGoogle: "Continue with Google",
        orContinueWithEmail: "Or continue with email",
        accountCreated: "Account created successfully. Redirecting to settings...",
        signedIn: "Signed in successfully. Redirecting to settings...",
        authFailed: "Authentication failed. Please try again.",
        alreadyHaveAccount: "Already have an account?",
        needAccount: "Need a new account?",
        switchToSignIn: "Sign in",
        switchToSignUp: "Create one",
      },
    },
    home: {
      heroBadge: "Built for remote conversations",
      heroTitle: "Translate client chats without leaving your flow.",
      heroDescription:
        "FluentRemote gives freelancers and remote workers an in-place translation layer for web-based messaging. Highlight to read, click to rewrite, and keep moving.",
      primaryCta: "Buy now",
      secondaryCta: "Open settings",
      stats: [
        { title: "One-time", description: "Pay once, keep access to updates." },
        {
          title: "2 AI paths",
          description: "OpenAI and MAIA Router, switchable in settings.",
        },
        {
          title: "Universal",
          description: "Designed for chat apps that live in the browser.",
        },
      ],
      preview: {
        eyebrow: "Product Preview",
        title: "The control surface for multilingual client work",
        live: "Live Mock",
        pairTitle: "Your language pair",
        pairValue: "Indonesian to English",
        readTitle: "Read translation preview",
        writeTitle: "Write translation preview",
        clientLabel: "Client",
        meLabel: "Me",
        clientMessage: "Can we go over the final revision tomorrow morning?",
        meDraft: "Ya, tentu saja bisa.",
        meTranslated: "Yes, of course we can.",
        readTooltipLabel: "Instant translation",
        readTooltipText: "Bisakah kita bahas revisi terakhir besok pagi?",
        writeTooltipLabel: "Reply ready to send",
        writeTooltipAction: "Translate & replace",
        writeTooltipText: "Yes, of course we can.",
        rewriteTitle: "Instant rewrite",
        rewriteDescription:
          "Highlight your draft and replace it with a polished translation in one action.",
        secureTitle: "Secure by design",
        secureDescription:
          "License verification, privacy safeguards, and lightweight overlays stay at the core of the product.",
      },
      features: {
        eyebrow: "Core features",
        title: "Built around the real friction of international client messaging",
        description:
          "The first release focuses on the moments that slow remote workers down: reading incoming messages, composing confident replies, and switching language context quickly.",
        cards: [
          {
            title: "Read translations in place",
            description:
              "Highlight a foreign-language message and get an instant translation without leaving the conversation.",
          },
          {
            title: "Rewrite before you send",
            description:
              "Highlight your draft, translate it into the target language, and replace the original text in one click.",
          },
          {
            title: "Switch languages on demand",
            description:
              "Set your source and target languages anytime to adapt to each client or marketplace conversation.",
          },
          {
            title: "Choose the AI route",
            description:
              "Route translation requests through OpenAI or MAIA Router from a single settings surface.",
          },
        ],
      },
      pricingPanel: {
        badge: "One-time purchase",
        title: "Own the workflow, not another monthly bill.",
        description:
          "FluentRemote is designed as a buy-once utility for people who spend their day inside browsers, marketplaces, DMs, and remote project threads.",
        priceSuffix: "one-time",
        cards: [
          {
            index: "A1",
            title: "Fast first-run setup",
            description:
              "Activate your key, choose a language pair, and select the AI route before you open a chat tab.",
          },
          {
            index: "A2",
            title: "Workspace-oriented defaults",
            description:
              "Settings are modeled around the practical configuration remote workers care about most.",
          },
        ],
      },
      security: {
        eyebrow: "Security and privacy",
        title: "A translation tool that respects sensitive client conversations",
        description:
          "The UI highlights the operating principles from the PRD so future backend work has a clear product contract to match.",
        cards: [
          {
            title: "Encrypted local license storage",
            description:
              "License and session values are designed to be protected before they touch local browser storage.",
          },
          {
            title: "Zero-log translation policy",
            description:
              "Conversation text is processed for translation only and is not meant to be stored permanently.",
          },
          {
            title: "Platform-safe overlay design",
            description:
              "The extension UI stays lightweight and avoids hijacking the host chat interface.",
          },
        ],
      },
      finalCta: {
        badge: "Ready to start",
        title: "Set up the frontend today, connect the extension tomorrow.",
        description:
          "The current build gives you the product shell, activation journey, and settings dashboard needed for backend and extension integration.",
        activate: "Start checkout",
        settings: "Go to settings",
      },
    },
    onboarding: [
      { title: "Activate", description: "Enter your one-time code and verify access." },
      { title: "Configure", description: "Pick your languages and preferred AI provider." },
      { title: "Ready", description: "Open a chat tab and translate in place as you work." },
    ],
    activatePage: {
      eyebrow: "Activation",
      title: "Unlock FluentRemote with a one-time license.",
      description:
        "This flow simulates the product's first win: verify the license, keep the status visible, then move into configuration.",
      nextTitle: "Next step",
      nextDescription:
        "Once the license is active, the next surface the user sees should be configuration. This mirrors the onboarding path defined in the PRD.",
      nextButton: "Continue to settings",
    },
    settingsPage: {
      eyebrow: "Settings",
      title: "Configure how FluentRemote should translate your conversations.",
      description:
        "This dashboard focuses on the practical controls from the PRD: your language pair, provider selection, and license visibility.",
      signedInAs: "Signed in as",
      readyEyebrow: "Ready state",
      readyTitle: "The frontend is structured for extension and backend handoff.",
      readyDescription:
        "API boundaries already exist for license verification and preference persistence, so the next implementation step can replace mocks with real services.",
      backButton: "Return to marketing site",
      extensionSetup: {
        eyebrow: "Extension setup",
        title: "Install the browser tool so FluentRemote can work directly inside your chats.",
        description:
          "Once your license is active and preferences are saved, the next step is installing the Chrome extension and syncing the same account.",
        readyBadge: "Ready",
        pendingBadge: "Pending",
        activeStatus: "Your license is active. This account is ready for extension setup.",
        inactiveStatus: "Your license is not active yet. Activate it before installing the extension.",
        installGuide: "Open installation guide",
        downloadSoon: "Download extension soon",
        activateFirst: "Activate license first",
        installHint:
          "The final extension package is not bundled in this build yet, so the best current next step is to follow the installation guide and sync flow.",
      },
      howItWorks: {
        eyebrow: "How it works",
        title: "How FluentRemote works after a user has purchased access.",
        description:
          "This web app manages the account, license, and preferences. The browser extension then uses that data to translate directly inside chat platforms.",
        steps: [
          "1. The user signs in and activates their one-time license from the dashboard.",
          "2. The user saves source language, target language, and AI provider in Settings.",
          "3. The user installs the browser extension and signs in with the same account.",
          "4. When a web chat opens, the extension pulls license state and preferences, then runs highlight-to-translate features in place.",
        ],
      },
      playground: {
        eyebrow: "Backend test",
        title: "Run a live translation test from frontend to backend.",
        description:
          "Use the sample text below to confirm the translate route, active license state, and selected AI provider are all working together.",
        sourceLabel: "Source language",
        targetLabel: "Target language",
        providerLabel: "Provider",
        modeLabel: "Translation mode",
        textLabel: "Sample text",
        textPlaceholder: "Type the message you want to test...",
        readMode: "Read",
        writeMode: "Write",
        action: "Test translation",
        translating: "Translating",
        resultLabel: "Backend result",
        resultEmpty: "No translation result yet.",
        inactiveNotice: "Activate your license first to use the translate route.",
        errorFallback: "Something went wrong while calling the translate backend.",
        sampleText: "Ya, tentu saja bisa. Kita bisa bahas revisi akhirnya besok pagi.",
      },
    },
    installGuidePage: {
      eyebrow: "Installation guide",
      title: "Prepare the FluentRemote extension in your browser.",
      description:
        "This page explains the next step after purchase: save your preferences in the dashboard, install the extension, then sync the same account so translation works directly in chat.",
      availabilityTitle: "Extension package availability",
      availabilityDescription:
        "The extension is ready to install in Chrome, complete with step-by-step instructions.",
      downloadSoon: "Download extension soon",
      stepsTitle: "Installation steps",
      steps: [
        "1. Make sure your license is active and your language preferences are already saved in Settings.",
        "2. Install the FluentRemote extension in Chrome, then pin it to your toolbar.",
        "3. Sign in inside the extension with the same account so your license and preferences sync automatically.",
        "4. Open a web chat platform, highlight text for read translation, or highlight your own draft for write translation.",
      ],
      backToSettings: "Back to settings",
      syncEyebrow: "Account sync",
      syncTitle: "Use the same account across web and extension",
      syncDescription:
        "Keep your Better Auth account, active license, and saved language preferences in sync so the extension can pick up your settings automatically when it is installed.",
    },
    licenseStatus: {
      title: "License status",
      keyLabel: "License key",
      keyEmpty: "Not activated yet",
      checkedLabel: "Last checked",
      checkedEmpty: "No verification yet",
      updateLabel: "Update behavior",
      updateDescription:
        "Active licenses keep access to future feature updates and security patches without requiring monthly renewals.",
      tones: {
        inactive: {
          label: "Inactive",
          helper: "Activate your license to unlock full extension access.",
        },
        active: {
          label: "Active",
          helper: "Your FluentRemote access is ready across supported chat surfaces.",
        },
        revoked: {
          label: "Revoked",
          helper: "This key needs manual review before it can be used again.",
        },
      },
    },
    activationForm: {
      step: "Step 1 of 3",
      title: "Activate your one-time license",
      description:
        "Use a FluentRemote activation code to unlock your translation workspace. Try a mock valid key like",
      label: "Activation code",
      placeholder: "FLUENT-2026-ACCESS",
      verifying: "Verifying",
      button: "Activate license",
      stateTitle: "Activation state",
      initialState: "Your current workspace is waiting for a valid activation code.",
      mockTitle: "Mock testing keys",
      mockItems: [
        "`FLUENT-2026-ACCESS` returns an active license.",
        "`REVOKED-FLUENT-KEY` returns a revoked state.",
        "Any other value stays inactive.",
      ],
      messages: {
        empty: "Enter an activation code to continue.",
        revoked: "This activation code has been revoked. Please contact support.",
        success: "License activated. Your workspace is ready to configure.",
        invalid: "That activation code does not look valid yet.",
      },
    },
    settingsForm: {
      title: "Translation preferences",
      description:
        "Configure the language pair and AI route your extension will use.",
      step: "Step 2 of 3",
      sourceLabel: "Your language",
      sourcePlaceholder: "Select source language",
      targetLabel: "Target language",
      targetPlaceholder: "Select target language",
      providerLabel: "AI provider",
      providerPlaceholder: "Select AI provider",
      saving: "Saving",
      save: "Save preferences",
      saveSuccess: "Preferences saved to your account backend.",
      saveError: "Unable to save preferences right now.",
      readinessTitle: "Extension readiness",
      readinessActive: "License is active and configuration can be used immediately.",
      readinessInactive:
        "Activate the license first to mirror the intended product flow.",
      writeTitle: "Write translation",
      writeDescription: "Draft in {source} and auto-rewrite into {target}.",
      providerRouteTitle: "Provider route",
      providerOpenAI:
        "OpenAI is selected for balanced conversational translation.",
      providerMaia: "MAIA Router is selected as the alternate backend path.",
    },
    languages: [
      { value: "English", label: "English" },
      { value: "Indonesian", label: "Indonesian" },
      { value: "Spanish", label: "Spanish" },
      { value: "French", label: "French" },
      { value: "German", label: "German" },
      { value: "Portuguese", label: "Portuguese" },
      { value: "Arabic", label: "Arabic" },
      { value: "Japanese", label: "Japanese" },
      { value: "Korean", label: "Korean" },
      { value: "Mandarin Chinese", label: "Mandarin Chinese" },
    ],
    providers: [
      {
        value: "openai",
        label: "OpenAI GPT-4o-mini",
        description:
          "Balanced, natural translation for cross-border client chats.",
      },
      {
        value: "maia_router",
        label: "MAIA Router",
        description: "Alternative routing path for flexible AI backend selection.",
      },
    ],
  },
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
