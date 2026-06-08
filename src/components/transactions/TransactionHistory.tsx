import { Inbox } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Transaction } from "../../context/WalletContext";
import { EmptyState } from "../ui/EmptyState";
import { TransactionRow } from "./TransactionRow";

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

const formatTransactionDate = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return dateFormatter.format(date);
};

export type TransactionHistoryProps = {
  transactions: Transaction[];
  limit?: number;
  emptyIcon?: LucideIcon;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
};

export const TransactionHistory = ({
  transactions,
  limit,
  emptyIcon = Inbox,
  emptyTitle = "Sin movimientos aún",
  emptyDescription = "Tus transferencias y pagos van a aparecer acá.",
  className = "",
}: TransactionHistoryProps) => {
  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        className={className}
      />
    );
  }

  const visible =
    typeof limit === "number" ? transactions.slice(0, limit) : transactions;

  return (
    <div className={`space-y-4 ${className}`.trim()}>
      {visible.map((tx) => (
        <TransactionRow
          key={tx.id}
          title={tx.title}
          amount={tx.amount}
          date={formatTransactionDate(tx.createdAt)}
        />
      ))}
    </div>
  );
};

export default TransactionHistory;

