
import prisma from "@/lib/prisma";
import { DaycareSettingsClient } from "./client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminDaycareSettingsPage({ params }: { params: { id: string } }) {
    const daycare = await prisma.daycare.findUnique({
        where: { id: params.id },
        include: {
            users: {
                orderBy: {
                    createdAt: 'asc',
                },
                take: 1,
            },
        },
    });

    if (!daycare) {
        notFound();
    }

    const adminUser = daycare.users[0] || null;

    return (
        <div className="space-y-6">
            <Link href="/admin/daycares">
                <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to All Daycares
                </Button>
            </Link>
            <DaycareSettingsClient daycare={daycare} adminUser={adminUser} />
        </div>
    );
}
