import { GraduationCap, BookOpen, Users, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
  totalSiswa: number;
  totalJurnal: number;
  totalGuru?: number;
  role: "admin" | "guru_wali";
}

interface StatCard {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  trend?: string;
}

export function DashboardStats({ totalSiswa, totalJurnal, totalGuru = 0, role }: StatsCardsProps) {
  const adminCards: StatCard[] = [
    {
      label: "Total Siswa",
      value: totalSiswa,
      icon: GraduationCap,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "Total Jurnal",
      value: totalJurnal,
      icon: BookOpen,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      label: "Guru Wali",
      value: totalGuru,
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      label: "Rata-rata/Guru",
      value: totalGuru > 0 ? Math.round(totalSiswa / totalGuru) : 0,
      icon: TrendingUp,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      trend: "siswa",
    },
  ];

  const guruCards: StatCard[] = [
    {
      label: "Siswa Bimbingan",
      value: totalSiswa,
      icon: GraduationCap,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      label: "Total Jurnal",
      value: totalJurnal,
      icon: BookOpen,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
  ];

  const cards = role === "admin" ? adminCards : guruCards;

  return (
    <div className={cn("grid gap-4", role === "admin" ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2")}>
      {cards.map((card) => (
        <div key={card.label} className="stat-card animate-slide-up">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">{card.label}</p>
              <p className="text-3xl font-display font-bold text-foreground mt-2">
                {card.value.toLocaleString("id-ID")}
              </p>
              {card.trend && (
                <p className="text-xs text-muted-foreground mt-1">{card.trend}</p>
              )}
            </div>
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", card.bgColor)}>
              <card.icon size={22} className={card.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
