"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createGuruWali } from "@/lib/actions/guru";
import { guruWaliSchema, type GuruWaliInput } from "@/lib/validations";

export function AddGuruButton() {
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<GuruWaliInput>({
    resolver: zodResolver(guruWaliSchema),
  });

  const onSubmit = async (data: GuruWaliInput) => {
    try {
      await createGuruWali(data);
      toast.success("Guru wali berhasil ditambahkan");
      reset();
      setOpen(false);
    } catch (err) {
      toast.error((err as Error).message || "Gagal menambahkan guru wali");
    }
  };

  const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-medium text-sm rounded-xl shadow-md shadow-primary/20 hover:bg-primary/90 transition-all">
        <Plus size={18} />
        Tambah Guru Wali
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display font-semibold text-lg">Tambah Guru Wali</h2>
              <button onClick={() => setOpen(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <Field label="Nama Lengkap *" error={errors.nama?.message}>
                <input {...register("nama")} placeholder="Nama lengkap guru" className={inputClass} />
              </Field>
              <Field label="Username *" error={errors.username?.message}>
                <input {...register("username")} placeholder="username_guru" className={inputClass} />
              </Field>
              <Field label="Password *" error={errors.password?.message}>
                <input {...register("password")} type="password" placeholder="Min. 6 karakter" className={inputClass} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="NIP">
                  <input {...register("nip")} placeholder="NIP (opsional)" className={inputClass} />
                </Field>
                <Field label="No. HP">
                  <input {...register("noHp")} placeholder="08xxxxxxxxxx" className={inputClass} />
                </Field>
              </div>
              <Field label="Email" error={errors.email?.message}>
                <input {...register("email")} type="email" placeholder="email@madrasah.sch.id" className={inputClass} />
              </Field>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 px-4 py-2.5 border border-border rounded-xl text-sm hover:bg-muted transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium disabled:opacity-60">
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
