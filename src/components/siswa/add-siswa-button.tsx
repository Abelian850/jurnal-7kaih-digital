"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createSiswa } from "@/lib/actions/siswa";
import { siswaSchema, type SiswaInput } from "@/lib/validations";

export function AddSiswaButton() {
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SiswaInput>({
    resolver: zodResolver(siswaSchema),
    defaultValues: { status: "aktif" },
  });

  const onSubmit = async (data: SiswaInput) => {
    try {
      await createSiswa(data);
      toast.success("Siswa berhasil ditambahkan");
      reset();
      setOpen(false);
    } catch (err) {
      toast.error((err as Error).message || "Gagal menambahkan siswa");
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-medium text-sm rounded-xl shadow-md shadow-primary/20 hover:bg-primary/90 transition-all">
        <Plus size={18} />
        Tambah Siswa
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display font-semibold text-lg">Tambah Siswa</h2>
              <button onClick={() => setOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-sm font-medium">Nama Lengkap *</label>
                  <input {...register("nama")} placeholder="Nama siswa" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  {errors.nama && <p className="text-xs text-red-500">{errors.nama.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">NISN</label>
                  <input {...register("nisn")} placeholder="0012345678" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Kelas</label>
                  <input {...register("kelas")} placeholder="7A" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Jenis Kelamin *</label>
                  <select {...register("jenisKelamin")} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="">Pilih</option>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                  {errors.jenisKelamin && <p className="text-xs text-red-500">{errors.jenisKelamin.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Guru Wali ID *</label>
                  <input {...register("guruWaliId", { valueAsNumber: true })} type="number" placeholder="ID guru wali" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  {errors.guruWaliId && <p className="text-xs text-red-500">{errors.guruWaliId.message}</p>}
                </div>

                <div className="col-span-2 space-y-1.5">
                  <label className="text-sm font-medium">Alamat</label>
                  <textarea {...register("alamat")} rows={2} placeholder="Alamat lengkap" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm hover:bg-muted transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors">
                  {isSubmitting ? <><Loader2 size={16} className="animate-spin" />Menyimpan...</> : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
