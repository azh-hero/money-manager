// =====================================================================
// config.js — pengaturan bersama untuk semua halaman
// Kunci hanya ditulis di file ini, tidak diulang di halaman lain.
// =====================================================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// ====== GANTI DUA BARIS DI BAWAH INI ======
export const SUPABASE_URL = 'TEMPEL_PROJECT_URL_DI_SINI'
export const SUPABASE_ANON_KEY = 'TEMPEL_ANON_PUBLIC_KEY_DI_SINI'
// ==========================================

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)


// --- Ambil profil user yang sedang login (nama, role, status aktif) ---
export async function getProfile() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (error) return null
  return data
}


// --- Dipakai di halaman yang wajib login. Menendang keluar bila belum login. ---
export async function requireLogin() {
  const profile = await getProfile()
  if (!profile) {
    window.location.replace('index.html')
    return null
  }
  return profile
}


// --- Dipakai di halaman dashboard. Hanya admin & superadmin yang boleh. ---
export async function requireDashboardAccess() {
  const profile = await requireLogin()
  if (!profile) return null
  if (profile.role !== 'admin' && profile.role !== 'superadmin') {
    window.location.replace('app.html')
    return null
  }
  return profile
}


export async function logout() {
  await supabase.auth.signOut()
  window.location.replace('index.html')
}


// --- Format angka jadi 1.250.000 ---
export function rupiah(n) {
  const angka = Number(n) || 0
  return angka.toLocaleString('id-ID', { maximumFractionDigits: 0 })
}


// --- Nama perangkat, untuk catatan sesi login ---
export function deviceLabel() {
  const ua = navigator.userAgent
  let browser = 'Browser'
  if (ua.includes('Edg/')) browser = 'Edge'
  else if (ua.includes('Chrome/')) browser = 'Chrome'
  else if (ua.includes('Safari/')) browser = 'Safari'
  else if (ua.includes('Firefox/')) browser = 'Firefox'

  let os = 'Perangkat'
  if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'
  else if (ua.includes('Mac')) os = 'macOS'

  return browser + ' — ' + os
}


// --- Inisial nama, untuk avatar bulat ---
export function initials(nama) {
  return (nama || '?')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
