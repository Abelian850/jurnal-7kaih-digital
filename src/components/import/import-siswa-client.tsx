"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Upload, FileText, X, CheckCircle, AlertCircle, Download, Loader2 } from "lucide-react";
import { importSiswaFromCSV } from "@/lib/actions/siswa";

type PreviewRow = {
  nisn?: string;
  nama: string;
  jenisKelamin: string;
  kelas?: string;
  alamat?: string;
  noHp?: string;
  _valid: boolean;
  _error?: string;
};

interface ImportSiswaClientProps {
  guruList: { id: number; namaGuru: string }[];
}

export function ImportSiswaClient({ guruList }: ImportSiswaClientProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [selectedGuruId, setSelectedGuruId] = useState<number>(0);
  const [importing, setImporting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [result, setResult] = useState<{ success: number; failed: number } | null>(null);

  const parseFile = async (f: File) => {
    setFile(f);
    setResult(null);

    try {
      if (f.name.endsWith(".csv")) {
        const Papa = (await import("papaparse")).default;
        const text = await f.text();
        Papa.parse<Record<string, string>>(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const rows = results.data.map(validateRow);
            setPreview(rows);
          },
        });
      } else {
        const XLSX = await import("xlsx");
        const buffer = await f.arrayBuffer();
        const wb = XLSX.read(buffer);
        const ws = wb.Sheets[wb.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json<Record<string, string>>(ws);
        setPreview(raw.map(validateRow));
      }
    } catch {
      toast.error("Gagal membaca file");
    }
  };

  const validateRow = (row: Record<string, string>): PreviewRow => {
    const nama = row["nama"] || row["Nama"] || row["NAMA"] || "";
    const jenisKelamin = row["jenis_kelamin"] || row["Jenis Kelamin"] || row["JK"] || row["L/P"] || "";
    const jkNorm = jenisKelamin.toUpperCase().startsWith("L") ? "L" : jenisKelamin.toUpperCase().startsWith("P") ? "P" : "";

    if (!nama) return { nama: "", jenisKelamin: "", _valid: false, _error: "Nama kosong" };
    if (!jkNorm) return {
      nama, jenisKelamin,
      nisn: row["nisn"] || row["NISN"] || undefined,
      kelas: row["kelas"] || row["Kelas"] || undefined,
      _valid: false, _error: "Jenis kelamin tidak valid (gunakan L/P)"
    };

    return {
      nisn: row["nisn"] || row["NISN"] || undefined,
      nama,
      jenisKelamin: jkNorm,
      kelas: row["kelas"] || row["Kelas"] || undefined,
      alamat: row["alamat"] || row["Alamat"] || undefined,
      noHp: row["no_hp"] || row["No HP"] || row["noHp"] || undefined,
      _valid: true,
    };
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.name.endsWith(".csv") || f.name.endsWith(".xlsx") || f.name.endsWith(".xls"))) {
      parseFile(f);
    } else {
      toast.error("File harus berformat CSV atau Excel (.xlsx/.xls)");
    }
  }, []);

  const handleImport = async () => {
    if (!selectedGuruId) { toast.error("Pilih guru wali terlebih dahulu"); return; }
    const validRows = preview.filter((r) => r._valid);
    if (validRows.length === 0) { toast.error("Tidak ada data valid untuk diimport"); return; }

    setImporting(true);
    try {
      const res = await importSiswaFromCSV(
        validRows.map(({ _valid, _error, ...r }) => r as Parameters<typeof importSiswaFromCSV>[0][0]),
        selectedGuruId,
        file?.name ?? "import.csv"
      );
      setResult({ success: res.successCount, failed: res.failedCount });
      toast.success(`Import selesai: ${res.successCount} berhasil, ${res.failedCount} gagal`);
    } catch (err) {
      toast.error((err as Error).message || "Import gagal");
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = (type: "csv" | "excel") => {
    const headers = ["nisn", "nama", "jenis_kelamin", "kelas", "alamat", "no_hp"];
    const sample = ["0012345678", "Ahmad Fauzi", "L", "7A", "Jl. Contoh No. 1", "08123456789"];

    if (type === "csv") {
      const content = [headers.join(","), sample.join(",")].join("\n");
      const blob = new Blob([content], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "template-import-siswa.csv"; a.click();
    } else {
      import("xlsx").then((XLSX) => {
        const ws = XLSX.utils.aoa_to_sheet([headers, sample]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Siswa");
        XLSX.writeFile(wb, "template-import-siswa.xlsx");
      });
    }
    toast.success("Template berhasil didownload");
  };

  const validCount = preview.filter((r) => r._valid).length;
  const invalidCount = preview.filter((r) => !r._valid).length;

  return (
    <div className="space-y-6">
      {/* Download Templates */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-display font-semibold text-foreground mb-3">Download Template</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Gunakan template berikut agar format data sesuai. Kolom wajib: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">nama</code>, <code className="bg-muted px-1.5 py-0.5 rounded text-xs">jenis_kelamin</code>
        </p>
        <div className="flex gap-3">
          <button onClick={() => downloadTemplate("csv")}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm hover:bg-muted transition-colors">
            <Download size={16} className="text-blue-500" />
            Template CSV
          </button>
          <button onClick={() => downloadTemplate("excel")}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm hover:bg-muted transition-colors">
            <Download size={16} className="text-green-600" />
            Template Excel
          </button>
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-display font-semibold text-foreground mb-4">Upload File</h3>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
            isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"
          }`}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <Upload size={36} className={`mx-auto mb-3 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
          <p className="font-medium text-foreground">
            {file ? file.name : "Drag & drop atau klik untuk upload"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Mendukung format CSV, XLSX, XLS</p>
          <input
            id="file-upload"
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) parseFile(f); }}
          />
        </div>

        {file && (
          <button onClick={() => { setFile(null); setPreview([]); setResult(null); }}
            className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-500 transition-colors">
            <X size={14} />
            Hapus file
          </button>
        )}
      </div>

      {/* Preview Table */}
      {preview.length > 0 && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="font-display font-semibold text-foreground">Preview Data</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {preview.length} baris ditemukan —{" "}
                <span className="text-green-600 font-medium">{validCount} valid</span>
                {invalidCount > 0 && <>, <span className="text-red-500 font-medium">{invalidCount} error</span></>}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedGuruId}
                onChange={(e) => setSelectedGuruId(Number(e.target.value))}
                className="px-3 py-2 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value={0}>-- Pilih Guru Wali --</option>
                {guruList.map((g) => (
                  <option key={g.id} value={g.id}>{g.namaGuru}</option>
                ))}
              </select>
              <button
                onClick={handleImport}
                disabled={importing || validCount === 0 || !selectedGuruId}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {importing ? <><Loader2 size={16} className="animate-spin" />Importing...</> : `Import ${validCount} Data`}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm">
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">#</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">NISN</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Nama</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">JK</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Kelas</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {preview.map((row, i) => (
                  <tr key={i} className={`${row._valid ? "hover:bg-muted/30" : "bg-red-50/50 dark:bg-red-900/10"} transition-colors`}>
                    <td className="px-4 py-2.5 text-muted-foreground">{i + 1}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{row.nisn ?? "—"}</td>
                    <td className="px-4 py-2.5 font-medium">{row.nama || <span className="text-red-500 italic">kosong</span>}</td>
                    <td className="px-4 py-2.5">{row.jenisKelamin || "—"}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{row.kelas ?? "—"}</td>
                    <td className="px-4 py-2.5">
                      {row._valid
                        ? <CheckCircle size={16} className="text-green-500" />
                        : <span className="flex items-center gap-1 text-red-500 text-xs"><AlertCircle size={14} />{row._error}</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={`rounded-2xl p-5 border ${result.failed === 0 ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800" : "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"}`}>
          <div className="flex items-center gap-3">
            <CheckCircle size={24} className={result.failed === 0 ? "text-green-600" : "text-yellow-600"} />
            <div>
              <p className="font-semibold text-foreground">Import Selesai</p>
              <p className="text-sm text-muted-foreground">
                {result.success} data berhasil diimport
                {result.failed > 0 && `, ${result.failed} data gagal (duplikat/error)`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
