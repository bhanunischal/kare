
'use server';

import prisma from '@/lib/prisma';

export async function verifyEmail(token: string | null): Promise<{ success: boolean; message: string }> {
  if (!token) {
    return { success: false, message: 'Verification token is missing.' };
  }

  try {
    const existingToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!existingToken) {
      return { success: false, message: 'Invalid verification token.' };
    }

    const hasExpired = new Date() > new Date(existingToken.expires);
    if (hasExpired) {
      return { success: false, message: 'Verification token has expired. Please sign up again.' };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: existingToken.email },
    });

    if (!existingUser) {
      return { success: false, message: 'No user found for this verification token.' };
    }

    await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        emailVerified: new Date(),
      },
    });

    await prisma.verificationToken.delete({
      where: { id: existingToken.id },
    });

    return { success: true, message: 'Your email has been successfully verified! You can now log in.' };

  } catch (error) {
    console.error("Email verification error:", error);
    return { success: false, message: 'An unexpected error occurred during verification.' };
  }
}
