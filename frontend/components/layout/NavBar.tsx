"use client";

import { FlaskConical, PanelRight, PanelRightClose, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";

interface NavBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function NavBar({ sidebarOpen, onToggleSidebar }: NavBarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header
      className="sticky top-0 z-50 glass border-b"
      style={{ borderColor: "var(--glass-border)" }}
    >
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ background: "var(--apple-blue)" }}
          >
            <FlaskConical className="h-4 w-4 text-white" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            Research Assistant
          </span>
          <span
            className="hidden text-xs font-medium sm:inline-block px-2 py-0.5 rounded-full"
            style={{
              background: "var(--apple-surface-2)",
              color: "var(--apple-text-secondary)",
            }}
          >
            Hybrid RAG
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Dark / light mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle light / dark mode"
            className="h-8 w-8"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* Sidebar toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            aria-label={sidebarOpen ? "Close settings panel" : "Open settings panel"}
            className="h-8 w-8"
          >
            {sidebarOpen ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
