import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "en" | "bn";
export type Theme = "light" | "dark" | "system";
export type FontFamily = "inter" | "outfit" | "roboto";
export type AccentColor = "brand" | "rose" | "blue" | "emerald";
export type Currency = "BDT" | "USD" | "EUR" | "GBP";

interface SettingsStore {
  language: Language;
  theme: Theme;
  font: FontFamily;
  accent: AccentColor;
  currency: Currency;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  setFont: (font: FontFamily) => void;
  setAccent: (accent: AccentColor) => void;
  setCurrency: (currency: Currency) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      language: "en",
      theme: "system",
      font: "inter",
      accent: "brand",
      currency: "BDT",
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      setFont: (font) => set({ font }),
      setAccent: (accent) => set({ accent }),
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: "faithhubbd-settings",
    }
  )
);
