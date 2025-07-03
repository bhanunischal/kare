
import prisma from "@/lib/prisma";
import ActivitiesClient from "./client";

export const dynamic = 'force-dynamic';

export default async function ActivitiesPage() {
    // TODO: Scope this to the logged-in user's daycareId once session management is implemented.
    const daycare = await prisma.daycare.findFirst();

    const activities = daycare ? await prisma.activity.findMany({
        where: { daycareId: daycare.id },
        orderBy: { date: 'desc' }
    }) : [];

    const serializedActivities = activities.map(act => ({
        ...act,
        date: act.date.toISOString().split('T')[0], // Serialize date to 'yyyy-MM-dd' string
        createdAt: act.createdAt.toISOString(),
        updatedAt: act.updatedAt.toISOString(),
    }));

    return <ActivitiesClient initialActivities={serializedActivities} />;
}
