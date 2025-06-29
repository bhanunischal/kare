
"use client"

import Link from "next/link";
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { 
    LayoutDashboard,
    ClipboardCheck,
    Users2,
    MessageSquare,
    CreditCard,
    BadgeDollarSign,
    BrainCircuit,
    FileText,
    Wallet,
    LineChart,
    FolderKanban,
    Images,
    ClipboardList,
    FilePenLine,
    LayoutTemplate
} from "lucide-react";

const navItems = [
    { href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5 md:h-4 md:w-4" />, text: "Dashboard" },
    // { href: "/dashboard/enrollment", icon: <FileText className="h-5 w-5 md:h-4 md:w-4" />, text: "Enrollment" },
    // { href: "/dashboard/attendance", icon: <ClipboardCheck className="h-5 w-5 md:h-4 md:w-4" />, text: "Attendance" },
    // { href: "/dashboard/activities", icon: <ClipboardList className="h-5 w-5 md:h-4 md:w-4" />, text: "Activities" },
    // { href: "/dashboard/assessments", icon: <FilePenLine className="h-5 w-5 md:h-4 md:w-4" />, text: "Assessments" },
    // { href: "/dashboard/templates", icon: <LayoutTemplate className="h-5 w-5 md:h-4 md:w-4" />, text: "Templates" },
    // { href: "/dashboard/staff", icon: <Users2 className="h-5 w-5 md:h-4 md:w-4" />, text: "Staff" },
    // { href: "/dashboard/communication", icon: <MessageSquare className="h-5 w-5 md:h-4 md:w-4" />, text: "Communication" },
    // { href: "/dashboard/billing", icon: <CreditCard className="h-5 w-5 md:h-4 md:w-4" />, text: "Billing" },
    // { href: "/dashboard/expenses", icon: <Wallet className="h-5 w-5 md:h-4 md:w-4" />, text: "Expenses" },
    // { href: "/dashboard/documents", icon: <FolderKanban className="h-5 w-5 md:h-4 md-w-4" />, text: "Documents" },
    // { href: "/dashboard/gallery", icon: <Images className="h-5 w-5 md:h-4 md:w-4" />, text: "Gallery" },
    // { href: "/dashboard/reports", icon: <LineChart className="h-5 w-5 md:h-4 md:w-4" />, text: "Reports" },
    // { href: "/dashboard/subsidies", icon: <BadgeDollarSign className="h-5 w-5 md:h-4 md-w-4" />, text: "Subsidies" },
    // { href: "/dashboard/waitlist-analytics", icon: <BrainCircuit className="h-5 w-5 md:h-4 md:w-4" />, text: "Waitlist Analytics" },
];

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <>
      {navItems.map((item) => {
        const isActive = item.href === '/dashboard' 
          ? pathname === item.href 
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
