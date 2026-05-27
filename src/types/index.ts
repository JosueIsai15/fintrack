export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
}

export interface TransactionInsert {
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export const INCOME_CATEGORIES = [
  "Salario",
  "Freelance",
  "Inversiones",
  "Alquiler",
  "Otros ingresos",
] as const;

export const EXPENSE_CATEGORIES = [
  "Alimentación",
  "Transporte",
  "Vivienda",
  "Entretenimiento",
  "Salud",
  "Educación",
  "Ropa",
  "Suscripciones",
  "Otros gastos",
] as const;
