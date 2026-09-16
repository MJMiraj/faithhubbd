import { useState, useEffect } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { translations, TranslationKey } from "@/i18n/translations";

export function useTranslation() {
  const { language } = useSettingsStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeLang = mounted ? language : "en";

  const t = (key: TranslationKey) => {
    return translations[activeLang][key] || translations.en[key] || key;
  };

  return { t, lang: activeLang };
}
