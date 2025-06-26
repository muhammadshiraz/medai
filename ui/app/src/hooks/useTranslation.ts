// src/hooks/useTranslation.ts
import { translations } from "@/locales";
import { useSettings } from "@/context/SettingsContext";

export const useTranslation = () => {
  const { language } = useSettings();
  return (key: keyof typeof translations.en) => translations[language][key];
};
