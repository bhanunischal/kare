import prisma from "@/lib/prisma";
import SettingsClient from "./client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    // TODO: This should be scoped to a daycareId from the user's session
    const daycare = await prisma.daycare.findFirst();

    if (!daycare) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Error</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Could not load daycare settings. Please ensure your account is set up correctly.</p>
                </CardContent>
            </Card>
        )
    }

    return <SettingsClient daycare={daycare} />;
}
