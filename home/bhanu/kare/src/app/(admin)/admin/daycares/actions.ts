
'use server';

import prisma from "@/lib/prisma";
import type { DaycareStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from 'zod';

const CreateDaycareSchema = z.object({
    name: z.string().min(2, { message: 'Daycare name must be at least 2 characters.'}),
    plan: z.string().min(1, { message: 'A plan must be selected.'}),
});


export async function createDaycare(prevState: any, formData: FormData) {
    const validatedFields = CreateDaycareSchema.safeParse({
        name: formData.get('name'),
        plan: formData.get('plan'),
    });

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors.name?.[0] || validatedFields.error.flatten().fieldErrors.plan?.[0] || 'Invalid data provided.'
        };
    }

    try {
        await prisma.daycare.create({
            data: {
                name: validatedFields.data.name,
                plan: validatedFields.data.plan,
                status: 'PENDING',
            },
        });
        
        revalidatePath('/admin/daycares');
        return { error: null };
    } catch (error) {
        console.error("Failed to create daycare:", error);
        return { error: "Could not create daycare." };
    }
}


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
