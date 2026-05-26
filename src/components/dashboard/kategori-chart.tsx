"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface KategoriChartProps {
  data: { kategori: string; count: number }[];
}

const COLORS = {
  kedisiplinan: "#3b82f6",
  ibadah: "#22c55e",
  kebersihan: "#06b6d4",
  akademik: "#a855f7",
  karakter: "#f97316",
  pelanggaran: "#ef4444",
  prestasi: "#eab308",
};

const LABELS: Record<string, string> = {
  kedisiplinan: "Kedisiplinan",
  ibadah: "Ibadah",
  kebersihan: "Kebersihan",
  akademik: "Akademik",
  karakter: "Karakter",
  pelanggaran: "Pelanggaran",
  prestasi: "Prestasi",
};

export function KategoriChart({ data }: KategoriChartProps) {
  const chartData = data.map((d) => ({
    name: LABELS[d.kategori] ?? d.kategori,
    value: d.count,
    color: COLORS[d.kategori as keyof typeof COLORS] ?? "#94a3b8",
  }));

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h3 className="font-display font-semibold text-foreground mb-4">Kategori Jurnal</h3>
      {chartData.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
          Belum ada data jurnal
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--card))",
                color: "hsl(var(--foreground))",
                fontSize: "12px",
              }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
