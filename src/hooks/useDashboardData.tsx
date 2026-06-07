import { useCallback, useEffect, useState } from "react";

export type CurrencyBalance = {
  currency: string;
  value: string;
  color: string;
};

export type DashboardData = {
  trend: string;
  currencies: CurrencyBalance[];
};

const MOCK_DATA: DashboardData = {
  trend: "+12.4% este mes",
  currencies: [
    { currency: "ARS", value: "$2.500.000", color: "text-cyan-400" },
    { currency: "COP", value: "$8.500.000", color: "text-emerald-400" },
    { currency: "VES", value: "Bs. 95.000", color: "text-yellow-400" },
  ],
};

type Status = "loading" | "success" | "error";

export const useDashboardData = () => {
  const [status, setStatus] = useState<Status>("loading");
  const [data, setData] = useState<DashboardData | null>(null);

  const fetchData = useCallback(() => {
    setStatus("loading");
    setData(null);

    const timeout = window.setTimeout(() => {
      setData(MOCK_DATA);
      setStatus("success");
    }, 900);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const cleanup = fetchData();
    return cleanup;
  }, [fetchData]);

  return {
    data,
    isLoading: status === "loading",
    isError: status === "error",
    refetch: fetchData,
  };
};

export default useDashboardData;
