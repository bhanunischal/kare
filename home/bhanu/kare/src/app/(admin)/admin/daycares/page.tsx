
import prisma from "@/lib/prisma";
import { DaycaresClient } from "./client";
import type { Daycare } from "@prisma/client";

export const dynamic = 'force-dynamic';

type DaycareWithCounts = Daycare & {
    _count: {
        children: number;
        staff: number;
    }
}

export default async function AdminDaycaresPage() {
  const daycares: DaycareWithCounts[] = await prisma.daycare.findMany({
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
      id: dc.id,
      name: dc.name,
      status: dc.status,
      plan: dc.plan,
      address: dc.address,
      joinDate: dc.createdAt.toISOString(),
      childrenCount: dc._count.children,
      staffCount: dc._count.staff,
  }));

  return <DaycaresClient daycares={formattedDaycares} />;
}
