import { Card } from "../ui/Card";
import { formatAmount } from "../../services/transfer/format";

export type TransactionRowProps = {
  title: string;
  amount: number;
  date?: string;
  currencySymbol?: string;
};

export const TransactionRow = ({
  title,
  amount,
  date,
  currencySymbol = "$",
}: TransactionRowProps) => {
  const isCredit = amount >= 0;
  const sign = isCredit ? "+" : "-";
  const colorClass = isCredit ? "text-emerald-400" : "text-red-400";
  const formatted = formatAmount(Math.abs(amount).toString());

  return (
    <Card padding="sm" className="flex items-center justify-between px-5 py-5">
      <div className="min-w-0">
        <p className="truncate">{title}</p>
        {date && <p className="mt-0.5 text-xs text-slate-500">{date}</p>}
      </div>
      <span className={`shrink-0 font-semibold ${colorClass}`}>
        {sign}
        {currencySymbol}
        {formatted}
      </span>
    </Card>
  );
};

export default TransactionRow;

