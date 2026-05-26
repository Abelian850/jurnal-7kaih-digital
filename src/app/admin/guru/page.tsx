import type { Metadata } from "next";
import { getGuruWaliList } from "@/lib/actions/guru";
import { GuruTable } from "@/components/guru/guru-table";
import { AddGuruButton } from "@/components/guru/add-guru-button";

export const metadata: Metadata = { title: "Manajemen Guru Wali" };

export default async function AdminGuruPage() {
  const guruList = await getGuruWaliList();

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Guru Wali</h1>
          <p className="text-muted-foreground text-sm mt-1">{guruList.length} guru wali terdaftar</p>
        </div>
        <AddGuruButton />
      </div>

      <GuruTable data={guruList} />
    </div>
  );
}
