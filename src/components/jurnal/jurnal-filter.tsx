"use client";

import { useRouter, usePathname } from "next/navigation";
import { KATEGORI_OPTIONS } from "@/lib/utils";
import { Search, Filter, X } from "lucide-react";

interface JurnalFilterProps {
  currentParams: Record<string, string | undefined>;
}

export function JurnalFilter({ currentParams }: JurnalFilterProps) {
  const router = useRouter();
  const pathname = usePathname();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams();
    Object.entries(currentParams).forEach(([k, v]) => {
      if (v && k !== "page") params.set(k, v);
    });
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAll = () => router.push(pathname);
  const hasFilters = Object.values(currentParams).some(Boolean);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={currentParams.kategori ?? ""}
        onChange={(e) => updateParam("kategori", e.target.value)}
        className="px-3 py-2 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <option value="">Semua Kategori</option>
        {KATEGORI_OPTIONS.map((k) => (
          <option key={k.value} value={k.value}>{k.label}</option>
        ))}
      </select>

      <input
        type="date"
        value={currentParams.start ?? ""}
        onChange={(e) => updateParam("start", e.target.value)}
        className="px-3 py-2 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        placeholder="Dari tanggal"
      />

      <input
        type="date"
        value={currentParams.end ?? ""}
        onChange={(e) => updateParam("end", e.target.value)}
        className="px-3 py-2 rounded-xl border border-border bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        placeholder="Sampai tanggal"
      />

      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={14} />
          Hapus Filter
        </button>
      )}
    </div>
  );
}
