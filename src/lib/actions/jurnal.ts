"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { jurnal, siswa, guruWali } from "@/lib/db/schema";
import { eq, and, desc, gte, lte, like, sql } from "drizzle-orm";
import { jurnalSchema } from "@/lib/validations";
import { getRequestContext } from "@cloudflare/next-on-pages";
import type { JurnalInput } from "@/lib/validations";

function getDBFromContext() {
  const { env } = getRequestContext();
  return getDB(env.DB);
}

export async function createJurnal(data: JurnalInput) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const validated = jurnalSchema.parse(data);
  const db = getDBFromContext();

  // Determine guru_wali_id from session
  let guruWaliId: number;

  if ((session.user as { role: string }).role === "admin") {
    // Admin must provide guruWaliId via siswaId lookup
    const siswaData = await db.select().from(siswa).where(eq(siswa.id, validated.siswaId)).get();
    if (!siswaData?.guruWaliId) throw new Error("Siswa belum memiliki guru wali");
    guruWaliId = siswaData.guruWaliId;
  } else {
    const gw = await db
      .select()
      .from(guruWali)
      .where(eq(guruWali.userId, parseInt((session.user as { id: string }).id)))
      .get();
    if (!gw) throw new Error("Data guru wali tidak ditemukan");
    guruWaliId = gw.id;
  }

  await db.insert(jurnal).values({
    ...validated,
    guruWaliId,
    createdBy: parseInt((session.user as { id: string }).id),
    catatan: validated.catatan ?? null,
    fotoUrl: validated.fotoUrl ?? null,
  });

  revalidatePath("/admin/jurnal");
  revalidatePath("/guru/jurnal");
  return { success: true };
}

export async function updateJurnal(id: number, data: Partial<JurnalInput>) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const db = getDBFromContext();
  const existing = await db.select().from(jurnal).where(eq(jurnal.id, id)).get();
  if (!existing) throw new Error("Jurnal tidak ditemukan");

  // Guru wali only can edit their own jurnal
  if ((session.user as { role: string }).role === "guru_wali") {
    const gw = await db
      .select()
      .from(guruWali)
      .where(eq(guruWali.userId, parseInt((session.user as { id: string }).id)))
      .get();
    if (existing.guruWaliId !== gw?.id) throw new Error("Forbidden");
  }

  await db.update(jurnal).set({ ...data, updatedAt: new Date().toISOString() }).where(eq(jurnal.id, id));
  revalidatePath("/admin/jurnal");
  revalidatePath("/guru/jurnal");
  return { success: true };
}

export async function deleteJurnal(id: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const db = getDBFromContext();
  const existing = await db.select().from(jurnal).where(eq(jurnal.id, id)).get();
  if (!existing) throw new Error("Jurnal tidak ditemukan");

  if ((session.user as { role: string }).role === "guru_wali") {
    const gw = await db
      .select()
      .from(guruWali)
      .where(eq(guruWali.userId, parseInt((session.user as { id: string }).id)))
      .get();
    if (existing.guruWaliId !== gw?.id) throw new Error("Forbidden");
  }

  await db.delete(jurnal).where(eq(jurnal.id, id));
  revalidatePath("/admin/jurnal");
  revalidatePath("/guru/jurnal");
  return { success: true };
}

export async function getJurnalList(params: {
  page?: number;
  perPage?: number;
  siswaId?: number;
  guruWaliId?: number;
  kategori?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const db = getDBFromContext();
  const { page = 1, perPage = 20, siswaId, guruWaliId, kategori, startDate, endDate } = params;

  const conditions = [];
  if (siswaId) conditions.push(eq(jurnal.siswaId, siswaId));
  if (kategori) conditions.push(eq(jurnal.kategori, kategori as "kedisiplinan"));
  if (startDate) conditions.push(gte(jurnal.tanggal, startDate));
  if (endDate) conditions.push(lte(jurnal.tanggal, endDate));

  // Restrict guru_wali to their own data
  if ((session.user as { role: string }).role === "guru_wali") {
    const gw = await db
      .select()
      .from(guruWali)
      .where(eq(guruWali.userId, parseInt((session.user as { id: string }).id)))
      .get();
    if (gw) conditions.push(eq(jurnal.guruWaliId, gw.id));
  } else if (guruWaliId) {
    conditions.push(eq(jurnal.guruWaliId, guruWaliId));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [data, countResult] = await Promise.all([
    db
      .select({
        id: jurnal.id,
        tanggal: jurnal.tanggal,
        kategori: jurnal.kategori,
        kegiatan: jurnal.kegiatan,
        catatan: jurnal.catatan,
        poin: jurnal.poin,
        fotoUrl: jurnal.fotoUrl,
        createdAt: jurnal.createdAt,
        siswa: {
          id: siswa.id,
          nama: siswa.nama,
          nisn: siswa.nisn,
          kelas: siswa.kelas,
        },
        guruWali: {
          id: guruWali.id,
          namaGuru: guruWali.namaGuru,
        },
      })
      .from(jurnal)
      .leftJoin(siswa, eq(jurnal.siswaId, siswa.id))
      .leftJoin(guruWali, eq(jurnal.guruWaliId, guruWali.id))
      .where(whereClause)
      .orderBy(desc(jurnal.tanggal), desc(jurnal.createdAt))
      .limit(perPage)
      .offset((page - 1) * perPage),

    db
      .select({ count: sql<number>`count(*)` })
      .from(jurnal)
      .where(whereClause),
  ]);

  return {
    data,
    total: countResult[0]?.count ?? 0,
    page,
    perPage,
    totalPages: Math.ceil((countResult[0]?.count ?? 0) / perPage),
  };
}

export async function getDashboardStats() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const db = getDBFromContext();
  const isAdmin = (session.user as { role: string }).role === "admin";

  let guruWaliFilter = undefined;
  if (!isAdmin) {
    const gw = await db
      .select()
      .from(guruWali)
      .where(eq(guruWali.userId, parseInt((session.user as { id: string }).id)))
      .get();
    guruWaliFilter = gw?.id;
  }

  const jurnalWhere = guruWaliFilter ? eq(jurnal.guruWaliId, guruWaliFilter) : undefined;
  const siswaWhere = guruWaliFilter ? eq(siswa.guruWaliId, guruWaliFilter) : undefined;

  const [totalSiswa, totalJurnal, recentJurnal, kategoriStats] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(siswa).where(siswaWhere),
    db.select({ count: sql<number>`count(*)` }).from(jurnal).where(jurnalWhere),
    db
      .select({
        id: jurnal.id,
        tanggal: jurnal.tanggal,
        kategori: jurnal.kategori,
        kegiatan: jurnal.kegiatan,
        poin: jurnal.poin,
        siswaNama: siswa.nama,
      })
      .from(jurnal)
      .leftJoin(siswa, eq(jurnal.siswaId, siswa.id))
      .where(jurnalWhere)
      .orderBy(desc(jurnal.createdAt))
      .limit(5),
    db
      .select({
        kategori: jurnal.kategori,
        count: sql<number>`count(*)`,
      })
      .from(jurnal)
      .where(jurnalWhere)
      .groupBy(jurnal.kategori),
  ]);

  return {
    totalSiswa: totalSiswa[0]?.count ?? 0,
    totalJurnal: totalJurnal[0]?.count ?? 0,
    recentJurnal,
    kategoriStats,
  };
}
