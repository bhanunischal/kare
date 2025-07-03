
'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email';

const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
});

export async function sendResetLink(prevState: any, formData: FormData) {
  const validatedFields = ForgotPasswordSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.email?.[0] || 'Invalid email address.',
      isSuccess: false,
    };
  }
  
  const { email } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // To prevent email enumeration, we'll return a success message even if the user doesn't exist.
    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiration = new Date(Date.now() + 3600 * 1000); // 1 hour from now

      await prisma.passwordResetToken.create({
        data: {
          email,
          token: resetToken,
          expires: tokenExpiration,
        },
      });

      await sendPasswordResetEmail(email, resetToken);
    }
    
    return {
      message: "If an account with that email exists, we've sent a password reset link.",
      isSuccess: true,
    };
  } catch (error) {
    console.error('Forgot Password Error:', error);
    return {
      message: 'An unexpected error occurred. Please try again.',
      isSuccess: false,
    };
  }
}
