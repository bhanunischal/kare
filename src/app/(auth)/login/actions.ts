
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

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

    if (!user) {
      return { message: 'Login failed', errors: { _form: ['Invalid email or password.'] } };
    }

    if (!user.emailVerified) {
      return { message: 'Login failed', errors: { _form: ['Please verify your email before logging in.'] } };
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return { message: 'Login failed', errors: { _form: ['Invalid email or password.'] } };
    }

    // This is where a real session would be created.
    // For now, we are just redirecting. The next step is to implement
    // session management to properly scope data.
  } catch (error) {
    console.error('Login Error:', error);
    return { message: 'An unexpected error occurred', errors: { _form: ['Something went wrong.'] } };
  }

  redirect('/dashboard');
}
