import { useSettingsStore } from "@/store/settingsStore";
import { translations, TranslationKey } from "@/i18n/translations";

export function useTranslation() {
  const { language } = useSettingsStore();

  const t = (key: TranslationKey) => {
    return translations[language][key] || translations.en[key] || key;
  };

  return { t, lang: language };
}
