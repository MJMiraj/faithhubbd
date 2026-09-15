"use client";

import { useSettingsStore } from "@/store/settingsStore";
import { useEffect } from "react";
import { useTheme } from "next-themes";

export function AppCustomizer({ children }: { children: React.ReactNode }) {
  const { font, theme: userTheme } = useSettingsStore();
  const { setTheme } = useTheme();

  // Apply Theme
  useEffect(() => {
    setTheme(userTheme);
  }, [userTheme, setTheme]);

  // Apply Font
  useEffect(() => {
    // Remove all previous font classes
    document.documentElement.classList.remove('font-inter', 'font-outfit', 'font-roboto');
    
    // Add the selected font class
    const fontClass = font === 'outfit' ? 'font-outfit' : font === 'roboto' ? 'font-roboto' : 'font-inter';
    document.documentElement.classList.add(fontClass);
  }, [font]);

  return <>{children}</>;
}
