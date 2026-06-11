import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import type { Transaction } from "../../types/wallet/wallet.types";
import { TransactionHistory } from "./TransactionHistory";

type ActionFilter = "all" | "transfer_sent" | "deposit" | "swap";
type DateFilter = "all" | "today" | "week" | "month";
type AmountFilter = "all" | "low" | "mid" | "high";

const PAGE_SIZE = 10;

const actionOptions: { value: ActionFilter; label: string }[] = [
  { value: "all", label: "Todas las acciones" },
  { value: "transfer_sent", label: "Transferencias enviadas" },
  { value: "deposit", label: "Depósitos" },
  { value: "swap", label: "Conversiones" },
];

const dateOptions: { value: DateFilter; label: string }[] = [
  { value: "all", label: "Cualquier fecha" },
  { value: "today", label: "Hoy" },
  { value: "week", label: "Últimos 7 días" },
  { value: "month", label: "Últimos 30 días" },
];

const amountOptions: { value: AmountFilter; label: string }[] = [
  { value: "all", label: "Cualquier monto" },
  { value: "low", label: "Menos de $10.000" },
  { value: "mid", label: "$10.000 - $100.000" },
  { value: "high", label: "Más de $100.000" },
];

const matchesDate = (iso: string, filter: DateFilter): boolean => {
  if (filter === "all") return true;
  const txDate = new Date(iso);
  if (Number.isNaN(txDate.getTime())) return false;
  const now = new Date();
  if (filter === "today") {
    return txDate.toDateString() === now.toDateString();
  }
  const days = filter === "week" ? 7 : 30;
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days);
  return txDate >= cutoff;
};

const matchesAmount = (amount: number, filter: AmountFilter): boolean => {
  if (filter === "all") return true;
  const abs = Math.abs(amount);
  if (filter === "low") return abs < 10000;
  if (filter === "mid") return abs >= 10000 && abs <= 100000;
  return abs > 100000;
};

const matchesAction = (tx: Transaction, filter: ActionFilter): boolean => {
  if (filter === "all") return true;
  return tx.kind === filter;
};

type SelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
};

const FilterSelect = ({ label, value, onChange, options }: SelectProps) => (
  <label className="flex flex-col gap-1.5">
    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
      {label}
    </span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2.5 text-sm text-slate-200 outline-none transition focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/30"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-slate-900">
          {opt.label}
        </option>
      ))}
    </select>
  </label>
);

export type TransactionsExplorerProps = {
  transactions: Transaction[];
};

export const TransactionsExplorer = ({
  transactions,
}: TransactionsExplorerProps) => {
  const [actionFilter, setActionFilter] = useState<ActionFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [amountFilter, setAmountFilter] = useState<AmountFilter>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return transactions.filter(
      (tx) =>
        matchesAction(tx, actionFilter) &&
        matchesDate(tx.createdAt, dateFilter) &&
        matchesAmount(tx.amount, amountFilter),
    );
  }, [transactions, actionFilter, dateFilter, amountFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paged = filtered.slice(start, start + PAGE_SIZE);

  const handleFilterChange = <T,>(setter: (v: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
        <div className="mb-3 flex items-center gap-2 text-slate-300">
          <Filter size={16} className="text-cyan-400" />
          <span className="text-sm font-medium">Filtros</span>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <FilterSelect
            label="Acción"
            value={actionFilter}
            onChange={handleFilterChange<ActionFilter>((v) =>
              setActionFilter(v as ActionFilter),
            )}
            options={actionOptions}
          />
          <FilterSelect
            label="Fecha"
            value={dateFilter}
            onChange={handleFilterChange<DateFilter>((v) =>
              setDateFilter(v as DateFilter),
            )}
            options={dateOptions}
          />
          <FilterSelect
            label="Monto"
            value={amountFilter}
            onChange={handleFilterChange<AmountFilter>((v) =>
              setAmountFilter(v as AmountFilter),
            )}
            options={amountOptions}
          />
        </div>
      </div>

      <TransactionHistory
        transactions={paged}
        emptyTitle="Sin resultados"
        emptyDescription="Probá ajustar los filtros para ver más movimientos."
      />

      {filtered.length > PAGE_SIZE && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <p className="text-xs text-slate-500">
            Mostrando {start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)} de{" "}
            {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Página anterior"
              className="rounded-lg border border-white/10 p-2 text-slate-300 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-300"
            >
              <ChevronLeft size={16} />
            </button>
            {pageNumbers.map((n) => {
              const isActive = n === currentPage;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  aria-current={isActive ? "page" : undefined}
                  className={`min-w-9 rounded-lg border px-3 py-1.5 text-sm transition ${
                    isActive
                      ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                      : "border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {n}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Página siguiente"
              className="rounded-lg border border-white/10 p-2 text-slate-300 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-300"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsExplorer;
