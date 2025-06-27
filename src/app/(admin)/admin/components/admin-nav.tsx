
"use client"

import Link from "next/link";
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { 
    LayoutDashboard,
    Building,
    LayoutTemplate,
    Settings
} from "lucide-react";

const navItems = [
    { href: "/admin", icon: <LayoutDashboard className="h-5 w-5 md:h-4 md:w-4" />, text: "Dashboard" },
    { href: "/admin/daycares", icon: <Building className="h-5 w-5 md:h-4 md:w-4" />, text: "Daycares" },
    { href: "/admin/templates", icon: <LayoutTemplate className="h-5 w-5 md:h-4 md:w-4" />, text: "Templates" },
    { href: "/admin/settings", icon: <Settings className="h-5 w-5 md:h-4 md:w-4" />, text: "Settings" },
];

export function AdminNav() {
  const pathname = usePathname()

  return (
    <>
      {navItems.map((item) => {
        const isActive = item.href === '/admin' 
          ? pathname === item.href || pathname === '/admin/dashboard'
          : pathname.startsWith(item.href);
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-4 md:gap-3 rounded-md px-3 py-2 text-sidebar-foreground/70 transition-all hover:text-sidebar-foreground hover:bg-sidebar-accent",
              isActive && "bg-sidebar-accent text-sidebar-foreground"
            )}
          >
            {item.icon}
            {item.text}
          </Link>
        )
      })}
    </>
  );
}
