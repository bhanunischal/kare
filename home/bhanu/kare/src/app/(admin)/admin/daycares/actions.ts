
'use server';

import prisma from "@/lib/prisma";
import type { DaycareStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from 'zod';
import bcrypt from 'bcryptjs';

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
        revalidatePath(`/admin/daycares/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to update daycare status:", error);
        return { error: "Could not update daycare status." };
    }
}

const UpdateDaycareSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(2, { message: 'Daycare name must be at least 2 characters.' }),
    plan: z.string().min(1, { message: 'A plan must be selected.' }),
    address: z.string().optional(),
});

export async function updateDaycareDetails(prevState: any, formData: FormData) {
    const validatedFields = UpdateDaycareSchema.safeParse({
        id: formData.get('id'),
        name: formData.get('name'),
        plan: formData.get('plan'),
        address: formData.get('address'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Please review the form and correct any errors.',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { id, ...dataToUpdate } = validatedFields.data;

    try {
        await prisma.daycare.update({
            where: { id },
            data: dataToUpdate,
        });

        revalidatePath('/admin/daycares');
        revalidatePath(`/admin/daycares/${id}`);
        return { message: 'Daycare details updated successfully!', errors: null };
    } catch (error) {
        console.error("Failed to update daycare:", error);
        return {
            message: 'An unexpected error occurred while updating details.',
            errors: { _form: ['Database error.'] },
        };
    }
}

const ResetPasswordSchema = z.object({
    userId: z.string().min(1),
    password: z.string().min(8, { message: 'New password must be at least 8 characters.' }),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
});


export async function resetDaycareAdminPassword(prevState: any, formData: FormData) {
    const validatedFields = ResetPasswordSchema.safeParse({
        userId: formData.get('userId'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Please review the form and correct any errors.',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    
    const { userId, password } = validatedFields.data;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        return { message: 'Password has been reset successfully!', errors: null };
    } catch (error) {
        console.error("Failed to reset password:", error);
        return {
            message: 'An unexpected error occurred while resetting the password.',
            errors: { _form: ['Database error.'] },
        };
    }
}
