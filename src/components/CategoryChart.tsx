"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatCurrency, CHART_COLORS } from "@/lib/utils";

interface DataPoint { category: string; amount: number }
interface Props { data: DataPoint[] }

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card p-3 text-sm">
      <p style={{ color: "var(--text-1)" }}>{payload[0].name}</p>
      <p style={{ color: "var(--expense)" }}>{formatCurrency(payload[0].value)}</p>
    </div>
  );
};

export default function CategoryChart({ data }: Props) {
  if (!data.length) {
    return (
      <div className="card p-5 flex items-center justify-center" style={{ height: 300 }}>
        <p className="text-sm" style={{ color: "var(--text-3)" }}>Sin gastos este mes</p>
      </div>
    );
  }

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-sm mb-5" style={{ color: "var(--text-1)" }}>
        Gastos por categoría
      </h3>
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data} dataKey="amount" nameKey="category"
              cx="50%" cy="50%" innerRadius={55} outerRadius={85}
              paddingAngle={3}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={v => (
                <span style={{ color: "var(--text-2)", fontSize: 11 }}>{v}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
