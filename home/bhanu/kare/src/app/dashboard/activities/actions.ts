
'use server';

import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const ActivityFormSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters." }),
    date: z.string().min(1, { message: "Date is required." }),
    time: z.string().min(1, { message: "Time is required." }),
    category: z.string().min(1, { message: "Category is required." }),
    description: z.string().optional(),
    materials: z.string().optional(),
    domains: z.array(z.string()).optional().default([]),
});

export async function createActivity(prevState: any, formData: FormData) {
    const validatedFields = ActivityFormSchema.safeParse({
        title: formData.get('title'),
        date: formData.get('date'),
        time: formData.get('time'),
        category: formData.get('category'),
        description: formData.get('description'),
        materials: formData.get('materials'),
        domains: formData.getAll('domains'),
    });

    if (!validatedFields.success) {
        return { message: "Invalid form data.", errors: validatedFields.error.flatten().fieldErrors };
    }

    const daycare = await prisma.daycare.findFirst();
    if (!daycare) {
        return { message: "Daycare not found.", errors: { _form: ["No daycare configured."] } };
    }

    try {
        const { date, ...rest } = validatedFields.data;
        await prisma.activity.create({
            data: {
                ...rest,
                date: new Date(date),
                daycareId: daycare.id,
            }
        });
        revalidatePath('/dashboard/activities');
        return { message: "Activity created successfully.", errors: null };
    } catch (error) {
        console.error("Failed to create activity:", error);
        return { message: "Database error.", errors: { _form: ["Could not create activity."] } };
    }
}

const UpdateActivityFormSchema = ActivityFormSchema.extend({
    id: z.string().min(1),
});

export async function updateActivity(prevState: any, formData: FormData) {
    const validatedFields = UpdateActivityFormSchema.safeParse({
        id: formData.get('id'),
        title: formData.get('title'),
        date: formData.get('date'),
        time: formData.get('time'),
        category: formData.get('category'),
        description: formData.get('description'),
        materials: formData.get('materials'),
        domains: formData.getAll('domains'),
    });

    if (!validatedFields.success) {
        return { message: "Invalid form data.", errors: validatedFields.error.flatten().fieldErrors };
    }
    
    try {
        const { id, date, ...rest } = validatedFields.data;
        await prisma.activity.update({
            where: { id },
            data: {
                ...rest,
                date: new Date(date),
            }
        });
        revalidatePath('/dashboard/activities');
        return { message: "Activity updated successfully.", errors: null };
    } catch (error) {
        console.error("Failed to update activity:", error);
        return { message: "Database error.", errors: { _form: ["Could not update activity."] } };
    }
}

export async function deleteActivity(id: string) {
    try {
        await prisma.activity.delete({
            where: { id },
        });
        revalidatePath('/dashboard/activities');
        return { success: true };
    } catch (error) {
        console.error("Failed to delete activity:", error);
        return { success: false, error: "Could not delete activity." };
    }
}
