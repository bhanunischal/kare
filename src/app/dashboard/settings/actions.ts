'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const SettingsSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(2, { message: 'Daycare name must be at least 2 characters.' }),
    licenseNumber: z.string().optional(),
    contactEmail: z.string().email({ message: 'Please enter a valid email.' }),
    contactPhone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
    address: z.string().min(5, { message: 'Please enter a valid address.' }),
    infantCapacity: z.coerce.number().int().nonnegative(),
    toddlerCapacity: z.coerce.number().int().nonnegative(),
    preschoolCapacity: z.coerce.number().int().nonnegative(),
    gradeschoolerCapacity: z.coerce.number().int().nonnegative(),
});

export async function updateSettings(prevState: any, formData: FormData) {
    // TODO: Get daycareId from session once implemented
    const daycare = await prisma.daycare.findFirst();
    if (!daycare) {
        return { message: 'Daycare not found.', errors: { _form: ['Daycare not found.'] } };
    }

    const validatedFields = SettingsSchema.safeParse({
        id: daycare.id,
        name: formData.get('daycareName'),
        licenseNumber: formData.get('licenseNumber'),
        contactEmail: formData.get('contactEmail'),
        contactPhone: formData.get('contactPhone'),
        address: formData.get('address'),
        infantCapacity: formData.get('infantCapacity'),
        toddlerCapacity: formData.get('toddlerCapacity'),
        preschoolCapacity: formData.get('preschoolCapacity'),
        gradeschoolerCapacity: formData.get('gradeschoolerCapacity'),
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

        revalidatePath('/dashboard/settings');
        return { message: 'Settings updated successfully!', errors: null };
    } catch (error) {
        console.error('Failed to update settings:', error);
        return {
            message: 'An unexpected error occurred while saving settings.',
            errors: { _form: ['Database error.'] },
        };
    }
}

export async function connectStorage(daycareId: string, provider: string) {
    if (!daycareId || !provider) {
        return { success: false, message: 'Invalid daycare ID or provider.' };
    }

    try {
        await prisma.daycare.update({
            where: { id: daycareId },
            data: { storageProvider: provider },
        });
        revalidatePath('/dashboard/settings');
        return { success: true, message: `Successfully connected to ${provider}.` };
    } catch (error) {
        console.error("Failed to connect storage provider:", error);
        return { success: false, message: 'Could not connect to storage provider.' };
    }
}

export async function disconnectStorage(daycareId: string) {
     if (!daycareId) {
        return { success: false, message: 'Invalid daycare ID.' };
    }
    try {
        await prisma.daycare.update({
            where: { id: daycareId },
            data: { storageProvider: null },
        });
        revalidatePath('/dashboard/settings');
        return { success: true, message: 'Successfully disconnected from storage provider.' };
    } catch (error) {
        console.error("Failed to disconnect storage provider:", error);
        return { success: false, message: 'Could not disconnect from storage provider.' };
    }
}
