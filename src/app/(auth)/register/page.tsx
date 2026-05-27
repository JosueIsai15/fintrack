"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, TrendingUp, Loader2, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Las contraseñas no coinciden."); return; }
    if (password.length < 6)  { setError("La contraseña debe tener al menos 6 caracteres."); return; }
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setDone(true);
    }
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-10 text-center"
      >
        <CheckCircle size={48} className="mx-auto mb-4" style={{ color: "var(--income)" }} />
        <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-1)" }}>¡Cuenta creada!</h2>
        <p className="text-sm mb-6" style={{ color: "var(--text-2)" }}>
          Revisa tu email y confirma tu cuenta para continuar.
        </p>
        <Link href="/login" className="btn-primary inline-block">Ir al login</Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="card p-8"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "var(--primary-light)", border: "1px solid rgba(99,102,241,0.3)" }}>
          <TrendingUp size={20} style={{ color: "var(--primary)" }} />
        </div>
        <div>
          <h1 className="font-bold text-lg" style={{ color: "var(--text-1)" }}>FinTrack</h1>
          <p className="text-xs" style={{ color: "var(--text-3)" }}>Dashboard Financiero</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-1" style={{ color: "var(--text-1)" }}>Crear cuenta</h2>
      <p className="text-sm mb-6" style={{ color: "var(--text-3)" }}>
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="hover:underline" style={{ color: "var(--primary)" }}>
          Inicia sesión
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium" style={{ color: "var(--text-2)" }}>Email</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-3)" }} />
            <input type="email" required placeholder="tu@email.com"
              value={email} onChange={e => setEmail(e.target.value)}
              className="input input-icon" disabled={loading} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium" style={{ color: "var(--text-2)" }}>Contraseña</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-3)" }} />
            <input type="password" required placeholder="Mínimo 6 caracteres"
              value={password} onChange={e => setPassword(e.target.value)}
              className="input input-icon" disabled={loading} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium" style={{ color: "var(--text-2)" }}>Confirmar contraseña</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-3)" }} />
            <input type="password" required placeholder="Repite la contraseña"
              value={confirm} onChange={e => setConfirm(e.target.value)}
              className="input input-icon" disabled={loading} />
          </div>
        </div>

        {error && (
          <p className="text-sm px-3 py-2 rounded-lg"
            style={{ background: "var(--expense-light)", color: "var(--expense)" }}>
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
          {loading ? <><Loader2 size={15} className="animate-spin" /> Creando cuenta...</> : "Crear cuenta"}
        </button>
      </form>
    </motion.div>
  );
}
