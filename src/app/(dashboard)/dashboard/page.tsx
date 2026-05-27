"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Transaction } from "@/types";
import {
  computeBalance,
  buildMonthlyData,
  buildCategoryData,
  getMonthRange,
} from "@/lib/utils";
import { format } from "date-fns";
import BalanceCards from "@/components/BalanceCards";
import MonthlyChart from "@/components/MonthlyChart";
import CategoryChart from "@/components/CategoryChart";
import RecentTransactions from "@/components/RecentTransactions";
import AddTransactionModal from "@/components/AddTransactionModal";

export default function DashboardPage() {
  const router  = useRouter();
  const supabase = createClient();

  const [all, setAll]         = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

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

  // Current month transactions
  const { from, to } = getMonthRange(new Date());
  const thisMonth = all.filter(t => t.date >= from && t.date <= to);
  const { income, expenses, balance } = computeBalance(thisMonth);
  const monthlyData  = buildMonthlyData(all);
  const categoryData = buildCategoryData(thisMonth);

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
          <h1 className="text-xl font-bold" style={{ color: "var(--text-1)" }}>Dashboard</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-3)" }}>
            {format(new Date(), "MMMM yyyy").charAt(0).toUpperCase() +
              format(new Date(), "MMMM yyyy").slice(1)}
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

      {/* Balance cards */}
      <BalanceCards income={income} expenses={expenses} balance={balance} />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <MonthlyChart data={monthlyData} />
        <CategoryChart data={categoryData} />
      </div>

      {/* Recent transactions */}
      <div className="mt-4">
        <RecentTransactions
          transactions={all}
          onDelete={handleDelete}
          limit={6}
        />
      </div>

      <AddTransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchAll}
      />
    </>
  );
}
