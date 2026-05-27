"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, Trash2 } from "lucide-react";
import { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  limit?: number;
  title?: string;
}

export default function RecentTransactions({
  transactions,
  onDelete,
  limit = 8,
  title = "Últimas transacciones",
}: Props) {
  const list = limit ? transactions.slice(0, limit) : transactions;

  return (
    <div className="card">
      <div className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: "var(--border)" }}>
        <h3 className="font-semibold text-sm" style={{ color: "var(--text-1)" }}>{title}</h3>
        <span className="text-xs" style={{ color: "var(--text-3)" }}>
          {transactions.length} {transactions.length === 1 ? "registro" : "registros"}
        </span>
      </div>

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 gap-2">
          <p className="text-sm" style={{ color: "var(--text-3)" }}>Aún no hay transacciones</p>
          <p className="text-xs" style={{ color: "var(--text-3)" }}>Pulsa + para añadir la primera</p>
        </div>
      ) : (
        <ul>
          <AnimatePresence initial={false}>
            {list.map((t, i) => (
              <motion.li
                key={t.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 px-5 py-3.5 group border-b last:border-b-0"
                style={{ borderColor: "var(--border)" }}
              >
                {/* Icon */}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: t.type === "income" ? "var(--income-light)" : "var(--expense-light)",
                  }}>
                  {t.type === "income"
                    ? <ArrowUpRight size={16} style={{ color: "var(--income)" }} />
                    : <ArrowDownLeft size={16} style={{ color: "var(--expense)" }} />
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--text-1)" }}>
                    {t.description || t.category}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-3)" }}>
                    {t.category} · {formatDate(t.date)}
                  </p>
                </div>

                {/* Amount */}
                <span className="font-semibold text-sm shrink-0"
                  style={{ color: t.type === "income" ? "var(--income)" : "var(--expense)" }}>
                  {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
                </span>

                {/* Delete */}
                <button
                  onClick={() => onDelete(t.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg"
                  style={{ color: "var(--text-3)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--expense)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--text-3)")}
                >
                  <Trash2 size={14} />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
