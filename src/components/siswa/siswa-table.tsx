"use client";

import { useState } from "react";
import { useReactTable, getCoreRowModel, flexRender, type ColumnDef } from "@tanstack/react-table";
import { Trash2, ChevronLeft, ChevronRight, User } from "lucide-react";
import { deleteSiswa } from "@/lib/actions/siswa";
import { toast } from "sonner";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type SiswaRow = {
  id: number;
  nisn: string | null;
  nama: string;
  jenisKelamin: string;
  kelas: string | null;
  status: string;
  fotoUrl: string | null;
  guruWali: { id: number; namaGuru: string } | null;
};

interface Props {
  data: SiswaRow[];
  total: number;
  page: number;
  totalPages: number;
}

export function SiswaTable({ data, total, page, totalPages }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleDelete = async (id: number, nama: string) => {
    if (!confirm(`Hapus siswa "${nama}"?`)) return;
    try {
      await deleteSiswa(id);
      toast.success("Siswa dihapus");
    } catch {
      toast.error("Gagal menghapus");
    }
  };

  const columns: ColumnDef<SiswaRow>[] = [
    {
      header: "Siswa",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0">
            {row.original.nama.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium">{row.original.nama}</p>
            <p className="text-xs text-muted-foreground">NISN: {row.original.nisn ?? "—"}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Kelas",
      accessorKey: "kelas",
      cell: ({ row }) => <span className="text-sm">{row.original.kelas ?? "—"}</span>,
    },
    {
      header: "JK",
      cell: ({ row }) => (
        <span className={cn(
          "px-2 py-0.5 rounded-lg text-xs font-medium",
          row.original.jenisKelamin === "L"
            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
            : "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400"
        )}>
          {row.original.jenisKelamin === "L" ? "Laki-laki" : "Perempuan"}
        </span>
      ),
    },
    {
      header: "Guru Wali",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.guruWali?.namaGuru ?? "—"}</span>,
    },
    {
      header: "Status",
      cell: ({ row }) => (
        <span className={cn(
          "px-2.5 py-1 rounded-lg text-xs font-medium",
          row.original.status === "aktif"
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
        )}>
          {row.original.status === "aktif" ? "Aktif" : "Non-aktif"}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <button
          onClick={() => handleDelete(row.original.id, row.original.nama)}
          className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <Trash2 size={14} />
        </button>
      ),
    },
  ];

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {table.getHeaderGroups()[0].headers.map((h) => (
                <th key={h.id} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center text-muted-foreground">
                  <User size={36} className="mx-auto mb-3 opacity-30" />
                  <p>Belum ada data siswa</p>
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">Halaman {page} dari {totalPages} ({total} data)</p>
          <div className="flex items-center gap-1">
            <button onClick={() => goToPage(page - 1)} disabled={page <= 1}
              className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-50">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-50">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
