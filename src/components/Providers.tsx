"use client";

import { ThemeProvider } from "next-themes";
import { AppCustomizer } from "@/components/layout/AppCustomizer";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AppCustomizer>
          {children}
        </AppCustomizer>
      </ThemeProvider>
    </SessionProvider>
  );
}
