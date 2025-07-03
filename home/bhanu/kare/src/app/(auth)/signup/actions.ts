
'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';
import { redirect } from 'next/navigation';

const SignupFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  daycareName: z.string().min(2, { message: 'Daycare name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .refine((password) => /[a-z]/.test(password), {
      message: 'Password must contain at least one lowercase letter.',
    })
    .refine((password) => /[A-Z]/.test(password), {
      message: 'Password must contain at least one uppercase letter.',
    })
    .refine((password) => /\d/.test(password), {
      message: 'Password must contain at least one number.',
    })
    .refine((password) => /[@$!%*?&]/.test(password), {
      message: 'Password must contain at least one special character (@$!%*?&).',
    }),
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
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        message: 'An account with this email already exists.',
        isSuccess: false,
        errors: { email: ['An account with this email already exists.'] },
      };
    }
    
    // Transaction to create Daycare and User together
    await prisma.$transaction(async (tx) => {
        const daycare = await tx.daycare.create({
            data: {
                name: daycareName,
                status: 'PENDING',
                plan: 'Basic', // Assign a default plan
                address: '',
                contactEmail: email,
                contactPhone: '',
                licenseNumber: '',
                infantCapacity: 0,
                toddlerCapacity: 0,
                preschoolCapacity: 0,
                gradeschoolerCapacity: 0,
            },
        });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await tx.user.create({
            data: {
                name: fullName,
                email,
                password: hashedPassword,
                daycareId: daycare.id,
            },
        });

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiration = new Date(Date.now() + 3600 * 1000); // 1 hour from now

        await tx.verificationToken.create({
            data: {
                email,
                token: verificationToken,
                expires: tokenExpiration,
            },
        });

        await sendVerificationEmail(email, verificationToken);
    });

    return {
      message: 'Registration successful! Please check your email to verify your account.',
      isSuccess: true,
    };

  } catch (error) {
    console.error('Signup Error:', error);
    return {
      message: 'An unexpected error occurred. Please try again.',
      isSuccess: false,
      errors: { _form: ['Could not create account.'] },
    };
  }
}
