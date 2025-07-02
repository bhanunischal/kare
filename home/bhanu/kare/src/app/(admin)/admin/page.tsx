
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Building, Users, DollarSign, Users2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import prisma from "@/lib/prisma"

export default async function AdminDashboardPage() {
  const daycareCount = await prisma.daycare.count();
  const childrenCount = await prisma.child.count();
  const staffCount = await prisma.staff.count();
  
  const recentSignups = await prisma.daycare.findMany({
    take: 5,
    orderBy: {
        createdAt: 'desc'
    }
  });

  const stats = {
    totalDaycares: daycareCount,
    totalChildren: childrenCount,
    totalStaff: staffCount,
  };

  const statusCards = [
    { title: "Total Daycares", value: stats.totalDaycares.toString(), icon: <Building className="h-6 w-6 text-muted-foreground" /> },
    { title: "Total Children", value: stats.totalChildren.toString(), icon: <Users className="h-6 w-6 text-muted-foreground" /> },
    { title: "Total Staff", value: stats.totalStaff.toString(), icon: <Users2 className="h-6 w-6 text-muted-foreground" /> },
    { title: "Total MRR (mock)", value: `$${(stats.totalDaycares * 99).toLocaleString()}`, icon: <DollarSign className="h-6 w-6 text-muted-foreground" /> },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of the Child Care Ops platform.</p>
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

      <Card>
          <CardHeader>
            <CardTitle className="font-headline">Recent Signups</CardTitle>
            <CardDescription>The most recently registered daycare centers.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Daycare Name</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Join Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSignups.length > 0 ? recentSignups.map(daycare => (
                     <TableRow key={daycare.id}>
                        <TableCell className="font-medium">{daycare.name}</TableCell>
                        <TableCell><Badge variant="outline">{daycare.plan}</Badge></TableCell>
                        <TableCell>
                          <Badge 
                            variant={daycare.status === 'ACTIVE' ? 'default' : daycare.status === 'PENDING' ? 'secondary' : 'destructive'}
                          >
                            {daycare.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{format(new Date(daycare.createdAt), 'PPP')}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">No recent signups.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
          </CardContent>
        </Card>
    </div>
  );
}
