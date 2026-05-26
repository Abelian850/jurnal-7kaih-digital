"use client";

import { useState } from "react";
import { Download, FileText, Sheet } from "lucide-react";
import { toast } from "sonner";

export function ExportButtons() {
  const [exporting, setExporting] = useState<"pdf" | "excel" | null>(null);

  const exportPDF = async () => {
    setExporting("pdf");
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF();

      // Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("JURNAL 7KAIH DIGITAL", 14, 20);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Dicetak: ${new Date().toLocaleDateString("id-ID")}`, 14, 28);
      doc.text("Author: Abyass Walker (AW)", 14, 34);

      // Fetch data (simplified — integrate with real API call)
      const tableData = [
        ["2024-01-01", "Ahmad Fauzi", "Kedisiplinan", "Tepat waktu masuk sekolah", "10"],
      ];

      autoTable(doc, {
        head: [["Tanggal", "Siswa", "Kategori", "Kegiatan", "Poin"]],
        body: tableData,
        startY: 42,
        styles: { fontSize: 9, cellPadding: 4 },
        headStyles: { fillColor: [34, 197, 94], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 253, 244] },
      });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text("Developed by Abyass Walker (AW) | Jurnal 7KAIH Digital", 14, doc.internal.pageSize.height - 10);
        doc.text(`${i}/${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
      }

      doc.save(`jurnal-7kaih-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("PDF berhasil didownload");
    } catch {
      toast.error("Gagal export PDF");
    } finally {
      setExporting(null);
    }
  };

  const exportExcel = async () => {
    setExporting("excel");
    try {
      const XLSX = await import("xlsx");

      const ws = XLSX.utils.aoa_to_sheet([
        ["JURNAL 7KAIH DIGITAL"],
        ["Author: Abyass Walker (AW)"],
        [`Dicetak: ${new Date().toLocaleDateString("id-ID")}`],
        [],
        ["Tanggal", "NISN", "Nama Siswa", "Kelas", "Kategori", "Kegiatan", "Catatan", "Poin", "Guru Wali"],
        // Add real data here
      ]);

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Jurnal");
      XLSX.writeFile(wb, `jurnal-7kaih-${new Date().toISOString().slice(0, 10)}.xlsx`);
      toast.success("Excel berhasil didownload");
    } catch {
      toast.error("Gagal export Excel");
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={exportExcel}
        disabled={!!exporting}
        className="flex items-center gap-2 px-3 py-2 border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
      >
        <Sheet size={16} className="text-green-600" />
        {exporting === "excel" ? "..." : "Excel"}
      </button>
      <button
        onClick={exportPDF}
        disabled={!!exporting}
        className="flex items-center gap-2 px-3 py-2 border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
      >
        <FileText size={16} className="text-red-500" />
        {exporting === "pdf" ? "..." : "PDF"}
      </button>
    </div>
  );
}
