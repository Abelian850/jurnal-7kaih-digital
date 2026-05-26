export type Role = "admin" | "guru_wali";
export type Kategori = "kedisiplinan" | "ibadah" | "kebersihan" | "akademik" | "karakter" | "pelanggaran" | "prestasi";
export type JenisKelamin = "L" | "P";
export type Status = "aktif" | "nonaktif";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface UploadResponse {
  success: boolean;
  url?: string;
  fileId?: string;
  error?: string;
}
