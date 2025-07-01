
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import prisma from "@/lib/prisma";
import { DaycaresClient } from "./client";

export default async function AdminDaycaresPage() {
  const daycares = await prisma.daycare.findMany({
    include: {
      _count: {
        select: {
          children: true,
          staff: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedDaycares = daycares.map(dc => ({
      ...dc,
      joinDate: dc.createdAt.toISOString(),
      childrenCount: dc._count.children,
      staffCount: dc._count.staff,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Daycare Management</h1>
          <p className="text-muted-foreground">Manage all daycare centers on the platform.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Daycare
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Daycares</CardTitle>
          <CardDescription>A list of all registered daycare centers.</CardDescription>
        </CardHeader>
        <CardContent>
          <DaycaresClient daycares={formattedDaycares} />
        </CardContent>
      </Card>
    </div>
  );
}
