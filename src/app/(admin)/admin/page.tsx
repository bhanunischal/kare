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
import { format } from "date-fns"
import { Daycare } from "@prisma/client";
import { useEffect, useState } from "react";

// This component is now a client component to fetch data on the client side.
// In a real-world scenario with sessions, this data would be fetched on the server
// and passed down.

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalDaycares: 0,
    totalChildren: 0,
    totalMRR: 0,
    newSignups: 0
  });
  const [recentSignups, setRecentSignups] = useState<Daycare[]>([]);

  useEffect(() => {
    // This is a placeholder for fetching data. In a real app, you'd fetch this from an API route.
    // For now, we'll keep it simple and demonstrate the structure.
    // The server-side fetching is done in the /admin/daycares page.
    setStats({
        totalDaycares: 5,
        totalChildren: 277,
        totalMRR: 4500,
        newSignups: 1,
    });
    // This would be a fetch to an API route like /api/admin/recent-signups
    setRecentSignups([]); 
  }, []);

  const statusCards = [
    { title: "Total Daycares", value: stats.totalDaycares.toString(), icon: <Building className="h-6 w-6 text-muted-foreground" /> },
    { title: "Total Children", value: stats.totalChildren.toString(), icon: <Users className="h-6 w-6 text-muted-foreground" /> },
    { title: "Total MRR", value: `$${stats.totalMRR.toLocaleString()}`, icon: <DollarSign className="h-6 w-6 text-muted-foreground" /> },
    { title: "New Signups (30d)", value: stats.newSignups.toString(), icon: <UserPlus className="h-6 w-6 text-muted-foreground" /> }
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
