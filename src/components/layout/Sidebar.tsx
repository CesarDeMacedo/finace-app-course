"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ArrowLeftRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/portfolio", label: "Portfolio", icon: TrendingUp },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 border-r bg-card flex flex-col p-4 shrink-0">
      <h1 className="text-xl font-bold mb-6 px-2 text-primary">FinTrack</h1>
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === href
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
        <ThemeToggle />
      </nav>
    </aside>
  );
}
