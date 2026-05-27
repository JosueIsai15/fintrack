"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Transaction, TransactionType } from "@/types";
import AddTransactionModal from "@/components/AddTransactionModal";
import RecentTransactions from "@/components/RecentTransactions";

export default function TransactionsPage() {
  const router   = useRouter();
  const supabase = createClient();

  const [all, setAll]           = useState<Transaction[]>([]);
  const [loading, setLoading]   = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch]     = useState("");
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");

  const fetchAll = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });
    setAll(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleDelete = async (id: string) => {
    await supabase.from("transactions").delete().eq("id", id);
    setAll(prev => prev.filter(t => t.id !== id));
  };

  const filtered = all.filter(t => {
    const matchType   = typeFilter === "all" || t.type === typeFilter;
    const matchSearch = !search ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 rounded-full animate-spin"
          style={{ borderColor: "var(--border)", borderTopColor: "var(--primary)" }} />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--text-1)" }}>Transacciones</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-3)" }}>
            {all.length} registros totales
          </p>
        </div>
        <motion.button
          onClick={() => setModalOpen(true)}
          className="btn-primary flex items-center gap-2"
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        >
          <Plus size={16} /> Nueva
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-3)" }} />
          <input
            type="text" placeholder="Buscar por descripción o categoría..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="input pl-9"
          />
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-2 p-1 rounded-xl" style={{ background: "var(--surface)" }}>
          <Filter size={13} className="ml-2" style={{ color: "var(--text-3)" }} />
          {(["all", "income", "expense"] as const).map(f => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: typeFilter === f ? "var(--surface-2)" : "transparent",
                color: typeFilter === f ? "var(--text-1)" : "var(--text-3)",
              }}
            >
              {f === "all" ? "Todos" : f === "income" ? "Ingresos" : "Gastos"}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <RecentTransactions
        transactions={filtered}
        onDelete={handleDelete}
        limit={0}
        title={`${filtered.length} resultado${filtered.length !== 1 ? "s" : ""}`}
      />

      <AddTransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchAll}
      />
    </>
  );
}
