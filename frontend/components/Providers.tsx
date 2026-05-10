"use client";

// Kept as a client boundary wrapper — add future client-only providers here.
export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
