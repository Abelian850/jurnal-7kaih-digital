"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";
import { id } from "date-fns/locale";

// Mock weekly data — replace with real server data
const generateWeekData = () => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      day: format(date, "EEE", { locale: id }),
      jurnal: Math.floor(Math.random() * 15) + 2,
    };
  });
};

export function ActivityChart() {
  const data = generateWeekData();

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-foreground">Aktivitas Minggu Ini</h3>
        <span className="text-xs text-muted-foreground px-2.5 py-1 rounded-lg bg-muted">7 hari terakhir</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorJurnal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid hsl(var(--border))",
              background: "hsl(var(--card))",
              color: "hsl(var(--foreground))",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="jurnal"
            stroke="#22c55e"
            strokeWidth={2.5}
            fill="url(#colorJurnal)"
            dot={{ fill: "#22c55e", strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, fill: "#22c55e" }}
            name="Jurnal"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
