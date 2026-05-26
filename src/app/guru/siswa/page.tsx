import type { Metadata } from "next";
import { getSiswaList } from "@/lib/actions/siswa";
import { SiswaTable } from "@/components/siswa/siswa-table";

export const metadata: Metadata = { title: "Siswa Bimbingan" };

interface Props {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function GuruSiswaPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");

  const result = await getSiswaList({ page, perPage: 20, search: params.search });

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Siswa Bimbingan</h1>
        <p className="text-muted-foreground text-sm mt-1">{result.total} siswa dalam bimbingan Anda</p>
      </div>

      <form className="flex gap-3">
        <input
          name="search"
          defaultValue={params.search}
          placeholder="Cari nama siswa..."
          className="flex-1 max-w-sm px-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button type="submit" className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
          Cari
        </button>
      </form>

      <SiswaTable data={result.data} total={result.total} page={result.page} totalPages={result.totalPages} />
    </div>
  );
}
