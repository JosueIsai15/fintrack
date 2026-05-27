"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface DataPoint {
  label: string;
  income: number;
  expenses: number;
}

interface Props { data: DataPoint[] }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card p-3 text-sm" style={{ minWidth: 160 }}>
      <p className="font-semibold mb-2" style={{ color: "var(--text-1)" }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.dataKey === "income" ? "Ingresos" : "Gastos"}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function MonthlyChart({ data }: Props) {
  return (
    <div className="card p-5">
      <h3 className="font-semibold text-sm mb-5" style={{ color: "var(--text-1)" }}>
        Evolución mensual
      </h3>
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--text-3)", fontSize: 12 }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--text-3)", fontSize: 11 }}
              axisLine={false} tickLine={false}
              tickFormatter={v => `${v}€`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Legend
              formatter={v => <span style={{ color: "var(--text-2)", fontSize: 12 }}>
                {v === "income" ? "Ingresos" : "Gastos"}
              </span>}
            />
            <Bar dataKey="income"   fill="var(--income)"  radius={[4, 4, 0, 0]} maxBarSize={32} />
            <Bar dataKey="expenses" fill="var(--expense)" radius={[4, 4, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
