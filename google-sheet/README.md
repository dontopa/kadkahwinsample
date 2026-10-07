# Sambung RSVP & Ucapan ke Google Sheet

1. Buat Google Sheet baharu (contoh nama: **Kad Kahwin WanDay**).
2. Dalam Sheet: **Extensions → Apps Script**.
3. Padam kod sedia ada, tampal semua isi `Code.gs`, dan tukar `KUNCI_RSVP` kepada kata laluan sendiri. Tekan **Save**.
4. **Deploy → New deployment** → ikon gear → **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Tekan **Deploy**, benarkan akses (Authorize) bila diminta.
5. Salin **Web app URL** (berakhir dengan `/exec`).
6. Tampal URL itu dalam `config.js` di root repo:
   `window.KAD_API = 'https://script.google.com/macros/s/XXXX/exec';`
7. Commit & push — Netlify akan deploy semula.

Helaian **RSVP** dan **Ucapan** dicipta sendiri pada penghantaran pertama.

## Lihat RSVP

- Kad lelaki: `https://kadkahwincth.netlify.app/rsvp/?kunci=KUNCI_ANDA`
- Kad perempuan: `https://kadkahwincth.netlify.app/perempuan/rsvp/?kunci=KUNCI_ANDA`

Atau buka terus Google Sheet tersebut.

## Bila ubah Code.gs

Selepas edit kod: **Deploy → Manage deployments → Edit (pensel) → Version: New version → Deploy**.
URL kekal sama.
