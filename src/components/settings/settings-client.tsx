"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Shield, User, Info } from "lucide-react";
import { resetPasswordGuruWali } from "@/lib/actions/guru";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations";

export function SettingsClient({ userId, userName }: { userId: number; userName: string }) {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "about">("profile");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onResetPassword = async (data: ResetPasswordInput) => {
    try {
      await resetPasswordGuruWali(userId, data);
      toast.success("Password berhasil diubah");
      reset();
    } catch {
      toast.error("Gagal mengubah password");
    }
  };

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "security", label: "Keamanan", icon: Shield },
    { id: "about", label: "Tentang", icon: Info },
  ] as const;

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

  return (
    <div className="max-w-2xl space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-display font-semibold text-foreground">Informasi Profil</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              {userName.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-lg text-foreground">{userName}</p>
              <span className="px-2.5 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-lg text-xs font-medium">
                Administrator
              </span>
            </div>
          </div>
          <div className="pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Untuk mengubah nama atau username, hubungi pengembang sistem.
            </p>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="font-display font-semibold text-foreground">Ubah Password</h2>
          <form onSubmit={handleSubmit(onResetPassword)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Password Baru</label>
              <input {...register("newPassword")} type="password" placeholder="Min. 6 karakter" className={inputClass} />
              {errors.newPassword && <p className="text-xs text-red-500">{errors.newPassword.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Konfirmasi Password</label>
              <input {...register("confirmPassword")} type="password" placeholder="Ulangi password baru" className={inputClass} />
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors"
            >
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" />Menyimpan...</> : "Simpan Password"}
            </button>
          </form>
        </div>
      )}

      {/* About Tab */}
      {activeTab === "about" && (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
          <h2 className="font-display font-semibold text-foreground">Tentang Aplikasi</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Nama Aplikasi</span>
              <span className="font-medium">Jurnal 7KAIH Digital</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Versi</span>
              <span className="font-medium font-mono">1.0.0</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Developer</span>
              <span className="font-medium">Abyass Walker (AW)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Stack</span>
              <span className="font-medium text-right">Next.js 15 + Cloudflare D1</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Framework</span>
              <span className="font-medium">Next.js App Router + Drizzle ORM</span>
            </div>
          </div>
          <div className="pt-4 border-t border-border bg-muted/50 rounded-xl p-4">
            <p className="text-xs text-muted-foreground text-center">
              Developed by <span className="font-semibold text-foreground">Abyass Walker (AW)</span>
              <br />Jurnal 7KAIH Digital © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
