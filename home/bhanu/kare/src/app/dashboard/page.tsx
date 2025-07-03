
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Users, Cake, CheckCircle, BellRing, UserPlus, MessageSquare, Wallet, FileText } from 'lucide-react'
import { Button } from "@/components/ui/button"
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  // TODO: Scope this to the logged-in user's daycareId once session management is implemented.
  const daycare = await prisma.daycare.findFirst();

  let childrenCount = 0;
  let staffCount = 0;

  if (daycare) {
    childrenCount = await prisma.child.count({ where: { daycareId: daycare.id, status: 'Active' } });
    staffCount = await prisma.staff.count({ where: { daycareId: daycare.id, status: 'Active' } });
  }

  const statusCards = [
    { title: "Children Present", value: `${childrenCount} / ${childrenCount}`, icon: <Users className="h-6 w-6 text-muted-foreground" /> },
    { title: "Upcoming Birthdays", value: "0 this week", icon: <Cake className="h-6 w-6 text-muted-foreground" /> },
    { title: "Staff on Duty", value: staffCount.toString(), icon: <CheckCircle className="h-6 w-6 text-muted-foreground" /> },
    { title: "Pending Invoices", value: "0", icon: <BellRing className="h-6 w-6 text-muted-foreground" /> }
  ]
  
  const quickActions = [
      { href: "/dashboard/enrollment", text: "Enroll New Child", icon: <UserPlus className="h-5 w-5" /> },
      { href: "/dashboard/communication", text: "Send Announcement", icon: <MessageSquare className="h-5 w-5" /> },
      { href: "/dashboard/staff", text: "Add Staff Member", icon: <Users className="h-5 w-5" /> },
      { href: "/dashboard/expenses", text: "Log Expense", icon: <Wallet className="h-5 w-5" /> },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's a snapshot of your daycare today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statusCards.map(card => (
            <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    {card.icon}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                </CardContent>
            </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Announcements & Reminders</CardTitle>
            <CardDescription>Key updates and upcoming events.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-center justify-center rounded-md border border-dashed">
                <p className="text-sm text-muted-foreground">No new announcements.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks at your fingertips.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
             {quickActions.map(action => (
                <Link key={action.href} href={action.href} passHref>
                    <Button variant="outline" className="w-full h-full flex flex-col gap-2 p-4 text-center">
                        {action.icon}
                        <span className="text-sm">{action.text}</span>
                    </Button>
                </Link>
             ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
