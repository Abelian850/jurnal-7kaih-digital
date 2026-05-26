import type { Metadata } from "next";
import { ImportSiswaClient } from "@/components/import/import-siswa-client";
import { getGuruWaliList } from "@/lib/actions/guru";
import { getDB } from "@/lib/db";
import { importLogs, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Import Data Siswa" };

export default async function AdminImportPage() {
  const [session, guruList] = await Promise.all([auth(), getGuruWaliList()]);

  const { env } = getRequestContext();
  const db = getDB(env.DB);

  const logs = await db
    .select({
      id: importLogs.id,
      filename: importLogs.filename,
      totalData: importLogs.totalData,
      successData: importLogs.successData,
      failedData: importLogs.failedData,
      status: importLogs.status,
      notes: importLogs.notes,
      createdAt: importLogs.createdAt,
      importedByName: users.nama,
    })
    .from(importLogs)
    .leftJoin(users, eq(importLogs.importedBy, users.id))
    .orderBy(desc(importLogs.createdAt))
    .limit(20);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Import Data Siswa</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Upload file CSV atau Excel untuk import data siswa secara massal
        </p>
      </div>

      <ImportSiswaClient guruList={guruList} />

      {/* Import Logs */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-display font-semibold text-foreground">Riwayat Import</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">File</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Total</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Berhasil</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Gagal</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Oleh</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground text-sm">
                    Belum ada riwayat import
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium font-mono">{log.filename}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">{log.totalData}</td>
                    <td className="px-4 py-3">
                      <span className="text-green-600 dark:text-green-400 font-medium">{log.successData}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-red-500 font-medium">{log.failedData}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                        log.status === "success"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : log.status === "partial"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                        {log.status === "success" ? "Sukses" : log.status === "partial" ? "Sebagian" : "Gagal"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{log.importedByName ?? "—"}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                      {formatDateTime(log.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
