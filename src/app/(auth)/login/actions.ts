'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

const LoginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export type LoginFormState = {
  message: string;
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
};

export async function login(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return { message: 'Invalid credentials.', errors: { _form: ['Invalid credentials.'] } };
    }

    if (!user.emailVerified) {
        return { message: 'Please verify your email before logging in.', errors: { _form: ['Please verify your email before logging in.'] } };
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return { message: 'Invalid credentials.', errors: { _form: ['Invalid credentials.'] } };
    }

  } catch (error) {
    console.error('Login Error:', error);
    return { message: 'An unexpected error occurred.', errors: { _form: ['An unexpected error occurred.'] } };
  }
  
  redirect('/dashboard');
}
