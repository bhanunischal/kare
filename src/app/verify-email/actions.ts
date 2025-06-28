'use server';

import prisma from '@/lib/prisma';

export async function verifyEmail(token: string | null): Promise<{ success: boolean; message: string }> {
  if (!token) {
    return { success: false, message: 'Verification token is missing.' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      return { success: false, message: 'Invalid verification token. It may have expired or already been used.' };
    }

    if (user.emailVerified) {
        return { success: true, message: 'Your email has already been verified. You can now log in.' };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null, // Invalidate the token
      },
    });

    return { success: true, message: 'Your email has been successfully verified! You can now log in.' };
  } catch (error) {
    console.error('Email Verification Error:', error);
    return { success: false, message: 'An unexpected error occurred during email verification.' };
  }
}
