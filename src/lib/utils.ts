import { Transaction } from "@/types";
import { format, parseISO, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { es } from "date-fns/locale";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), "d MMM yyyy", { locale: es });
}

export function getMonthRange(date: Date) {
  return {
    from: format(startOfMonth(date), "yyyy-MM-dd"),
    to: format(endOfMonth(date), "yyyy-MM-dd"),
  };
}

export function computeBalance(transactions: Transaction[]) {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + Number(t.amount), 0);
  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);
  return { income, expenses, balance: income - expenses };
}

export function buildMonthlyData(transactions: Transaction[], months = 6) {
  return Array.from({ length: months }, (_, i) => {
    const date = subMonths(new Date(), months - 1 - i);
    const label = format(date, "MMM", { locale: es });
    const { from, to } = getMonthRange(date);
    const inRange = transactions.filter((t) => t.date >= from && t.date <= to);
    const income = inRange
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + Number(t.amount), 0);
    const expenses = inRange
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + Number(t.amount), 0);
    return { label, income, expenses };
  });
}

export function buildCategoryData(transactions: Transaction[]) {
  const expenseMap: Record<string, number> = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      expenseMap[t.category] = (expenseMap[t.category] ?? 0) + Number(t.amount);
    });
  return Object.entries(expenseMap)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export const CHART_COLORS = [
  "#6366f1", "#10b981", "#f59e0b", "#3b82f6",
  "#ec4899", "#14b8a6", "#f97316", "#8b5cf6",
];
