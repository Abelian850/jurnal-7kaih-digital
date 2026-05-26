/**
 * Seed script untuk development
 * Jalankan: npx tsx scripts/seed.ts
 * (Memerlukan wrangler untuk D1 lokal)
 */

import bcrypt from "bcryptjs";

// Data seed — paste ke Cloudflare D1 console atau jalankan via wrangler
const adminPassword = await bcrypt.hash("admin123", 12);
const guruPassword = await bcrypt.hash("guru123", 12);

const sqlStatements = `
-- Reset tables (development only)
DELETE FROM jurnal;
DELETE FROM siswa;
DELETE FROM guru_wali;
DELETE FROM users;

-- Admin user
INSERT INTO users (nama, username, password_hash, role) VALUES
  ('Administrator', 'admin', '${adminPassword}', 'admin');

-- Guru Wali users
INSERT INTO users (nama, username, password_hash, role) VALUES
  ('Bu Siti Aminah', 'siti_aminah', '${guruPassword}', 'guru_wali'),
  ('Pak Ahmad Fathoni', 'ahmad_fathoni', '${guruPassword}', 'guru_wali'),
  ('Bu Dewi Rahayu', 'dewi_rahayu', '${guruPassword}', 'guru_wali');

-- Guru wali profiles (userId 2,3,4)
INSERT INTO guru_wali (user_id, nama_guru, nip, no_hp) VALUES
  (2, 'Bu Siti Aminah', '197505152000122001', '081234567890'),
  (3, 'Pak Ahmad Fathoni', '198003202005011002', '081234567891'),
  (4, 'Bu Dewi Rahayu', '198208122006042003', '081234567892');

-- Sample siswa (guru_wali_id 1,2,3)
INSERT INTO siswa (nisn, nama, jenis_kelamin, kelas, guru_wali_id, status) VALUES
  ('0012345601', 'Muhammad Rizky', 'L', '7A', 1, 'aktif'),
  ('0012345602', 'Siti Fatimah', 'P', '7A', 1, 'aktif'),
  ('0012345603', 'Ahmad Zulkifli', 'L', '7A', 1, 'aktif'),
  ('0012345604', 'Nur Aisyah', 'P', '7B', 2, 'aktif'),
  ('0012345605', 'Hasan Mubarok', 'L', '7B', 2, 'aktif'),
  ('0012345606', 'Fatma Zahra', 'P', '7C', 3, 'aktif'),
  ('0012345607', 'Abdul Rahman', 'L', '7C', 3, 'aktif');

-- Sample jurnal
INSERT INTO jurnal (siswa_id, guru_wali_id, tanggal, kategori, kegiatan, catatan, poin, created_by) VALUES
  (1, 1, date('now'), 'kedisiplinan', 'Masuk kelas tepat waktu selama seminggu penuh', 'Alhamdulillah konsisten', 10, 2),
  (1, 1, date('now', '-1 day'), 'ibadah', 'Sholat Dhuha berjamaah', NULL, 5, 2),
  (2, 1, date('now'), 'prestasi', 'Juara 1 lomba Tahfidz tingkat kecamatan', 'Membanggakan kelas', 25, 2),
  (3, 1, date('now', '-2 days'), 'pelanggaran', 'Tidak membawa buku pelajaran', 'Sudah diberikan nasihat', -5, 2),
  (4, 2, date('now'), 'akademik', 'Nilai ujian matematika 95', 'Peningkatan signifikan', 15, 3),
  (5, 2, date('now', '-1 day'), 'kebersihan', 'Piket kelas dengan rajin', NULL, 5, 3),
  (6, 3, date('now'), 'karakter', 'Membantu teman yang kesulitan belajar', 'Sikap empati yang baik', 10, 4),
  (7, 3, date('now', '-3 days'), 'ibadah', 'Mengimami sholat dzuhur berjamaah', NULL, 10, 4);
`;

console.log("=== SQL SEED STATEMENTS ===");
console.log(sqlStatements);
console.log("\n=== Cara menggunakan: ===");
console.log("1. Buka Cloudflare Dashboard > D1 > Database Anda");
console.log("2. Klik tab 'Console'");
console.log("3. Paste SQL di atas dan klik Execute");
console.log("\nATAU via Wrangler CLI:");
console.log("wrangler d1 execute jurnal-7kaih --file=scripts/seed.sql --local");
