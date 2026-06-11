const TRANSACTIONS = [
  { title: "Conversión ARS → COP", amount: "+150.000 COP" },
  { title: "Transferencia",        amount: "-25.000 ARS" },
  { title: "Recibido",             amount: "+8.500 VES"  },
];

export const HomeTransactions = () => (
  <section className="relative z-10 container mx-auto px-6 py-20">
    <h2 className="mb-8 text-4xl font-bold">Últimos movimientos</h2>
    <div className="space-y-4">
      {TRANSACTIONS.map((tx) => (
        <div
          key={tx.title}
          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
        >
          <span>{tx.title}</span>
          <span className="font-semibold text-cyan-400">{tx.amount}</span>
        </div>
      ))}
    </div>
  </section>
);

export default HomeTransactions;
