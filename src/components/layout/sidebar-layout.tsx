"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Upload,
  Settings,
  LogOut,
  Menu,
  X,
  GraduationCap,
  ChevronRight,
  Moon,
  Sun,
  Bell,
} from "lucide-react";
import { useTheme } from "next-themes";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

interface SidebarLayoutProps {
  children: React.ReactNode;
  role: "admin" | "guru_wali";
  userName: string;
}

const adminNav: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/guru", label: "Guru Wali", icon: Users },
  { href: "/admin/siswa", label: "Data Siswa", icon: GraduationCap },
  { href: "/admin/jurnal", label: "Jurnal", icon: BookOpen },
  { href: "/admin/import", label: "Import Data", icon: Upload },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

const guruNav: NavItem[] = [
  { href: "/guru/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/guru/siswa", label: "Siswa Bimbingan", icon: GraduationCap },
  { href: "/guru/jurnal", label: "Jurnal", icon: BookOpen },
];

export function SidebarLayout({ children, role, userName }: SidebarLayoutProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const navItems = role === "admin" ? adminNav : guruNav;

  const NavLinks = () => (
    <nav className="space-y-1 flex-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsMobileOpen(false)}
            className={cn(
              "sidebar-link group",
              isActive && "active"
            )}
          >
            <item.icon size={18} className={cn(isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
            <span className="flex-1">{item.label}</span>
            {isActive && <ChevronRight size={14} className="text-primary" />}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex h-screen bg-muted/30 dark:bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card h-full shrink-0">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-sm">
              <BookOpen size={18} className="text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-foreground leading-tight">Jurnal 7KAIH</p>
              <p className="text-xs text-muted-foreground">Digital</p>
            </div>
          </div>
        </div>

        {/* Role badge */}
        <div className="px-4 py-3 border-b border-border">
          <span className={cn(
            "inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium",
            role === "admin"
              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
              : "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400"
          )}>
            {role === "admin" ? "Administrator" : "Guru Wali"}
          </span>
        </div>

        {/* Navigation */}
        <div className="flex flex-col flex-1 p-4 gap-4 overflow-y-auto">
          <NavLinks />
        </div>

        {/* Bottom */}
        <div className="p-4 border-t border-border space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userName}</p>
            </div>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="sidebar-link w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
          >
            <LogOut size={18} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full w-72 bg-card border-r border-border z-50 flex flex-col transition-transform duration-300 lg:hidden",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center">
              <BookOpen size={18} className="text-white" />
            </div>
            <p className="font-display font-bold text-foreground">Jurnal 7KAIH</p>
          </div>
          <button onClick={() => setIsMobileOpen(false)} className="text-muted-foreground">
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-col flex-1 p-4 overflow-y-auto">
          <NavLinks />
        </div>
        <div className="p-4 border-t border-border">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="sidebar-link w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut size={18} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-card border-b border-border flex items-center px-4 gap-4 shrink-0">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <Menu size={22} />
          </button>
          <div className="flex-1" />
          <button className="text-muted-foreground hover:text-foreground">
            <Bell size={20} />
          </button>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-muted-foreground hover:text-foreground hidden lg:block"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
