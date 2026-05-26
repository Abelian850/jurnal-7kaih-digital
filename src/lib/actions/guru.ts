"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { users, guruWali } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { guruWaliSchema, resetPasswordSchema } from "@/lib/validations";
import { getRequestContext } from "@cloudflare/next-on-pages";
import type { GuruWaliInput, ResetPasswordInput } from "@/lib/validations";

function getDBFromContext() {
  const { env } = getRequestContext();
  return getDB(env.DB);
}

export async function createGuruWali(data: GuruWaliInput) {
  const session = await auth();
  if (!session || (session.user as { role: string }).role !== "admin") throw new Error("Forbidden");

  const validated = guruWaliSchema.parse(data);
  if (!validated.password) throw new Error("Password diperlukan");

  const db = getDBFromContext();

  // Check duplicate username
  const existing = await db.select().from(users).where(eq(users.username, validated.username)).get();
  if (existing) throw new Error("Username sudah digunakan");

  const passwordHash = await bcrypt.hash(validated.password, 12);

  const [newUser] = await db.insert(users).values({
    nama: validated.nama,
    username: validated.username,
    passwordHash,
    role: "guru_wali",
  }).returning();

  await db.insert(guruWali).values({
    userId: newUser.id,
    namaGuru: validated.nama,
    nip: validated.nip ?? null,
    noHp: validated.noHp ?? null,
    email: validated.email ?? null,
  });

  revalidatePath("/admin/guru");
  return { success: true };
}

export async function updateGuruWali(id: number, data: Partial<GuruWaliInput>) {
  const session = await auth();
  if (!session || (session.user as { role: string }).role !== "admin") throw new Error("Forbidden");

  const db = getDBFromContext();
  const gw = await db.select().from(guruWali).where(eq(guruWali.id, id)).get();
  if (!gw) throw new Error("Guru wali tidak ditemukan");

  await db.update(guruWali).set({
    namaGuru: data.nama ?? gw.namaGuru,
    nip: data.nip ?? null,
    noHp: data.noHp ?? null,
    email: data.email ?? null,
  }).where(eq(guruWali.id, id));

  if (data.nama) {
    await db.update(users).set({ nama: data.nama }).where(eq(users.id, gw.userId));
  }

  revalidatePath("/admin/guru");
  return { success: true };
}

export async function deleteGuruWali(id: number) {
  const session = await auth();
  if (!session || (session.user as { role: string }).role !== "admin") throw new Error("Forbidden");

  const db = getDBFromContext();
  const gw = await db.select().from(guruWali).where(eq(guruWali.id, id)).get();
  if (!gw) throw new Error("Guru wali tidak ditemukan");

  await db.delete(users).where(eq(users.id, gw.userId));
  revalidatePath("/admin/guru");
  return { success: true };
}

export async function resetPasswordGuruWali(userId: number, data: ResetPasswordInput) {
  const session = await auth();
  if (!session || (session.user as { role: string }).role !== "admin") throw new Error("Forbidden");

  const validated = resetPasswordSchema.parse(data);
  const db = getDBFromContext();

  const passwordHash = await bcrypt.hash(validated.newPassword, 12);
  await db.update(users).set({ passwordHash }).where(eq(users.id, userId));

  return { success: true };
}

export async function getGuruWaliList() {
  const session = await auth();
  if (!session || (session.user as { role: string }).role !== "admin") throw new Error("Forbidden");

  const db = getDBFromContext();

  return db
    .select({
      id: guruWali.id,
      userId: guruWali.userId,
      namaGuru: guruWali.namaGuru,
      nip: guruWali.nip,
      noHp: guruWali.noHp,
      email: guruWali.email,
      username: users.username,
      isActive: users.isActive,
      createdAt: guruWali.createdAt,
      totalSiswa: sql<number>`(SELECT COUNT(*) FROM siswa WHERE siswa.guru_wali_id = guru_wali.id)`,
    })
    .from(guruWali)
    .leftJoin(users, eq(guruWali.userId, users.id))
    .orderBy(guruWali.namaGuru);
}
