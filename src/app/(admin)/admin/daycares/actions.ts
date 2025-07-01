
'use server';

import prisma from "@/lib/prisma";
import type { DaycareStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateDaycareStatus(id: string, newStatus: DaycareStatus) {
    try {
        await prisma.daycare.update({
            where: { id },
            data: { status: newStatus },
        });

        revalidatePath('/admin/daycares');
        return { success: true };
    } catch (error) {
        console.error("Failed to update daycare status:", error);
        return { error: "Could not update daycare status." };
    }
}
