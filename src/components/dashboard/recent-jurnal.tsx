import { formatDateShort, KATEGORI_COLOR_MAP } from "@/lib/utils";
import { BookOpen } from "lucide-react";

interface RecentJurnalProps {
  data: {
    id: number;
    tanggal: string;
    kategori: string;
    kegiatan: string;
    poin: number;
    siswaNama: string | null;
  }[];
}

export function RecentJurnal({ data }: RecentJurnalProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h3 className="font-display font-semibold text-foreground mb-4">Jurnal Terbaru</h3>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <BookOpen size={36} className="mb-3 opacity-40" />
          <p className="text-sm">Belum ada jurnal</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors"
            >
              <div className="w-9 h-9 bg-brand-100 dark:bg-brand-900/30 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <BookOpen size={16} className="text-brand-600 dark:text-brand-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-foreground truncate">{item.siswaNama ?? "—"}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${KATEGORI_COLOR_MAP[item.kategori] ?? ""}`}>
                    {item.kategori}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.kegiatan}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-sm font-semibold ${item.poin >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {item.poin >= 0 ? "+" : ""}{item.poin}
                </p>
                <p className="text-xs text-muted-foreground">{formatDateShort(item.tanggal)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
