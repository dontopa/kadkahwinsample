/**
 * API kad kahwin digital — simpan RSVP & Ucapan dalam Google Sheet ini.
 * Satu Sheet untuk kedua-dua kad (lajur "Kad" = lelaki / perempuan).
 *
 * Tukar KUNCI_RSVP kepada kata laluan anda sendiri. Kunci ini diperlukan
 * untuk melihat senarai RSVP di /rsvp/ dan /perempuan/rsvp/.
 */
const KUNCI_RSVP = 'tukar-kunci-ini';

const KAD = ['lelaki', 'perempuan'];

function doPost(e) {
  const p = e.parameter || {};
  if (p.website) return json_({ ok: true }); // perangkap bot
  const kad = KAD.indexOf(p.kad) >= 0 ? p.kad : 'lelaki';
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    if (p.jenis === 'rsvp') {
      const nama = bersih_(p.nama, 80);
      if (!nama) return json_({ ok: false, ralat: 'Nama kosong' });
      const hadir = p.hadir === 'Hadir';
      helaian_('RSVP', ['Masa', 'Kad', 'Nama', 'Kehadiran', 'Bilangan'])
        .appendRow([new Date(), kad, nama, hadir ? 'Hadir' : 'Tidak Hadir', hadir ? Math.min(20, Math.max(1, parseInt(p.bil, 10) || 1)) : 0]);
    } else if (p.jenis === 'ucapan') {
      const nama = bersih_(p.nama, 80), ucapan = bersih_(p.ucapan, 500);
      if (!nama || !ucapan) return json_({ ok: false, ralat: 'Nama atau ucapan kosong' });
      helaian_('Ucapan', ['Masa', 'Kad', 'Nama', 'Ucapan']).appendRow([new Date(), kad, nama, ucapan]);
    } else {
      return json_({ ok: false, ralat: 'Jenis tidak sah' });
    }
  } finally {
    lock.releaseLock();
  }
  return json_({ ok: true });
}

function doGet(e) {
  const p = e.parameter || {};
  const kad = KAD.indexOf(p.kad) >= 0 ? p.kad : 'lelaki';
  if (p.jenis === 'ucapan') {
    const data = baris_('Ucapan', kad).slice(-300).reverse()
      .map(r => ({ masa: r[0], nama: String(r[2]), ucapan: String(r[3]) }));
    return json_({ ok: true, data: data });
  }
  if (p.jenis === 'rsvp') {
    if (p.kunci !== KUNCI_RSVP) return json_({ ok: false, ralat: 'Kunci salah' });
    const data = baris_('RSVP', kad).reverse()
      .map(r => ({ masa: r[0], nama: String(r[2]), hadir: String(r[3]), bil: Number(r[4]) || 0 }));
    return json_({ ok: true, data: data });
  }
  return json_({ ok: true, mesej: 'API kad kahwin aktif' });
}

function helaian_(nama, kepala) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(nama);
  if (!sh) {
    sh = ss.insertSheet(nama);
    sh.appendRow(kepala);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, kepala.length).setFontWeight('bold');
  }
  return sh;
}

function baris_(nama, kad) {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nama);
  if (!sh || sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues().filter(r => r[1] === kad);
}

// Elak suntikan formula (=, +, -, @) dan hadkan panjang teks
function bersih_(v, maks) {
  v = String(v || '').trim().slice(0, maks);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
