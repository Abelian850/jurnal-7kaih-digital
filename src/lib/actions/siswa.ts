"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { siswa, guruWali, importLogs } from "@/lib/db/schema";
import { eq, like, and, desc, sql } from "drizzle-orm";
import { siswaSchema } from "@/lib/validations";
import { getRequestContext } from "@cloudflare/next-on-pages";
import type { SiswaInput } from "@/lib/validations";

function getDBFromContext() {
  const { env } = getRequestContext();
  return getDB(env.DB);
}

export async function createSiswa(data: SiswaInput) {
  const session = await auth();
  if (!session || (session.user as { role: string }).role !== "admin") throw new Error("Forbidden");

  const validated = siswaSchema.parse(data);
  const db = getDBFromContext();

  await db.insert(siswa).values({
    ...validated,
    nisn: validated.nisn ?? null,
    kelas: validated.kelas ?? null,
    alamat: validated.alamat ?? null,
    noHp: validated.noHp ?? null,
  });

  revalidatePath("/admin/siswa");
  return { success: true };
}

export async function updateSiswa(id: number, data: Partial<SiswaInput>) {
  const session = await auth();
  if (!session || (session.user as { role: string }).role !== "admin") throw new Error("Forbidden");

  const db = getDBFromContext();
  await db.update(siswa).set({ ...data, updatedAt: new Date().toISOString() }).where(eq(siswa.id, id));
  revalidatePath("/admin/siswa");
  return { success: true };
}

export async function deleteSiswa(id: number) {
  const session = await auth();
  if (!session || (session.user as { role: string }).role !== "admin") throw new Error("Forbidden");

  const db = getDBFromContext();
  await db.delete(siswa).where(eq(siswa.id, id));
  revalidatePath("/admin/siswa");
  return { success: true };
}

export async function getSiswaList(params: {
  page?: number;
  perPage?: number;
  search?: string;
  guruWaliId?: number;
  status?: string;
}) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const db = getDBFromContext();
  const { page = 1, perPage = 20, search, guruWaliId, status } = params;

  const conditions = [];
  if (search) conditions.push(like(siswa.nama, `%${search}%`));
  if (status) conditions.push(eq(siswa.status, status as "aktif" | "nonaktif"));

  // Restrict guru_wali
  if ((session.user as { role: string }).role === "guru_wali") {
    const gw = await db
      .select()
      .from(guruWali)
      .where(eq(guruWali.userId, parseInt((session.user as { id: string }).id)))
      .get();
    if (gw) conditions.push(eq(siswa.guruWaliId, gw.id));
  } else if (guruWaliId) {
    conditions.push(eq(siswa.guruWaliId, guruWaliId));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [data, countResult] = await Promise.all([
    db
      .select({
        id: siswa.id,
        nisn: siswa.nisn,
        nama: siswa.nama,
        jenisKelamin: siswa.jenisKelamin,
        kelas: siswa.kelas,
        status: siswa.status,
        fotoUrl: siswa.fotoUrl,
        guruWali: {
          id: guruWali.id,
          namaGuru: guruWali.namaGuru,
        },
      })
      .from(siswa)
      .leftJoin(guruWali, eq(siswa.guruWaliId, guruWali.id))
      .where(whereClause)
      .orderBy(siswa.nama)
      .limit(perPage)
      .offset((page - 1) * perPage),

    db.select({ count: sql<number>`count(*)` }).from(siswa).where(whereClause),
  ]);

  return {
    data,
    total: countResult[0]?.count ?? 0,
    page,
    perPage,
    totalPages: Math.ceil((countResult[0]?.count ?? 0) / perPage),
  };
}

export async function importSiswaFromCSV(rows: Omit<SiswaInput, "guruWaliId">[], guruWaliId: number, filename: string) {
  const session = await auth();
  if (!session || (session.user as { role: string }).role !== "admin") throw new Error("Forbidden");

  const db = getDBFromContext();
  let successCount = 0;
  let failedCount = 0;

  for (const row of rows) {
    try {
      // Check duplicate NISN
      if (row.nisn) {
        const existing = await db.select().from(siswa).where(eq(siswa.nisn, row.nisn)).get();
        if (existing) { failedCount++; continue; }
      }

      await db.insert(siswa).values({
        nisn: row.nisn ?? null,
        nama: row.nama,
        jenisKelamin: row.jenisKelamin,
        kelas: row.kelas ?? null,
        alamat: row.alamat ?? null,
        noHp: row.noHp ?? null,
        guruWaliId,
        status: "aktif",
      });
      successCount++;
    } catch {
      failedCount++;
    }
  }

  // Log import
  await db.insert(importLogs).values({
    filename,
    importedBy: parseInt((session.user as { id: string }).id),
    totalData: rows.length,
    successData: successCount,
    failedData: failedCount,
    status: failedCount === 0 ? "success" : successCount === 0 ? "failed" : "partial",
  });

  revalidatePath("/admin/siswa");
  revalidatePath("/admin/import");

  return { success: true, successCount, failedCount };
}
