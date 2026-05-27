"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TrendingUp, LayoutDashboard, List, LogOut, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

const links = [
  { href: "/dashboard",     label: "Dashboard",    icon: LayoutDashboard },
  { href: "/transactions",  label: "Transacciones", icon: List },
];

export default function Navbar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const supabase  = createClient();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <nav
      className="sticky top-0 z-40 border-b"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--primary-light)", border: "1px solid rgba(99,102,241,0.3)" }}>
            <TrendingUp size={16} style={{ color: "var(--primary)" }} />
          </div>
          <span className="font-bold text-base" style={{ color: "var(--text-1)" }}>FinTrack</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors no-underline"
                style={{ color: active ? "var(--text-1)" : "var(--text-3)" }}
              >
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: "var(--surface-2)" }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  <Icon size={15} />
                  {label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          {email && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: "var(--surface-2)" }}>
              <User size={13} style={{ color: "var(--text-3)" }} />
              <span className="text-xs" style={{ color: "var(--text-2)" }}>
                {email.split("@")[0]}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
            style={{ color: "var(--text-3)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--expense)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-3)")}
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
