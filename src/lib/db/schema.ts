import { sql } from "drizzle-orm";
import {
  text,
  integer,
  sqliteTable,
  real,
} from "drizzle-orm/sqlite-core";

// ─── USERS ───────────────────────────────────────────────────────────────────
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nama: text("nama").notNull(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["admin", "guru_wali"] }).notNull().default("guru_wali"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`(datetime('now','localtime'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now','localtime'))`),
});

// ─── GURU WALI ────────────────────────────────────────────────────────────────
export const guruWali = sqliteTable("guru_wali", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  namaGuru: text("nama_guru").notNull(),
  nip: text("nip"),
  noHp: text("no_hp"),
  email: text("email"),
  fotoUrl: text("foto_url"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now','localtime'))`),
});

// ─── SISWA ────────────────────────────────────────────────────────────────────
export const siswa = sqliteTable("siswa", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nisn: text("nisn").unique(),
  nama: text("nama").notNull(),
  jenisKelamin: text("jenis_kelamin", { enum: ["L", "P"] }).notNull(),
  kelas: text("kelas"),
  alamat: text("alamat"),
  noHp: text("no_hp"),
  guruWaliId: integer("guru_wali_id").references(() => guruWali.id, { onDelete: "set null" }),
  fotoUrl: text("foto_url"),
  status: text("status", { enum: ["aktif", "nonaktif"] }).notNull().default("aktif"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now','localtime'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now','localtime'))`),
});

// ─── JURNAL ───────────────────────────────────────────────────────────────────
export const jurnal = sqliteTable("jurnal", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  siswaId: integer("siswa_id").notNull().references(() => siswa.id, { onDelete: "cascade" }),
  guruWaliId: integer("guru_wali_id").notNull().references(() => guruWali.id, { onDelete: "cascade" }),
  tanggal: text("tanggal").notNull(), // YYYY-MM-DD
  kategori: text("kategori", {
    enum: ["kedisiplinan", "ibadah", "kebersihan", "akademik", "karakter", "pelanggaran", "prestasi"],
  }).notNull(),
  kegiatan: text("kegiatan").notNull(),
  catatan: text("catatan"),
  poin: real("poin").notNull().default(0),
  fotoUrl: text("foto_url"),
  createdBy: integer("created_by").notNull().references(() => users.id),
  createdAt: text("created_at").notNull().default(sql`(datetime('now','localtime'))`),
  updatedAt: text("updated_at").notNull().default(sql`(datetime('now','localtime'))`),
});

// ─── IMPORT LOGS ──────────────────────────────────────────────────────────────
export const importLogs = sqliteTable("import_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  filename: text("filename").notNull(),
  importedBy: integer("imported_by").notNull().references(() => users.id),
  totalData: integer("total_data").notNull().default(0),
  successData: integer("success_data").notNull().default(0),
  failedData: integer("failed_data").notNull().default(0),
  status: text("status", { enum: ["success", "partial", "failed"] }).notNull().default("success"),
  notes: text("notes"),
  createdAt: text("created_at").notNull().default(sql`(datetime('now','localtime'))`),
});

// ─── TYPE EXPORTS ─────────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type GuruWali = typeof guruWali.$inferSelect;
export type NewGuruWali = typeof guruWali.$inferInsert;
export type Siswa = typeof siswa.$inferSelect;
export type NewSiswa = typeof siswa.$inferInsert;
export type Jurnal = typeof jurnal.$inferSelect;
export type NewJurnal = typeof jurnal.$inferInsert;
export type ImportLog = typeof importLogs.$inferSelect;
