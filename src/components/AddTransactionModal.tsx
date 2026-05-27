"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, TransactionType } from "@/types";
import { format } from "date-fns";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddTransactionModal({ isOpen, onClose, onSuccess }: Props) {
  const supabase = createClient();
  const [type, setType]             = useState<TransactionType>("expense");
  const [amount, setAmount]         = useState("");
  const [category, setCategory]     = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate]             = useState(format(new Date(), "yyyy-MM-dd"));
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const reset = () => {
    setAmount(""); setCategory(""); setDescription("");
    setDate(format(new Date(), "yyyy-MM-dd")); setError(""); setType("expense");
  };

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0) { setError("Introduce un importe válido."); return; }
    if (!category)        { setError("Selecciona una categoría."); return; }

    setLoading(true); setError("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Sesión expirada."); setLoading(false); return; }

    const { error: dbError } = await supabase.from("transactions").insert({
      user_id: user.id, type, amount: num, category, description, date,
    });

    if (dbError) {
      setError("Error al guardar. Inténtalo de nuevo.");
      setLoading(false);
    } else {
      reset(); onSuccess(); onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="card w-full max-w-md pointer-events-auto p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold" style={{ color: "var(--text-1)" }}>
                  Nueva transacción
                </h2>
                <button onClick={handleClose} className="p-1.5 rounded-lg transition-colors"
                  style={{ color: "var(--text-3)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--text-1)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--text-3)")}>
                  <X size={18} />
                </button>
              </div>

              {/* Type toggle */}
              <div className="flex gap-2 mb-5 p-1 rounded-xl" style={{ background: "var(--surface-2)" }}>
                {(["expense", "income"] as TransactionType[]).map(t => (
                  <button
                    key={t} type="button"
                    onClick={() => { setType(t); setCategory(""); }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: type === t
                        ? (t === "income" ? "var(--income-light)" : "var(--expense-light)")
                        : "transparent",
                      color: type === t
                        ? (t === "income" ? "var(--income)" : "var(--expense)")
                        : "var(--text-3)",
                    }}
                  >
                    {t === "income" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {t === "income" ? "Ingreso" : "Gasto"}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Amount */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--text-2)" }}>
                    Importe (€)
                  </label>
                  <input
                    type="number" step="0.01" min="0.01" required
                    placeholder="0.00" value={amount}
                    onChange={e => setAmount(e.target.value)}
                    className="input" disabled={loading}
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--text-2)" }}>
                    Categoría
                  </label>
                  <select
                    required value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="input" disabled={loading}
                    style={{ cursor: "pointer" }}
                  >
                    <option value="">Selecciona categoría</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--text-2)" }}>
                    Descripción <span style={{ color: "var(--text-3)" }}>(opcional)</span>
                  </label>
                  <input
                    type="text" placeholder="Ej: Supermercado Mercadona"
                    value={description} onChange={e => setDescription(e.target.value)}
                    className="input" disabled={loading}
                  />
                </div>

                {/* Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium" style={{ color: "var(--text-2)" }}>Fecha</label>
                  <input
                    type="date" required value={date}
                    onChange={e => setDate(e.target.value)}
                    className="input" disabled={loading}
                  />
                </div>

                {error && (
                  <p className="text-sm px-3 py-2 rounded-lg"
                    style={{ background: "var(--expense-light)", color: "var(--expense)" }}>
                    {error}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={handleClose} className="btn-ghost flex-1"
                    disabled={loading}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2"
                    disabled={loading}>
                    {loading
                      ? <><Loader2 size={14} className="animate-spin" /> Guardando...</>
                      : "Guardar"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
