
'use server';

import {z} from 'zod';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const StaffFormSchema = z.object({
  name: z.string().min(1, {message: "Staff member's name is required."}),
  role: z.string().min(1, {message: 'Role is required.'}),
  startDate: z.string().min(1, {message: 'Start date is required.'}),
  phone: z
    .string()
    .min(10, {message: 'A valid phone number is required.'}),
  address: z.string().min(1, {message: 'Address is required.'}),
  emergencyName: z
    .string()
    .min(1, {message: 'Emergency contact name is required.'}),
  emergencyPhone: z
    .string()
    .min(10, {message: 'A valid emergency contact phone is required.'}),
  payType: z.string().min(1, {message: 'Pay type is required.'}),
  payRate: z.coerce.number().positive({message: 'Pay rate must be a positive number.'}),
  certifications: z.string().optional(),
  notes: z.string().optional(),
});

export type StaffFormData = z.infer<typeof StaffFormSchema>;
export type StaffStatus = "Active" | "Inactive" | "Archived";

export async function addStaffMember(prevState: any, formData: FormData) {
  const validatedFields = StaffFormSchema.safeParse({
    name: formData.get('name'),
    role: formData.get('role'),
    startDate: formData.get('start-date'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    emergencyName: formData.get('emergency-name'),
    emergencyPhone: formData.get('emergency-phone'),
    certifications: formData.get('certifications'),
    notes: formData.get('notes'),
    payType: formData.get('pay-type'),
    payRate: formData.get('pay-rate'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Please review the form and correct any errors.',
      errors: validatedFields.error.flatten().fieldErrors,
      data: null,
    };
  }

  // TODO: Replace with daycareId from the user's session once implemented.
  const daycare = await prisma.daycare.findFirst();

  if (!daycare) {
      return {
          message: 'No active daycare found to associate this staff member with. Please contact support.',
          errors: { _form: ['System error: No daycare available.'] },
          data: null,
      };
  }

  try {
    const { startDate, ...rest } = validatedFields.data;
    await prisma.staff.create({
      data: {
        ...rest,
        startDate: new Date(startDate),
        status: 'Active',
        daycareId: daycare.id,
        photoUrl: 'https://placehold.co/100x100.png',
        photoHint: 'professional portrait',
      }
    });

    revalidatePath('/dashboard/staff');
    return {
        message: 'Staff member added successfully!',
        errors: null,
        data: validatedFields.data,
    };

  } catch (error) {
    console.error("Failed to create staff member:", error);
    return {
      message: 'An unexpected error occurred while saving the staff member.',
      errors: { _form: ['Database error.'] },
      data: null,
    };
  }
}

const UpdateStaffSchema = StaffFormSchema.extend({
  id: z.string().min(1, { message: "Staff ID is missing." }),
});

export async function updateStaff(prevState: any, formData: FormData) {
    const validatedFields = UpdateStaffSchema.safeParse({
        id: formData.get('id'),
        name: formData.get('name'),
        role: formData.get('role'),
        startDate: formData.get('startDate'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        emergencyName: formData.get('emergencyName'),
        emergencyPhone: formData.get('emergencyPhone'),
        payType: formData.get('payType'),
        payRate: formData.get('payRate'),
        certifications: formData.get('certifications'),
        notes: formData.get('notes'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Please review the form and correct any errors.',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
  
    const { id, startDate, ...rest } = validatedFields.data;

    try {
        await prisma.staff.update({
            where: { id },
            data: {
                ...rest,
                startDate: new Date(startDate),
            }
        });

        revalidatePath('/dashboard/staff');
        return { message: 'Staff details updated successfully.', errors: null };
    } catch (error) {
        console.error("Failed to update staff:", error);
        return {
            message: 'An unexpected error occurred while updating the staff member.',
            errors: { _form: ['Database error.'] },
        };
    }
}

export async function updateStaffStatus(id: string, status: StaffStatus) {
    if (!id || !status) {
        return { success: false, message: "Invalid arguments provided." };
    }
    try {
        await prisma.staff.update({
            where: { id },
            data: { status },
        });
        revalidatePath('/dashboard/staff');
        return { success: true, message: `Staff status updated to ${status}.` };
    } catch (error) {
        console.error("Failed to update staff status:", error);
        return { success: false, message: 'An unexpected error occurred while updating status.' };
    }
}

export async function deleteStaff(id: string) {
    if (!id) {
        return { success: false, message: "Staff ID is required." };
    }
    try {
        await prisma.staff.delete({
            where: { id },
        });
        revalidatePath('/dashboard/staff');
        return { success: true, message: 'Staff member deleted successfully.' };
    } catch (error) {
        console.error("Failed to delete staff member:", error);
        return { success: false, message: 'An unexpected error occurred while deleting the staff member.' };
    }
}
