import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { SettingsClient } from "@/components/settings/settings-client";

export const metadata: Metadata = { title: "Pengaturan" };

export default async function AdminSettingsPage() {
  const session = await auth();
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Pengaturan</h1>
        <p className="text-muted-foreground text-sm mt-1">Kelola akun dan konfigurasi sistem</p>
      </div>
      <SettingsClient userId={parseInt((session?.user as { id: string })?.id ?? "0")} userName={session?.user.name ?? ""} />
    </div>
  );
}
