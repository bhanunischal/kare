"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Users } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! The system is online.</p>
      </div>

      <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Users className="h-6 w-6 text-muted-foreground" />
          </Header>
          <CardContent>
              <div className="text-2xl font-bold">System is Online</div>
               <p className="text-xs text-muted-foreground">Dashboard content is being rebuilt to fix a loading issue.</p>
          </CardContent>
      </Card>
    </div>
  );
}
