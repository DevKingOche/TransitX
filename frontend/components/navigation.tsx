"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useWallet } from "@/hooks/use-wallet";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "next-themes";
import { Moon, Sun, Wallet, LogOut, LayoutDashboard, Package } from "lucide-react";
import { Button } from "@/components/ui";

const NAV_LINKS = [
  { href: "/shipments", label: "Shipments" },
  { href: "/carriers", label: "Carriers" },
  { href: "/analytics", label: "Analytics" },
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { shortAddress, isConnected, connecting, connect, disconnect } = useWallet();
  const { theme, setTheme } = useTheme();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    disconnect();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <Package className="h-5 w-5 text-brand-500" />
          TransitX
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`text-sm font-medium transition-colors hover:text-foreground ${
                  pathname.startsWith(l.href)
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-md p-2 hover:bg-accent"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <Link href="/dashboard" className="rounded-md p-2 hover:bg-accent" aria-label="Dashboard">
            <LayoutDashboard size={16} />
          </Link>

          <Button
            variant={isConnected ? "secondary" : "primary"}
            size="sm"
            onClick={isConnected ? undefined : connect}
            disabled={connecting}
          >
            <Wallet size={14} className="mr-1.5" />
            {connecting ? "Connecting…" : isConnected ? shortAddress : "Connect Wallet"}
          </Button>

          <button
            onClick={handleSignOut}
            className="rounded-md p-2 hover:bg-accent"
            aria-label="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </nav>
    </header>
  );
}
