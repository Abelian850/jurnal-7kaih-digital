-- ╔══════════════════════════════════════════════╗
-- ║   Jurnal 7KAIH Digital — Initial Migration   ║
-- ║   Author: Abyass Walker (AW)                 ║
-- ╚══════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS `users` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `nama` text NOT NULL,
  `username` text NOT NULL UNIQUE,
  `password_hash` text NOT NULL,
  `role` text NOT NULL DEFAULT 'guru_wali' CHECK(`role` IN ('admin', 'guru_wali')),
  `is_active` integer NOT NULL DEFAULT 1,
  `created_at` text NOT NULL DEFAULT (datetime('now','localtime')),
  `updated_at` text NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS `guru_wali` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `user_id` integer NOT NULL REFERENCES `users`(`id`) ON DELETE CASCADE,
  `nama_guru` text NOT NULL,
  `nip` text,
  `no_hp` text,
  `email` text,
  `foto_url` text,
  `created_at` text NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS `siswa` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `nisn` text UNIQUE,
  `nama` text NOT NULL,
  `jenis_kelamin` text NOT NULL CHECK(`jenis_kelamin` IN ('L', 'P')),
  `kelas` text,
  `alamat` text,
  `no_hp` text,
  `guru_wali_id` integer REFERENCES `guru_wali`(`id`) ON DELETE SET NULL,
  `foto_url` text,
  `status` text NOT NULL DEFAULT 'aktif' CHECK(`status` IN ('aktif', 'nonaktif')),
  `created_at` text NOT NULL DEFAULT (datetime('now','localtime')),
  `updated_at` text NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS `jurnal` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `siswa_id` integer NOT NULL REFERENCES `siswa`(`id`) ON DELETE CASCADE,
  `guru_wali_id` integer NOT NULL REFERENCES `guru_wali`(`id`) ON DELETE CASCADE,
  `tanggal` text NOT NULL,
  `kategori` text NOT NULL CHECK(`kategori` IN ('kedisiplinan','ibadah','kebersihan','akademik','karakter','pelanggaran','prestasi')),
  `kegiatan` text NOT NULL,
  `catatan` text,
  `poin` real NOT NULL DEFAULT 0,
  `foto_url` text,
  `created_by` integer NOT NULL REFERENCES `users`(`id`),
  `created_at` text NOT NULL DEFAULT (datetime('now','localtime')),
  `updated_at` text NOT NULL DEFAULT (datetime('now','localtime'))
);

CREATE TABLE IF NOT EXISTS `import_logs` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `filename` text NOT NULL,
  `imported_by` integer NOT NULL REFERENCES `users`(`id`),
  `total_data` integer NOT NULL DEFAULT 0,
  `success_data` integer NOT NULL DEFAULT 0,
  `failed_data` integer NOT NULL DEFAULT 0,
  `status` text NOT NULL DEFAULT 'success' CHECK(`status` IN ('success', 'partial', 'failed')),
  `notes` text,
  `created_at` text NOT NULL DEFAULT (datetime('now','localtime'))
);

-- Indexes untuk performa
CREATE INDEX IF NOT EXISTS `idx_siswa_guru_wali` ON `siswa`(`guru_wali_id`);
CREATE INDEX IF NOT EXISTS `idx_jurnal_siswa` ON `jurnal`(`siswa_id`);
CREATE INDEX IF NOT EXISTS `idx_jurnal_guru_wali` ON `jurnal`(`guru_wali_id`);
CREATE INDEX IF NOT EXISTS `idx_jurnal_tanggal` ON `jurnal`(`tanggal`);
CREATE INDEX IF NOT EXISTS `idx_jurnal_kategori` ON `jurnal`(`kategori`);
