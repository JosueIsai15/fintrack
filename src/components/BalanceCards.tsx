"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Props {
  income: number;
  expenses: number;
  balance: number;
}

const cards = [
  {
    key: "balance",
    label: "Balance total",
    icon: Wallet,
    color: "var(--primary)",
    bg: "var(--primary-light)",
  },
  {
    key: "income",
    label: "Ingresos del mes",
    icon: TrendingUp,
    color: "var(--income)",
    bg: "var(--income-light)",
  },
  {
    key: "expenses",
    label: "Gastos del mes",
    icon: TrendingDown,
    color: "var(--expense)",
    bg: "var(--expense-light)",
  },
] as const;

export default function BalanceCards({ income, expenses, balance }: Props) {
  const values = { balance, income, expenses };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map(({ key, label, icon: Icon, color, bg }, i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          className="card p-5 flex items-center gap-4"
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: bg }}
          >
            <Icon size={20} style={{ color }} />
          </div>
          <div>
            <p className="text-xs mb-0.5" style={{ color: "var(--text-3)" }}>{label}</p>
            <p className="text-xl font-bold" style={{ color: "var(--text-1)" }}>
              {formatCurrency(values[key])}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
