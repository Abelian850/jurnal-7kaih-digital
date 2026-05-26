import type { Metadata } from "next";
import { getJurnalList } from "@/lib/actions/jurnal";
import { JurnalTable } from "@/components/jurnal/jurnal-table";
import { JurnalFilter } from "@/components/jurnal/jurnal-filter";
import { AddJurnalButton } from "@/components/jurnal/add-jurnal-button";
import { ExportButtons } from "@/components/jurnal/export-buttons";

export const metadata: Metadata = { title: "Jurnal Siswa" };

interface Props {
  searchParams: Promise<{ page?: string; kategori?: string; start?: string; end?: string }>;
}

export default async function GuruJurnalPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1");

  const result = await getJurnalList({
    page, perPage: 20,
    kategori: params.kategori,
    startDate: params.start,
    endDate: params.end,
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Jurnal Siswa</h1>
          <p className="text-muted-foreground text-sm mt-1">{result.total} total entri jurnal</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButtons />
          <AddJurnalButton />
        </div>
      </div>

      <JurnalFilter currentParams={params} />
      <JurnalTable data={result.data} total={result.total} page={result.page} totalPages={result.totalPages} />
    </div>
  );
}
