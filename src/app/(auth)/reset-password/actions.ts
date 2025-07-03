
'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const ResetPasswordSchema = z.object({
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  confirmPassword: z.string(),
  token: z.string().min(1, { message: 'Token is missing.' }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
});


export async function resetPassword(prevState: any, formData: FormData) {
  const validatedFields = ResetPasswordSchema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    token: formData.get('token'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Please check the form for errors.',
      errors: validatedFields.error.flatten().fieldErrors,
      isSuccess: false,
    };
  }

  const { password, token } = validatedFields.data;

  try {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return { message: 'Invalid token.', errors: { _form: ['This reset token is not valid.'] }, isSuccess: false };
    }

    const hasExpired = new Date() > new Date(resetToken.expires);
    if (hasExpired) {
      return { message: 'Expired token.', errors: { _form: ['This reset token has expired. Please request a new one.'] }, isSuccess: false };
    }

    const user = await prisma.user.findUnique({
        where: { email: resetToken.email }
    });

    if (!user) {
        return { message: 'User not found.', errors: { _form: ['No user found for this token.'] }, isSuccess: false };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Use a transaction to update password and delete the token
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      }),
    ]);
    
    return { message: 'Your password has been successfully reset. You can now log in.', errors: null, isSuccess: true };

  } catch (error) {
    console.error('Reset Password Error:', error);
    return {
      message: 'An unexpected error occurred. Please try again.',
      errors: { _form: ['Database error.'] },
      isSuccess: false,
    };
  }
}
