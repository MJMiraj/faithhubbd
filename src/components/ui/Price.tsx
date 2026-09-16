"use client";

import { useSettingsStore } from "@/store/settingsStore";
import { useEffect, useState } from "react";

interface PriceProps {
  amount: number;
  className?: string;
}

const EXCHANGE_RATES = {
  BDT: 1,
  USD: 0.0091,
  EUR: 0.0084,
  GBP: 0.0072
};

const CURRENCY_SYMBOLS = {
  BDT: "৳",
  USD: "$",
  EUR: "€",
  GBP: "£"
};

export function Price({ amount, className = "" }: PriceProps) {
  const { currency } = useSettingsStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return base BDT format during SSR to prevent layout shift
    return <span className={className}>৳ {amount.toLocaleString('en-US')}</span>;
  }

  const convertedAmount = amount * EXCHANGE_RATES[currency];
  const symbol = CURRENCY_SYMBOLS[currency as keyof typeof CURRENCY_SYMBOLS];
  
  // Format based on currency (2 decimal places for non-BDT)
  const formatted = currency === "BDT" 
    ? convertedAmount.toLocaleString('en-US') 
    : convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return <span className={className}>{symbol}{formatted}</span>;
}
