import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  remember: z.boolean().optional(),
});

export const guruWaliSchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  username: z.string().min(3, "Username minimal 3 karakter").regex(/^[a-z0-9_]+$/, "Hanya huruf kecil, angka, underscore"),
  password: z.string().min(6, "Password minimal 6 karakter").optional(),
  nip: z.string().optional(),
  noHp: z.string().optional(),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
});

export const siswaSchema = z.object({
  nisn: z.string().optional(),
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  jenisKelamin: z.enum(["L", "P"], { required_error: "Pilih jenis kelamin" }),
  kelas: z.string().optional(),
  alamat: z.string().optional(),
  noHp: z.string().optional(),
  guruWaliId: z.number({ required_error: "Pilih guru wali" }),
  status: z.enum(["aktif", "nonaktif"]).default("aktif"),
});

export const jurnalSchema = z.object({
  siswaId: z.number({ required_error: "Pilih siswa" }),
  tanggal: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal: YYYY-MM-DD"),
  kategori: z.enum(["kedisiplinan", "ibadah", "kebersihan", "akademik", "karakter", "pelanggaran", "prestasi"], {
    required_error: "Pilih kategori",
  }),
  kegiatan: z.string().min(3, "Kegiatan minimal 3 karakter"),
  catatan: z.string().optional(),
  poin: z.number().min(-100).max(100).default(0),
  fotoUrl: z.string().url().optional().or(z.literal("")),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password tidak sama",
  path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type GuruWaliInput = z.infer<typeof guruWaliSchema>;
export type SiswaInput = z.infer<typeof siswaSchema>;
export type JurnalInput = z.infer<typeof jurnalSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
