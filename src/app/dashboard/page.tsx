import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Activity, Users, UserCheck, FileWarning, DollarSign } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const statusCards = [
    { title: "Total Children", value: "72", icon: <Users className="h-6 w-6 text-muted-foreground" /> },
    { title: "Children Present", value: "65", icon: <UserCheck className="h-6 w-6 text-muted-foreground" /> },
    { title: "Staff on Duty", value: "10", icon: <Activity className="h-6 w-6 text-muted-foreground" /> },
    { title: "Unpaid Invoices", value: "5", icon: <FileWarning className="h-6 w-6 text-muted-foreground" /> }
]

const recentActivities = [
    { name: "Liam Johnson", activity: "Checked In", time: "9:02 AM" },
    { name: "Olivia Smith", activity: "Checked Out", time: "9:00 AM" },
    { name: "Noah Williams", activity: "Incident Report Filed", time: "8:45 AM" },
    { name: "Emma Brown", activity: "Checked In", time: "8:30 AM" },
    { name: "Ava Jones", activity: "Payment Received", time: "8:15 AM" }
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
            <CardTitle className="font-headline">Recent Activity</CardTitle>
            <CardDescription>A log of the most recent check-ins, check-outs, and other important events.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Child</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivities.map(activity => (
                     <TableRow key={activity.name}>
                        <TableCell className="font-medium">{activity.name}</TableCell>
                        <TableCell>{activity.activity}</TableCell>
                        <TableCell className="text-right">{activity.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </CardContent>
        </Card>

         <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Announcements</CardTitle>
            <CardDescription>Recent updates for parents and staff.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-secondary rounded-lg">
                <h4 className="font-semibold text-sm">Field Trip Reminder</h4>
                <p className="text-sm text-muted-foreground">Don't forget, the field trip to the science museum is this Friday! Please sign permission slips by tomorrow.</p>
            </div>
             <div className="p-3 bg-secondary rounded-lg">
                <h4 className="font-semibold text-sm">Holiday Closure</h4>
                <p className="text-sm text-muted-foreground">The center will be closed next Monday for the public holiday.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
