
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Building, Users, DollarSign, UserPlus } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { allDaycares } from "./daycares/data"
import { format } from "date-fns"

const statusCards = [
    { title: "Total Daycares", value: "5", icon: <Building className="h-6 w-6 text-muted-foreground" /> },
    { title: "Total Children", value: "277", icon: <Users className="h-6 w-6 text-muted-foreground" /> },
    { title: "Total MRR", value: "$4,500", icon: <DollarSign className="h-6 w-6 text-muted-foreground" /> },
    { title: "New Signups (30d)", value: "1", icon: <UserPlus className="h-6 w-6 text-muted-foreground" /> }
]

const recentSignups = allDaycares.slice(0, 5).sort((a,b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of the CareOps platform.</p>
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
                  {recentSignups.map(daycare => (
                     <TableRow key={daycare.id}>
                        <TableCell className="font-medium">{daycare.name}</TableCell>
                        <TableCell><Badge variant="outline">{daycare.plan}</Badge></TableCell>
                        <TableCell>
                          <Badge 
                            variant={daycare.status === 'Active' ? 'default' : daycare.status === 'Pending' ? 'secondary' : 'destructive'}
                          >
                            {daycare.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{format(new Date(daycare.joinDate.replace(/-/g, '/')), 'PPP')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </CardContent>
        </Card>
    </div>
  );
}
