"use client";

import { cn } from "@/lib/utils";
import { Search, BarChart2 } from "lucide-react";

export type ActiveTab = "ask" | "evaluation";

interface TabNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const TABS: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
  { id: "ask", label: "Ask", icon: Search },
  { id: "evaluation", label: "Evaluation", icon: BarChart2 },
];

export function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <div
      className="inline-flex items-center gap-1 rounded-xl p-1"
      style={{
        background: "var(--apple-surface-2)",
      }}
      role="tablist"
      aria-label="Main navigation"
    >
      {TABS.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            role="tab"
            id={`tab-${id}`}
            aria-selected={isActive}
            aria-controls={`panel-${id}`}
            onClick={() => onTabChange(id)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            style={
              isActive
                ? { boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }
                : undefined
            }
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
