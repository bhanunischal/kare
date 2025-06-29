
'use server';

import { z } from 'zod';
// import prisma from '@/lib/prisma';
// import bcrypt from 'bcryptjs';
// import crypto from 'crypto';
// import { sendVerificationEmail } from '@/lib/email';

const SignupFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  daycareName: z.string().min(2, { message: 'Daycare name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export type SignupFormState = {
  message: string;
  isSuccess: boolean;
  errors?: {
    fullName?: string[];
    daycareName?: string[];
    email?: string[];
    password?: string[];
    _form?: string[];
  };
};

export async function signup(
  prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const validatedFields = SignupFormSchema.safeParse({
    fullName: formData.get('full-name'),
    daycareName: formData.get('daycare-name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Please review the form and correct any errors.',
      isSuccess: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  // Bypassing database for server stability
  console.log(`Bypassing database create for user: ${validatedFields.data.email}`);

  // await sendVerificationEmail(email, verificationToken);

  return {
    message: 'Registration successful! Database saving is currently bypassed for testing.',
    isSuccess: true,
  };
}
