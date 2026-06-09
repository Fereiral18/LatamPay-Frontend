import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  ArrowDownToLine,
  Coins,
  History,
  Send,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useWallet } from "../../context/WalletContext";
import { formatAmount } from "../../services/transfer/format";
import { TransferModal } from "../../components/transfer/TransferModal";
import { DashboardSkeleton } from "../../components/dashboard/DashboardSkeleton";
import { CurrencyCard } from "../../components/dashboard/CurrencyCard";
import { TransactionHistory } from "../../components/transactions/TransactionHistory";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { useDashboardData } from "../../hooks/useDashboardData";

type QuickAction = {
  icon: typeof Send;
  label: string;
  onClick?: () => void;
};

export const Dashboard = () => {
  const { user } = useAuth();
  const {
    balance,
    transactions,
    isLoading: isWalletLoading,
    error: walletError,
    refresh: refreshWallet,
  } = useWallet();
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useDashboardData();

  const quickActions: QuickAction[] = [
    { icon: Send, label: "Enviar", onClick: () => setIsTransferOpen(true) },
    { icon: ArrowDownToLine, label: "Recibir" },
    { icon: ArrowLeftRight, label: "Convertir" },
    { icon: History, label: "Historial" },
  ];

  if (isLoading || isWalletLoading) return <DashboardSkeleton />;

  if (isError || !data || walletError) {
    return (
      <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-slate-950 px-6 py-12 text-white">
        <div className="relative z-10 container mx-auto max-w-2xl pt-16">
          <ErrorState
            title="No pudimos cargar tu cuenta"
            description={walletError ?? "Revisá tu conexión e intentá de nuevo."}
            onRetry={() => {
              refetch();
              void refreshWallet();
            }}
          />
        </div>
      </section>
    );
  }

  const { trend, currencies } = data;
  const totalBalance = `$${formatAmount(String(balance))}`;

  return (
    <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-slate-950 px-6 py-12 text-white">
      {/* Fondo animado */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl"
        />

        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-3xl"
        />

        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl"
        />
      </div>

      <div className="relative z-10 container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold md:text-5xl">
            Bienvenido,
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
              {" "}
              {user?.name ?? "Usuario"}
            </span>
          </h1>

          <p className="mt-2 text-slate-400">{user?.email}</p>
        </motion.div>

        {/* Balance */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-8"
        >
          <Card as="article" tone="highlight" padding="lg" radius="xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-slate-400">Balance Total</p>

                <h2 className="mt-2 text-5xl font-bold">{totalBalance}</h2>

                <div className="mt-3 flex items-center gap-2 text-emerald-400">
                  <TrendingUp size={18} />
                  <span>{trend}</span>
                </div>
              </div>

              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-500/10">
                <Wallet size={38} className="text-cyan-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Acciones rápidas */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-8"
        >
          <h2 className="mb-4 text-xl font-semibold">Acciones rápidas</h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={action.onClick}
                  disabled={!action.onClick}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-all hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Icon size={18} className="text-cyan-400" />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* Monedas */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-10"
        >
          <h2 className="mb-4 text-xl font-semibold">Mis monedas</h2>

          {currencies.length === 0 ? (
            <EmptyState
              icon={Coins}
              title="Todavía no tenés monedas"
              description="Cuando agregues fondos a tu cuenta vas a verlos acá."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {currencies.map((item) => (
                <CurrencyCard
                  key={item.currency}
                  currency={item.currency}
                  value={item.value}
                  valueClassName={item.color}
                />
              ))}
            </div>
          )}
        </motion.section>

        {/* Movimientos */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-10"
        >
          <h2 className="mb-4 text-xl font-semibold">Últimos movimientos</h2>

          <TransactionHistory transactions={transactions} />
        </motion.section>
      </div>

      <TransferModal
        open={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
      />
    </section>
  );
};

export default Dashboard;
