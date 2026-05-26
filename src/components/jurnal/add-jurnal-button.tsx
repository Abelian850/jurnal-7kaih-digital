"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { createJurnal } from "@/lib/actions/jurnal";
import { jurnalSchema, type JurnalInput } from "@/lib/validations";
import { KATEGORI_OPTIONS } from "@/lib/utils";

export function AddJurnalButton() {
  const [open, setOpen] = useState(false);
  const [fotoUrl, setFotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<JurnalInput>({
    resolver: zodResolver(jurnalSchema),
    defaultValues: {
      tanggal: new Date().toISOString().slice(0, 10),
      poin: 0,
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("File harus berupa gambar"); return; }

    setUploading(true);
    try {
      const { default: imageCompression } = await import("browser-image-compression");
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1080,
        useWebWorker: true,
        fileType: "image/webp",
      });

      const formData = new FormData();
      formData.append("file", compressed, file.name.replace(/\.[^.]+$/, ".webp"));
      formData.append("token", process.env.NEXT_PUBLIC_GAS_TOKEN ?? "");

      const res = await fetch(process.env.NEXT_PUBLIC_GAS_URL ?? "", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setFotoUrl(data.url);
        toast.success("Foto berhasil diupload");
      } else {
        throw new Error("Upload gagal");
      }
    } catch {
      toast.error("Gagal mengupload foto");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: JurnalInput) => {
    try {
      await createJurnal({ ...data, fotoUrl: fotoUrl || undefined });
      toast.success("Jurnal berhasil ditambahkan");
      reset();
      setFotoUrl("");
      setOpen(false);
    } catch (err) {
      toast.error((err as Error).message || "Gagal menambahkan jurnal");
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium text-sm rounded-xl shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all"
      >
        <Plus size={18} />
        Tambah Jurnal
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display font-semibold text-lg text-foreground">Tambah Jurnal</h2>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {/* Siswa ID */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">ID Siswa</label>
                <input
                  {...register("siswaId", { valueAsNumber: true })}
                  type="number"
                  placeholder="Masukkan ID siswa"
                  className="input-field"
                />
                {errors.siswaId && <p className="text-xs text-red-500">{errors.siswaId.message}</p>}
              </div>

              {/* Tanggal */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Tanggal</label>
                <input {...register("tanggal")} type="date" className="input-field" />
                {errors.tanggal && <p className="text-xs text-red-500">{errors.tanggal.message}</p>}
              </div>

              {/* Kategori */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Kategori</label>
                <select {...register("kategori")} className="input-field">
                  <option value="">Pilih kategori</option>
                  {KATEGORI_OPTIONS.map((k) => (
                    <option key={k.value} value={k.value}>{k.label}</option>
                  ))}
                </select>
                {errors.kategori && <p className="text-xs text-red-500">{errors.kategori.message}</p>}
              </div>

              {/* Kegiatan */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Kegiatan</label>
                <input {...register("kegiatan")} placeholder="Deskripsi kegiatan" className="input-field" />
                {errors.kegiatan && <p className="text-xs text-red-500">{errors.kegiatan.message}</p>}
              </div>

              {/* Catatan */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Catatan (opsional)</label>
                <textarea {...register("catatan")} rows={3} placeholder="Catatan tambahan..." className="input-field resize-none" />
              </div>

              {/* Poin */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Poin</label>
                <input {...register("poin", { valueAsNumber: true })} type="number" min="-100" max="100" className="input-field" />
              </div>

              {/* Foto */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Foto Dokumentasi (opsional)</label>
                <div className="border-2 border-dashed border-border rounded-xl p-4 text-center">
                  {fotoUrl ? (
                    <div className="space-y-2">
                      <img src={fotoUrl} alt="preview" className="max-h-32 mx-auto rounded-lg object-cover" />
                      <button type="button" onClick={() => setFotoUrl("")} className="text-xs text-red-500 hover:underline">
                        Hapus foto
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      {uploading ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
                      <span className="text-sm">{uploading ? "Mengupload..." : "Klik atau drag foto"}</span>
                      <span className="text-xs">Max 500KB, WEBP/JPG/PNG</span>
                      <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
                    </label>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm hover:bg-muted transition-colors">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors"
                >
                  {isSubmitting ? <><Loader2 size={16} className="animate-spin" />Menyimpan...</> : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .input-field {
          width: 100%;
          padding: 0.625rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--background));
          color: hsl(var(--foreground));
          font-size: 0.875rem;
          transition: all 0.15s;
          outline: none;
        }
        .input-field:focus {
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 3px hsl(var(--primary) / 0.15);
        }
      `}</style>
    </>
  );
}
