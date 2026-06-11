import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  ArrowDownToLine,
  ArrowRight,
  History,
  Plus,
  Send,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { paths } from "../../routes/paths";
import { useAuth } from "../../context/AuthContext";
import { useWallet } from "../../context/WalletContext";
import { TransferModal } from "../../components/transfer/TransferModal";
import { ConvertModal } from "../../components/convert/ConvertModal";
import { DashboardSkeleton } from "../../components/dashboard/DashboardSkeleton";
import { TransactionHistory } from "../../components/transactions/TransactionHistory";
import { LiveRatesGrid } from "../../components/exchange/LiveRatesGrid";
import { Card } from "../../components/ui/Card";
import { ErrorState } from "../../components/ui/ErrorState";
import { useDashboardData } from "../../hooks/useDashboardData";
import { apiDeposit } from "../../services/wallet.api";
import {
  SUPPORTED_CURRENCIES,
  type Currency,
} from "../../types/wallet/wallet.types";
import { CURRENCY_META, formatBalance } from "../../utils/currency";
import { ReceiveModal } from "../../components/receiveModal/ReceiveModal";

const MOCK_DEPOSIT_AMOUNT = 10000;
const MOCK_DEPOSIT_CURRENCY: Currency = "ARS";

type QuickAction = {
  icon: typeof Send;
  label: string;
  onClick?: () => void;
};

export const Dashboard = () => {
  const { user } = useAuth();
  const {
    balances,
    transactions,
    cbu,
    alias,
    isLoading: isWalletLoading,
    error: walletError,
    refresh: refreshWallet,
  } = useWallet();
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [isConvertOpen, setIsConvertOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("ARS");
  const [isDepositing, setIsDepositing] = useState(false);
  const { data, isLoading, isError, refetch } = useDashboardData();

  const handleMockDeposit = async () => {
    if (isDepositing) return;
    setIsDepositing(true);
    const loadingId = toast.loading("Acreditando saldo...");
    try {
      await apiDeposit({
        amount: MOCK_DEPOSIT_AMOUNT,
        currency_code: MOCK_DEPOSIT_CURRENCY,
      });
      await refreshWallet();
      toast.dismiss(loadingId);
      toast.success(
        `+${formatBalance(MOCK_DEPOSIT_AMOUNT, MOCK_DEPOSIT_CURRENCY)} acreditados.`,
      );
    } catch (e) {
      toast.dismiss(loadingId);
      toast.error(
        e instanceof Error ? e.message : "No pudimos acreditar el saldo.",
      );
    } finally {
      setIsDepositing(false);
    }
  };

  const quickActions: QuickAction[] = [
    { icon: Send, label: "Enviar", onClick: () => setIsTransferOpen(true) },
    {
      icon: ArrowDownToLine,
      label: "Recibir",
      onClick: () => setIsReceiveOpen(true),
    },
    {
      icon: ArrowLeftRight,
      label: "Convertir",
      onClick: () => setIsConvertOpen(true),
    },
    { icon: History, label: "Historial" },
  ];

  if (isLoading || isWalletLoading) return <DashboardSkeleton />;

  if (isError || !data || walletError) {
    return (
      <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-slate-950 px-6 py-12 text-white">
        <div className="relative z-10 container mx-auto max-w-2xl pt-16">
          <ErrorState
            title="No pudimos cargar tu cuenta"
            description={
              walletError ?? "Revisá tu conexión e intentá de nuevo."
            }
            onRetry={() => {
              refetch();
              void refreshWallet();
            }}
          />
        </div>
      </section>
    );
  }

  const { trend } = data;
  const selectedMeta = CURRENCY_META[selectedCurrency];
  const totalBalance = formatBalance(
    balances[selectedCurrency] ?? 0,
    selectedCurrency,
  );

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
                <p className="flex items-center gap-2 text-slate-400">
                  Balance Total
                  <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-xs font-semibold text-cyan-300">
                    {selectedMeta.flag} {selectedMeta.code}
                  </span>
                </p>

                <h2 className="mt-2 text-5xl font-bold">{totalBalance}</h2>

                <button
                  type="button"
                  onClick={handleMockDeposit}
                  disabled={isDepositing}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Plus size={14} />
                  +10.000 ARS (mock)
                </button>

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
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-xl font-semibold">Mis monedas</h2>
            <p className="text-xs text-slate-400">
              Tocá una moneda para verla en el balance.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {SUPPORTED_CURRENCIES.map((code) => {
              const meta = CURRENCY_META[code];
              const amount = balances[code] ?? 0;
              const isActive = selectedCurrency === code;

              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setSelectedCurrency(code)}
                  aria-pressed={isActive}
                  className={`group rounded-2xl border bg-white/5 p-5 text-left backdrop-blur-xl transition-all ${
                    isActive
                      ? "border-cyan-500/60 shadow-[0_0_30px_rgba(6,182,212,0.25)]"
                      : "border-white/10 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-2 text-slate-300">
                      <span className="text-xl">{meta.flag}</span>
                      <span>{meta.code}</span>
                    </p>
                    {isActive && (
                      <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
                        Activo
                      </span>
                    )}
                  </div>
                  <p className={`mt-3 text-3xl font-bold ${meta.accentClass}`}>
                    {formatBalance(amount, code)}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{meta.label}</p>
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* Cotizaciones en vivo */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10"
        >
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-xl font-semibold">Cotizaciones en vivo</h2>
            <p className="text-xs text-slate-400">
              Datos sincronizados desde el backend.
            </p>
          </div>
          <LiveRatesGrid variant="detailed" />
        </motion.section>

        {/* Movimientos */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-10"
        >
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-xl font-semibold">Últimos movimientos</h2>
            <p className="text-xs text-slate-400">
              Mostrando los 5 más recientes.
            </p>
          </div>

          <TransactionHistory transactions={transactions} limit={5} />

          {transactions.length > 0 && (
            <div className="mt-5 flex justify-center">
              <Link
                to={`${paths.more}?section=history`}
                className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2.5 text-sm font-medium text-cyan-300 transition hover:border-cyan-400/60 hover:bg-cyan-500/15 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]"
              >
                Ver todos los movimientos
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </motion.section>
      </div>

      <TransferModal
        open={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
      />
      <ReceiveModal
        open={isReceiveOpen}
        onClose={() => setIsReceiveOpen(false)}
        alias={alias ?? undefined}
        cbu={cbu ?? undefined}
      />

      <ConvertModal
        open={isConvertOpen}
        onClose={() => setIsConvertOpen(false)}
        initialFrom={selectedCurrency}
      />
    </section>
  );
};

export default Dashboard;
