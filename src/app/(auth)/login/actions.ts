
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
      include: { daycare: true },
    });

    if (!user || !user.daycare) {
      return { message: 'Login failed', errors: { _form: ['Invalid email or password.'] } };
    }

    if (!user.emailVerified) {
      return { message: 'Login failed', errors: { _form: ['Please verify your email before logging in.'] } };
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return { message: 'Login failed', errors: { _form: ['Invalid email or password.'] } };
    }

    if (user.daycare.status === 'PENDING') {
      redirect('/pending');
    }

    if (user.daycare.status !== 'ACTIVE') {
      return { message: 'Login failed', errors: { _form: [`Your account is ${user.daycare.status.toLowerCase()}. Please contact support.`] } };
    }

  } catch (error) {
    console.error('Login Error:', error);
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
        throw error;
    }
    return { message: 'An unexpected error occurred', errors: { _form: ['Something went wrong.'] } };
  }
  
  redirect('/dashboard');
}


export async function handleGoogleLogin(email: string | null): Promise<{ error?: string; redirect?: string; }> {
    if (!email) {
        return { error: "No email received from Google." };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { daycare: true },
        });

        if (!user || !user.daycare) {
            return { error: "No account found with this email. Please sign up using the regular registration form first." };
        }

        if (user.daycare.status === 'PENDING') {
            return { redirect: '/pending' };
        }

        if (user.daycare.status !== 'ACTIVE') {
            return { error: `Your account is ${user.daycare.status.toLowerCase()}. Please contact support.` };
        }

        // Login is successful and active
        return { redirect: '/dashboard' };

    } catch (error) {
        console.error('Google Login Error:', error);
        return { error: 'An unexpected error occurred during Google sign-in.' };
    }
}
