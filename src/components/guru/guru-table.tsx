"use client";

import { useReactTable, getCoreRowModel, flexRender, type ColumnDef } from "@tanstack/react-table";
import { Trash2, Key, Users } from "lucide-react";
import { deleteGuruWali } from "@/lib/actions/guru";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type GuruRow = {
  id: number;
  userId: number;
  namaGuru: string;
  nip: string | null;
  noHp: string | null;
  email: string | null;
  username: string | null;
  isActive: boolean | null;
  createdAt: string;
  totalSiswa: number;
};

export function GuruTable({ data }: { data: GuruRow[] }) {
  const handleDelete = async (id: number, nama: string) => {
    if (!confirm(`Hapus guru wali "${nama}"? Semua data terkait akan terpengaruh.`)) return;
    try {
      await deleteGuruWali(id);
      toast.success("Guru wali dihapus");
    } catch {
      toast.error("Gagal menghapus");
    }
  };

  const columns: ColumnDef<GuruRow>[] = [
    {
      header: "Guru Wali",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0">
            {row.original.namaGuru.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium">{row.original.namaGuru}</p>
            <p className="text-xs text-muted-foreground">@{row.original.username}</p>
          </div>
        </div>
      ),
    },
    {
      header: "NIP",
      cell: ({ row }) => <span className="text-sm font-mono text-muted-foreground">{row.original.nip ?? "—"}</span>,
    },
    {
      header: "No. HP",
      cell: ({ row }) => <span className="text-sm">{row.original.noHp ?? "—"}</span>,
    },
    {
      header: "Siswa",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <Users size={14} className="text-muted-foreground" />
          <span className="text-sm font-medium">{row.original.totalSiswa}</span>
        </div>
      ),
    },
    {
      header: "Status",
      cell: ({ row }) => (
        <span className={cn(
          "px-2.5 py-1 rounded-lg text-xs font-medium",
          row.original.isActive
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-gray-100 text-gray-600"
        )}>
          {row.original.isActive ? "Aktif" : "Non-aktif"}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleDelete(row.original.id, row.original.namaGuru)}
            className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

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
                  Belum ada guru wali
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
    </div>
  );
}
