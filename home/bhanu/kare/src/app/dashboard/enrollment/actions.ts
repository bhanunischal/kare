
'use server';

import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { ChildStatus } from "@prisma/client";

const RegistrationFormSchema = z.object({
  childName: z.string().min(1, { message: "Child's name is required." }),
  dob: z.string().min(1, { message: "Date of birth is required." }),
  gender: z.string().optional(),
  startDate: z.string().min(1, { message: "Start date is required." }),
  program: z.string().min(1, { message: "Program group is required." }),
  programType: z.string().min(1, { message: "Program type is required." }),
  status: z.enum(['Active', 'Waitlisted', 'Inactive']),
  motherName: z.string().min(1, { message: "Mother's name is required." }),
  motherEmail: z.string().email({ message: "Please enter a valid email for the mother." }).optional().or(z.literal('')),
  fatherName: z.string().min(1, { message: "Father's name is required." }),
  fatherEmail: z.string().email({ message: "Please enter a valid email for the father." }).optional().or(z.literal('')),
  homePhone: z.string().optional(),
  mobilePhone: z.string().min(10, { message: "A valid mobile phone number is required." }),
  address: z.string().min(1, { message: "Address is required." }),
  emergencyName: z.string().min(1, { message: "Emergency contact name is required." }),
  emergencyPhone: z.string().min(10, { message: "A valid emergency contact phone is required." }),
  vaccination: z.string().optional(),
  allergies: z.string().optional(),
  notes: z.string().optional(),
});

export type RegistrationFormData = z.infer<typeof RegistrationFormSchema>;


export async function submitRegistration(prevState: any, formData: FormData) {
  const validatedFields = RegistrationFormSchema.safeParse({
    childName: formData.get("child-name"),
    dob: formData.get("dob"),
    gender: formData.get("gender"),
    startDate: formData.get("start-date"),
    program: formData.get("program"),
    programType: formData.get("program-type"),
    status: formData.get("status"),
    motherName: formData.get("mother-name"),
    motherEmail: formData.get("mother-email"),
    fatherName: formData.get("father-name"),
    fatherEmail: formData.get("father-email"),
    homePhone: formData.get("home-phone"),
    mobilePhone: formData.get("mobile-phone"),
    address: formData.get("address"),
    emergencyName: formData.get("emergency-name"),
    emergencyPhone: formData.get("emergency-phone"),
    vaccination: formData.get("vaccination"),
    allergies: formData.get("allergies"),
    notes: formData.get("notes"),
  });

  if (!validatedFields.success) {
    return {
      message: 'Please review the form and correct any errors.',
      errors: validatedFields.error.flatten().fieldErrors,
      data: null,
    };
  }
  
  const { 
    childName, 
    dob, 
    startDate,
    ...rest 
  } = validatedFields.data;

  const daycare = await prisma.daycare.findFirst();

  if (!daycare) {
      return {
          message: 'No active daycare found to associate this child with. Please contact support.',
          errors: { _form: ['System error: No daycare available.'] },
          data: null,
      };
  }
  
  try {
    await prisma.child.create({
        data: {
            ...rest,
            name: childName,
            dateOfBirth: new Date(dob),
            startDate: new Date(startDate),
            daycareId: daycare.id,
            photoUrl: 'https://placehold.co/100x100.png',
            photoHint: 'child portrait',
        }
    });

    revalidatePath('/dashboard/enrollment');
    return {
        message: `${childName} has been registered successfully!`,
        errors: null,
        data: validatedFields.data,
    };

  } catch (error) {
      console.error("Failed to create child record:", error);
      return {
          message: 'An unexpected error occurred while saving the registration.',
          errors: { _form: ['Database error.'] },
          data: null,
      };
  }
}

const UpdateChildSchema = RegistrationFormSchema.extend({
  id: z.string().min(1, { message: "Child ID is missing." }),
});

export async function updateChild(prevState: any, formData: FormData) {
    const validatedFields = UpdateChildSchema.safeParse({
        id: formData.get('id'),
        childName: formData.get("name"), // form field name is 'name'
        dob: formData.get("dateOfBirth"), // form field name is 'dateOfBirth'
        gender: formData.get("gender"),
        startDate: formData.get("startDate"),
        program: formData.get("program"),
        programType: formData.get("programType"),
        status: formData.get("status"),
        motherName: formData.get("motherName"),
        motherEmail: formData.get("motherEmail"),
        fatherName: formData.get("fatherName"),
        fatherEmail: formData.get("fatherEmail"),
        homePhone: formData.get("homePhone"),
        mobilePhone: formData.get("mobilePhone"),
        address: formData.get("address"),
        emergencyName: formData.get("emergencyName"),
        emergencyPhone: formData.get("emergencyPhone"),
        vaccination: formData.get("vaccination"),
        allergies: formData.get("allergies"),
        notes: formData.get("notes"),
    });

    if (!validatedFields.success) {
        return {
            message: 'Please review the form and correct any errors.',
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
  
    const { id, childName, dob, startDate, ...rest } = validatedFields.data;

    try {
        await prisma.child.update({
            where: { id },
            data: {
                ...rest,
                name: childName,
                dateOfBirth: new Date(dob),
                startDate: new Date(startDate),
            }
        });

        revalidatePath('/dashboard/enrollment');
        return { message: 'Child details updated successfully.', errors: null };
    } catch (error) {
        console.error("Failed to update child:", error);
        return {
            message: 'An unexpected error occurred while updating the child.',
            errors: { _form: ['Database error.'] },
        };
    }
}

export async function updateChildStatus(id: string, status: ChildStatus) {
    if (!id || !status) {
        return { success: false, message: "Invalid arguments provided." };
    }
    try {
        await prisma.child.update({
            where: { id },
            data: { status },
        });
        revalidatePath('/dashboard/enrollment');
        return { success: true, message: `Child status updated to ${status}.` };
    } catch (error) {
        console.error("Failed to update child status:", error);
        return { success: false, message: 'An unexpected error occurred while updating status.' };
    }
}

export async function deleteChild(id: string) {
    if (!id) {
        return { success: false, message: "Child ID is required." };
    }
    try {
        await prisma.child.delete({
            where: { id },
        });
        revalidatePath('/dashboard/enrollment');
        return { success: true, message: 'Child deleted successfully.' };
    } catch (error) {
        console.error("Failed to delete child:", error);
        return { success: false, message: 'An unexpected error occurred while deleting the child.' };
    }
}
