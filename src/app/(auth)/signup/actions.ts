'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

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

  const { fullName, daycareName, email, password } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return {
        message: 'A user with this email already exists.',
        isSuccess: false,
        errors: { email: ['A user with this email already exists.'] },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    await prisma.user.create({
      data: {
        name: fullName,
        daycareName,
        email,
        password: hashedPassword,
        verificationToken,
      },
    });

    await sendVerificationEmail(email, verificationToken);

    return {
      message: 'Registration successful! Please check your email to verify your account.',
      isSuccess: true,
    };
  } catch (error) {
    console.error('Signup Error:', error);
    return {
      message: 'An unexpected error occurred. Please try again.',
      isSuccess: false,
      errors: { _form: ['An unexpected error occurred.'] },
    };
  }
}
