
"use client";

import { AppContextProvider } from "@/contexts/app-context";
import type { ReactNode } from "react";

function AppContextProviderWithRouter({ children }: { children: ReactNode }) {
    return (
        <AppContextProvider>
            {children}
        </AppContextProvider>
    );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
      <AppContextProviderWithRouter>{children}</AppContextProviderWithRouter>
  );
}

    

    