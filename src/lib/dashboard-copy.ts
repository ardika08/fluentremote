import type { Locale } from "@/types/domain";
import { getDictionary } from "@/lib/i18n";

/**
 * Kumpulan salinan (copy) untuk area dashboard.
 * Dipakai bersama oleh /dashboard/* supaya teks tidak terduplikasi antar halaman.
 */
export function getDashboardCopy(locale: Locale, dictionary = getDictionary(locale)) {
  const isId = locale === "id";

  const settingsCopy = {
    purchaseBannerTitle: isId
      ? "Anda belum membeli FluentRemote."
      : "You have not purchased FluentRemote yet.",
    purchaseBannerDescription: isId
      ? "Selesaikan pembayaran untuk membuka kode lisensi unik, menyimpan API key provider, dan mengaktifkan ekstensi."
      : "Complete your purchase to unlock your unique license key, provider API key setup, extension activation, and live translation.",
    checkoutLabel: isId ? "Lanjut ke pembelian" : "Continue to checkout",
    lockedWorkspaceEyebrow: isId ? "Pratinjau ruang kerja" : "Workspace preview",
    lockedWorkspaceTitle: isId
      ? "Ruang kerja ini akan terbuka penuh segera setelah pembayaran terkonfirmasi."
      : "This workspace unlocks fully as soon as your payment is confirmed.",
    lockedWorkspaceDescription: isId
      ? "Sebelum membeli, form aktif sengaja tidak ditampilkan agar fokus pada satu langkah berikutnya."
      : "Before purchase, the active form stays hidden so the next step stays focused.",
    lockedWorkspaceSupport: isId
      ? "Setelah pembayaran sukses, area ini langsung berubah menjadi panel aktif untuk kode lisensi, API key provider, dan sinkronisasi ekstensi."
      : "After a successful payment, this area turns into the active panel for your license key, provider API keys, and extension sync.",
    lockedWorkspaceHint: isId
      ? "Satu pembelian membuka seluruh alur."
      : "One purchase unlocks the full flow.",
    lockedWorkspaceNote: isId
      ? "Begitu Mayar mengonfirmasi pembayaran, halaman ini langsung menjadi ruang kerja aktif tanpa langkah manual tambahan."
      : "As soon as Mayar confirms the payment, this page becomes the active workspace without extra manual steps.",
    extensionTitle: isId
      ? "Pasang ekstensi agar FluentRemote bisa dipakai langsung di chat Anda."
      : "Install the extension so FluentRemote works inside your chats.",
    extensionDescription: isId
      ? "Setelah lisensi dan API key provider tersimpan, ekstensi dapat diaktifkan dengan menempelkan kode lisensi saat pertama dipasang."
      : "Once your license and provider API keys are saved, the extension can be activated by pasting your license code on first install.",
    extensionReady: isId
      ? "Akses sudah aktif. Buka panduan instalasi, lalu gunakan kode lisensi Anda saat aktivasi ekstensi."
      : "Access is active. Open the installation guide, then use your license code during extension activation.",
    extensionLocked: isId
      ? "Area ini terlihat sebagai pratinjau, tetapi baru aktif penuh setelah pembayaran berhasil."
      : "This area is shown as a preview and becomes fully active after a successful purchase.",
    extensionGuide: isId ? "Buka panduan instalasi" : "Open installation guide",
    extensionLockedBadge: isId ? "Terkunci" : "Locked",
    extensionReadyBadge: isId ? "Siap" : "Ready",
    checklistEyebrow: isId ? "Checklist kesiapan" : "Readiness checklist",
    checklistTitle: isId
      ? "Tiga hal ini menentukan ekstensi siap dipakai."
      : "These three things make the extension ready to use.",
    checklistDescription: isId
      ? "Menampilkan langkah mana yang sudah selesai dan mana yang masih perlu dibereskan."
      : "Shows which steps are done and which still need attention.",
    checklistItems: {
      license: isId
        ? "Lisensi aktif dan sudah tertaut ke akun Anda."
        : "The license is active and linked to your account.",
      providerKeys: isId
        ? "Minimal satu API key provider sudah tersimpan di halaman Terjemahan."
        : "At least one provider API key is saved on the Translation page.",
      extension: isId
        ? "Ekstensi siap dipasang dan diaktivasi dengan kode lisensi yang sama."
        : "The extension is ready to install and activate with the same license code.",
    },
    checklistPending: isId ? "Menunggu" : "Pending",
    checklistDone: isId ? "Siap" : "Ready",
  };

  const settingsFormDictionary = {
    ...dictionary.settingsForm,
    openAiKeyLabel: "OpenAI API Key",
    openAiKeyPlaceholder: isId ? "Masukkan API key OpenAI Anda" : "Enter your OpenAI API key",
    openAiKeyStored: isId ? "Key tersimpan" : "Stored key",
    maiaKeyLabel: "MAIA Router API Key",
    maiaKeyPlaceholder: isId ? "Masukkan API key MAIA Router Anda" : "Enter your MAIA Router API key",
    maiaKeyStored: isId ? "Key tersimpan" : "Stored key",
    resetLabel: isId ? "Hapus" : "Reset",
    resetSuccess: isId ? "API key berhasil dihapus dari akun Anda." : "The API key was removed from your account.",
    resetError: isId ? "API key belum bisa dihapus saat ini." : "The API key could not be removed right now.",
    apiKeySectionTitle: isId ? "API key provider" : "Provider API keys",
    apiKeySectionDescription: isId
      ? "Ekstensi tidak meminta API key saat aktivasi awal. Isi OpenAI API Key dan/atau MAIA Router API Key di halaman ini; ekstensi akan menyinkronkannya otomatis setelah Anda masuk dengan akun yang sama."
      : "The extension does not ask for API keys during first activation. Fill in your OpenAI API Key and/or MAIA Router API Key here; the extension syncs them automatically after you sign in with the same account.",
    apiKeyPurchaseTitle: isId ? "API key tidak termasuk" : "API keys are not included",
    apiKeyPurchaseDescription: isId
      ? "FluentRemote memakai API key milik Anda sendiri. Jika belum memilikinya, beli API key provider terlebih dahulu lalu simpan di halaman ini."
      : "FluentRemote uses user-owned API keys. If you do not have one yet, purchase a provider API key first and save it here.",
    apiKeyOpenAIBuy: isId ? "Beli API key OpenAI mulai $5" : "Buy OpenAI API key from $5",
    apiKeyMaiaBuy: isId ? "Beli API key MAIA Router mulai $1" : "Buy MAIA Router API key from $1",
    lockedKeysNotice: isId ? "Kolom ini aktif setelah pembelian berhasil." : "This field unlocks after a successful purchase.",
  };

  const licenseDictionary = {
    ...dictionary.licenseStatus,
    copyLabel: isId ? "Salin" : "Copy",
    copiedLabel: isId ? "Tersalin" : "Copied",
    keyEmpty: isId ? "Belum diterbitkan" : "Not issued yet",
    checkedEmpty: isId ? "Belum ada pembelian aktif" : "No active purchase yet",
    purchaseHint: isId
      ? "Selesaikan pembayaran untuk mendapatkan kode lisensi unik milik akun Anda."
      : "Complete your purchase to receive the unique license code tied to your account.",
  };

  const playgroundDictionary = {
    ...dictionary.settingsPage.playground,
    inactiveNotice: isId
      ? "Selesaikan pembelian dan simpan API key provider Anda terlebih dahulu."
      : "Complete your purchase and save your provider API keys first.",
    checkoutCta: isId ? "Buka pembelian" : "Open checkout",
  };

  const activationDictionary = {
    ...dictionary.activationForm,
    title: isId ? "Aktifkan kode lisensi Anda" : "Activate your license code",
    description: isId
      ? "Tempelkan kode lisensi yang Anda terima setelah pembayaran. Kode akan langsung ditautkan ke akun ini."
      : "Paste the license code you received after purchase. It will be linked to this account immediately.",
    placeholder: "FLR-XXXX-XXXX-XXXX-XXXX",
    button: isId ? "Aktifkan lisensi" : "Activate license",
    stateTitle: isId ? "Status aktivasi" : "Activation status",
    initialState: isId
      ? "Masukkan kode lisensi untuk mengaktifkan akses di akun ini."
      : "Enter your license code to activate access on this account.",
    mockTitle: "",
    mockItems: [] as string[],
  };

  return { isId, settingsCopy, settingsFormDictionary, licenseDictionary, playgroundDictionary, activationDictionary };
}
