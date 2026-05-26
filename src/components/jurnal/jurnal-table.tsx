"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { formatDateShort, KATEGORI_COLOR_MAP } from "@/lib/utils";
import { Edit2, Trash2, Image, ChevronLeft, ChevronRight } from "lucide-react";
import { deleteJurnal } from "@/lib/actions/jurnal";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

type JurnalRow = {
  id: number;
  tanggal: string;
  kategori: string;
  kegiatan: string;
  catatan: string | null;
  poin: number;
  fotoUrl: string | null;
  siswa: { id: number; nama: string; nisn: string | null; kelas: string | null } | null;
  guruWali: { id: number; namaGuru: string } | null;
};

interface JurnalTableProps {
  data: JurnalRow[];
  total: number;
  page: number;
  totalPages: number;
}

export function JurnalTable({ data, total, page, totalPages }: JurnalTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus jurnal ini?")) return;
    setDeletingId(id);
    try {
      await deleteJurnal(id);
      toast.success("Jurnal dihapus");
    } catch {
      toast.error("Gagal menghapus jurnal");
    } finally {
      setDeletingId(null);
    }
  };

  const columns: ColumnDef<JurnalRow>[] = [
    {
      header: "Tanggal",
      accessorKey: "tanggal",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {formatDateShort(row.original.tanggal)}
        </span>
      ),
    },
    {
      header: "Siswa",
      accessorKey: "siswa",
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium text-foreground">{row.original.siswa?.nama ?? "—"}</p>
          <p className="text-xs text-muted-foreground">{row.original.siswa?.kelas ?? ""}</p>
        </div>
      ),
    },
    {
      header: "Kategori",
      accessorKey: "kategori",
      cell: ({ row }) => (
        <span className={cn(
          "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium",
          KATEGORI_COLOR_MAP[row.original.kategori] ?? ""
        )}>
          {row.original.kategori}
        </span>
      ),
    },
    {
      header: "Kegiatan",
      accessorKey: "kegiatan",
      cell: ({ row }) => (
        <div className="max-w-xs">
          <p className="text-sm truncate">{row.original.kegiatan}</p>
          {row.original.catatan && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">{row.original.catatan}</p>
          )}
        </div>
      ),
    },
    {
      header: "Poin",
      accessorKey: "poin",
      cell: ({ row }) => (
        <span className={cn(
          "text-sm font-semibold",
          row.original.poin >= 0 ? "text-green-600 dark:text-green-400" : "text-red-500"
        )}>
          {row.original.poin >= 0 ? "+" : ""}{row.original.poin}
        </span>
      ),
    },
    {
      header: "Foto",
      accessorKey: "fotoUrl",
      cell: ({ row }) => row.original.fotoUrl ? (
        <a href={row.original.fotoUrl} target="_blank" rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600">
          <Image size={16} />
        </a>
      ) : <span className="text-muted-foreground text-xs">—</span>,
    },
    {
      header: "Guru Wali",
      accessorKey: "guruWali",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.guruWali?.namaGuru ?? "—"}</span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleDelete(row.original.id)}
            disabled={deletingId === row.original.id}
            className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {table.getHeaderGroups()[0].headers.map((header) => (
                <th key={header.id} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center text-muted-foreground">
                  Belum ada data jurnal
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Halaman {page} dari {totalPages} ({total} data)
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(page - 2 + i, totalPages - 4 + i));
              return (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-sm",
                    p === page ? "bg-primary text-white" : "border border-border hover:bg-muted"
                  )}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
