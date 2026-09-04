// =====================================================================
// splash.js — layar pembuka yang tampil sampai halaman benar-benar siap
//
// Dipasang lewat JavaScript, bukan ditulis di tiap HTML, supaya muncul
// seketika dan seragam di keempat halaman.
// Progresnya mengikuti tahap yang benar-benar selesai, bukan animasi palsu.
// =====================================================================

const LOGO =
  '<svg viewBox="0 0 24 24" width="53" height="53" fill="#171717" ' +
  'clip-rule="evenodd" fill-rule="evenodd" xmlns="http://www.w3.org/2000/svg">' +
  '<path d="m21.25 5.5c0 .015 0 .031.002.046.011.243.115.402.241.507.134.122.312.197.507.197 0 0 .75-.043.75-.75 0-2.347-1.903-4.25-4.25-4.25-3.824 0-9.886 0-13.5 0-2.071 0-3.75 1.679-3.75 3.75s1.679 3.75 3.75 3.75h12c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-12c-1.243 0-2.25-1.007-2.25-2.25s1.007-2.25 2.25-2.25h13.5c1.519 0 2.75 1.231 2.75 2.75z"/>' +
  '<path d="m2.75 5c0-.414-.336-.75-.75-.75s-.75.336-.75.75v14c0 2.071 1.679 3.75 3.75 3.75h14c2.071 0 3.75-1.679 3.75-3.75v-8c0-2.071-1.679-3.75-3.75-3.75h-14c-1.243 0-2.25-1.007-2.25-2.25zm15.25 8.5c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5z"/>' +
  '<path d="m6 5.75h12c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-12c-.414 0-.75.336-.75.75s.336.75.75.75z"/></svg>'

const VERSI = '1.0'

let bar = null, keterangan = null, lapisan = null, sudahSelesai = false

// Tailwind dimuat lewat CDN dan belum tentu siap saat splash digambar,
// jadi gaya splash ditulis langsung agar tampilannya tidak pernah berkedip.
export function tampilkanSplash() {
  if (document.getElementById('splashApp')) return

  const el = document.createElement('div')
  el.id = 'splashApp'
  el.setAttribute('role', 'status')
  el.setAttribute('aria-live', 'polite')
  el.style.cssText =
    'position:fixed;inset:0;z-index:9999;background:#FAFAFA;' +
    'display:flex;flex-direction:column;align-items:center;justify-content:center;' +
    'font-family:Inter,system-ui,sans-serif;opacity:1;transition:opacity .28s ease'

  el.innerHTML =
    '<div style="display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 32px">' +
      LOGO +
      '<p style="margin:22px 0 0;font-size:22px;font-weight:700;color:#0A0A0A;letter-spacing:-.01em">Money Manager</p>' +
      '<p style="margin:6px 0 0;font-size:13px;color:#737373">Menyiapkan data Anda…</p>' +
      '<div style="margin-top:30px;width:180px;height:6px;border-radius:100px;background:#E5E5E5;overflow:hidden">' +
        '<div id="splashBar" style="width:8%;height:100%;border-radius:100px;background:#171717;transition:width .3s ease"></div>' +
      '</div>' +
      '<p id="splashKet" style="margin:10px 0 0;font-size:11px;color:#A1A1A1">Memuat aplikasi</p>' +
    '</div>' +
    '<p style="position:absolute;bottom:44px;margin:0;font-size:10px;color:#C4C4C4">' +
      'Money Manager · versi ' + VERSI + '</p>'

  document.body.appendChild(el)
  lapisan = el
  bar = el.querySelector('#splashBar')
  keterangan = el.querySelector('#splashKet')

  // Layar besar diberi ukuran sedikit lebih lapang, sesuai desain.
  if (window.matchMedia('(min-width: 768px)').matches) {
    el.querySelector('p').style.fontSize = '26px'
    el.querySelectorAll('p')[1].style.fontSize = '14px'
    el.querySelector('#splashBar').parentElement.style.width = '240px'
    keterangan.style.fontSize = '12px'
  }
}

export function majuSplash(persen, teks) {
  if (bar) bar.style.width = Math.max(0, Math.min(100, persen)) + '%'
  if (keterangan && teks) keterangan.textContent = teks
}

// Dipanggil ketika halaman benar-benar siap dipakai.
export function tutupSplash() {
  if (sudahSelesai || !lapisan) return
  sudahSelesai = true
  majuSplash(100, 'Siap')
  // jeda sangat singkat agar batang penuh sempat terlihat, bukan melompat
  setTimeout(() => {
    lapisan.style.opacity = '0'
    setTimeout(() => { lapisan.remove(); lapisan = null }, 300)
  }, 140)
}

// Bila terjadi kegagalan, splash tidak boleh menggantung selamanya.
export function gagalSplash(pesan) {
  if (!lapisan) return
  if (keterangan) { keterangan.textContent = pesan; keterangan.style.color = '#B91C1C' }
  if (bar) bar.style.background = '#B91C1C'
}

// Jaring pengaman: sekeras apa pun kegagalannya, splash menyerah setelah 12 detik
// agar pengguna tidak terjebak menatap layar yang tidak bergerak.
setTimeout(() => { if (!sudahSelesai) tutupSplash() }, 12000)

tampilkanSplash()
