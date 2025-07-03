
import prisma from "@/lib/prisma";
import { DaycaresClient } from "./client";
import type { Daycare, User } from "@prisma/client";

export const dynamic = 'force-dynamic';

export type DaycareWithDetails = Daycare & {
    _count: {
        children: number;
        staff: number;
    },
    users: User[]
}

export default async function AdminDaycaresPage() {
  const daycares: DaycareWithDetails[] = await prisma.daycare.findMany({
    include: {
      _count: {
        select: {
          children: true,
          staff: true,
        },
      },
      users: {
        orderBy: {
            createdAt: 'asc',
        },
        take: 1
      }
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
      adminUser: dc.users[0] || null,
      // Pass the full daycare object for the dialog
      ...dc
  }));

  return <DaycaresClient daycares={formattedDaycares} />;
}
