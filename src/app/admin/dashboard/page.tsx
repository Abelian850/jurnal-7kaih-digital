import type { Metadata } from "next";
import { Suspense } from "react";
import { getDashboardStats } from "@/lib/actions/jurnal";
import { DashboardStats } from "@/components/dashboard/stats-cards";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { RecentJurnal } from "@/components/dashboard/recent-jurnal";
import { KategoriChart } from "@/components/dashboard/kategori-chart";
import { SkeletonCard } from "@/components/shared/skeleton";
import { auth } from "@/lib/auth";
import { getGuruWaliList } from "@/lib/actions/guru";

export const metadata: Metadata = { title: "Dashboard Admin" };

export default async function AdminDashboard() {
  const [session, stats, guruList] = await Promise.all([
    auth(),
    getDashboardStats(),
    getGuruWaliList(),
  ]);

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">{today}</p>
      </div>

      {/* Stats */}
      <Suspense fallback={<div className="grid grid-cols-2 lg:grid-cols-4 gap-4"><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>}>
        <DashboardStats
          totalSiswa={stats.totalSiswa}
          totalJurnal={stats.totalJurnal}
          totalGuru={guruList.length}
          role="admin"
        />
      </Suspense>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<SkeletonCard className="h-72" />}>
            <ActivityChart />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<SkeletonCard className="h-72" />}>
            <KategoriChart data={stats.kategoriStats} />
          </Suspense>
        </div>
      </div>

      {/* Recent */}
      <Suspense fallback={<SkeletonCard className="h-64" />}>
        <RecentJurnal data={stats.recentJurnal} />
      </Suspense>
    </div>
  );
}
