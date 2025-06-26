import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { 
    LayoutDashboard,
    Users,
    ClipboardCheck,
    Users2,
    MessageSquare,
    CreditCard,
    BadgeDollarSign,
    BrainCircuit,
    FileText
} from "lucide-react";
import Link from "next/link";

const navItems = [
    { href: "/dashboard", icon: <LayoutDashboard />, text: "Dashboard" },
    { href: "/dashboard/enrollment", icon: <FileText />, text: "Enrollment" },
    { href: "/dashboard/attendance", icon: <ClipboardCheck />, text: "Attendance" },
    { href: "/dashboard/staff", icon: <Users2 />, text: "Staff" },
    { href: "/dashboard/communication", icon: <MessageSquare />, text: "Communication" },
    { href: "/dashboard/billing", icon: <CreditCard />, text: "Billing" },
    { href: "/dashboard/subsidies", icon: <BadgeDollarSign />, text: "Subsidies" },
    { href: "/dashboard/waitlist-analytics", icon: <BrainCircuit />, text: "Waitlist Analytics" },
];

export function DashboardNav() {
  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href}>
            <SidebarMenuButton tooltip={item.text}>
              {item.icon}
              <span className="group-data-[collapsible=icon]:hidden">{item.text}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
