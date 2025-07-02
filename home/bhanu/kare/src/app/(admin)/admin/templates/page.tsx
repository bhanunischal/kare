
import prisma from "@/lib/prisma";
import AdminTemplatesClient from "./client";

export default async function AdminTemplatesPage() {
    const daycares = await prisma.daycare.findMany({
        where: { status: 'ACTIVE' },
        select: {
            id: true,
            name: true,
        },
        orderBy: {
            name: 'asc'
        }
    });

    return <AdminTemplatesClient allDaycares={daycares} />;
}
