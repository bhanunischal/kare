
'use server';

import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const RegistrationFormSchema = z.object({
  childName: z.string().min(1, { message: "Child's name is required." }),
  dob: z.string().min(1, { message: "Date of birth is required." }),
  startDate: z.string().min(1, { message: "Start date is required." }),
  program: z.string().min(1, { message: "Program group is required." }),
  programType: z.string().min(1, { message: "Program type is required." }),
  status: z.enum(['Active', 'Waitlisted', 'Inactive']),
  motherName: z.string().min(1, { message: "Mother's name is required." }),
  fatherName: z.string().min(1, { message: "Father's name is required." }),
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
    startDate: formData.get("start-date"),
    program: formData.get("program"),
    programType: formData.get("program-type"),
    status: formData.get("status"),
    motherName: formData.get("mother-name"),
    fatherName: formData.get("father-name"),
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
    homePhone, // Exclude homePhone from the rest of the data
    ...rest 
  } = validatedFields.data;

  // TODO: Replace with daycareId from the user's session once implemented.
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
