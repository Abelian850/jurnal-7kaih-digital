import type { Metadata } from "next";
import { getSiswaList } from "@/lib/actions/siswa";
import { SiswaTable } from "@/components/siswa/siswa-table";
import { AddSiswaButton } from "@/components/siswa/add-siswa-button";
import { ExportButtons } from "@/components/jurnal/export-buttons";

export const metadata: Metadata = { title: "Data Siswa" };

interface Props {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}

export default async function AdminSiswaPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");

  const result = await getSiswaList({
    page,
    perPage: 20,
    search: params.search,
    status: params.status,
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Data Siswa</h1>
          <p className="text-muted-foreground text-sm mt-1">{result.total} total siswa terdaftar</p>
        </div>
        <AddSiswaButton />
      </div>

      {/* Search */}
      <form className="flex gap-3">
        <input
          name="search"
          defaultValue={params.search}
          placeholder="Cari nama siswa..."
          className="flex-1 max-w-sm px-4 py-2.5 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <select
          name="status"
          defaultValue={params.status}
          className="px-3 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none"
        >
          <option value="">Semua Status</option>
          <option value="aktif">Aktif</option>
          <option value="nonaktif">Non-aktif</option>
        </select>
        <button type="submit" className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
          Cari
        </button>
      </form>

      <SiswaTable data={result.data} total={result.total} page={result.page} totalPages={result.totalPages} />
    </div>
  );
}
