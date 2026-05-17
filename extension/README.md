# FluentRemote Extension MVP

Folder ini berisi Chrome Extension MVP yang bisa di-load melalui **Load unpacked**.

## Yang sudah bisa

- Aktivasi extension dengan `license key`
- Sync konfigurasi dari backend FluentRemote:
  - source language
  - target language
  - AI provider
  - readiness API key provider
- Highlight teks di halaman web lalu klik `Translate`
- Jika seleksi berada di `input`, `textarea`, atau `contenteditable`, extension juga bisa menampilkan alur `Replace`

## Yang dipakai extension

- `POST /api/extension/sync`
- `POST /api/extension/translate`

API key **tidak** dimasukkan di popup extension. API key tetap disimpan di halaman `Settings` web app, lalu extension mengambilnya lewat backend setelah license key valid.

## Cara install

1. Buka `chrome://extensions`
2. Aktifkan `Developer mode`
3. Klik `Load unpacked`
4. Pilih folder ini: `E:\Aplikasi\fluentremote\extension`
5. Buka popup FluentRemote
6. Pastikan `Backend URL` mengarah ke domain web app Anda
7. Paste `license key`
8. Klik `Sync extension`

## Catatan MVP

- Build ini masih MVP, jadi belum ada package `.zip` / Chrome Web Store listing.
- Popup utama hanya meminta `license key`. `Backend URL` disimpan sebagai advanced setting di options/internal config.
- Host permissions sekarang diminta secara opsional saat aktivasi, bukan langsung aktif sejak install.
