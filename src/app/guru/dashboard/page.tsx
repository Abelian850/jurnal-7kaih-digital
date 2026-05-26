import type { Metadata } from "next";
import { Suspense } from "react";
import { getDashboardStats } from "@/lib/actions/jurnal";
import { DashboardStats } from "@/components/dashboard/stats-cards";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { RecentJurnal } from "@/components/dashboard/recent-jurnal";
import { KategoriChart } from "@/components/dashboard/kategori-chart";
import { SkeletonCard } from "@/components/shared/skeleton";
import { auth } from "@/lib/auth";

export const metadata: Metadata = { title: "Dashboard Guru Wali" };

export default async function GuruDashboard() {
  const [session, stats] = await Promise.all([auth(), getDashboardStats()]);

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Selamat datang, {session?.user.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">{today}</p>
      </div>

      <Suspense fallback={<div className="grid grid-cols-2 gap-4"><SkeletonCard /><SkeletonCard /></div>}>
        <DashboardStats
          totalSiswa={stats.totalSiswa}
          totalJurnal={stats.totalJurnal}
          role="guru_wali"
        />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityChart />
        </div>
        <KategoriChart data={stats.kategoriStats} />
      </div>

      <RecentJurnal data={stats.recentJurnal} />
    </div>
  );
}
