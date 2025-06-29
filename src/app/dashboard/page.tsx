
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Users, Cake, CheckCircle, BellRing } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const statusCards = [
    { title: "Children Present", value: "68 / 72", icon: <Users className="h-6 w-6 text-muted-foreground" /> },
    { title: "Upcoming Birthdays", value: "2 this week", icon: <Cake className="h-6 w-6 text-muted-foreground" /> },
    { title: "Staff on Duty", value: "8", icon: <CheckCircle className="h-6 w-6 text-muted-foreground" /> },
    { title: "Pending Invoices", value: "3", icon: <BellRing className="h-6 w-6 text-muted-foreground" /> }
]

const recentActivities = [
    { name: "Liam Garcia", action: "Checked In", time: "2m ago", photo: "https://placehold.co/40x40.png", hint: "young boy" },
    { name: "Broadcast", action: "Field trip reminder sent", time: "1h ago", photo: null },
    { name: "Olivia Martin", action: "Checked Out", time: "3h ago", photo: "https://placehold.co/40x40.png", hint: "young girl" },
    { name: "New Document", action: "Parent Handbook uploaded", time: "1d ago", photo: null },
    { name: "Emma Rodriguez", action: "Invoice #INV003 created", time: "2d ago", photo: "https://placehold.co/40x40.png", hint: "toddler girl" },
]

export default function DashboardPage() {
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
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>A live feed of recent events.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivities.map((activity, index) => (
                     <TableRow key={index}>
                        <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    {activity.photo ? <AvatarImage src={activity.photo} data-ai-hint={activity.hint} /> : null }
                                    <AvatarFallback>{activity.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <span className="font-semibold">{activity.name}</span>
                                    <div className="text-xs text-muted-foreground">{activity.action}</div>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">{activity.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks at your fingertips.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button>Check-in a Child</Button>
            <Button variant="secondary">Send Announcement</Button>
            <Button variant="secondary">Add Staff Member</Button>
            <Button variant="secondary">Log Expense</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
