
'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = 'onboarding@resend.dev'; // Resend requires a verified domain. 'onboarding@resend.dev' can be used for testing.

export async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Verify your email address for Child Care Ops',
      html: `
        <h1>Welcome to Child Care Ops!</h1>
        <p>Please click the link below to verify your email address and activate your account:</p>
        <a href="${verificationLink}" target="_blank">Verify Email</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not sign up for an account, you can safely ignore this email.</p>
      `,
    });
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
    // In a production app, you might want to handle this error more gracefully,
    // e.g., by logging it to a monitoring service.
    // For now, we'll re-throw the error to be caught by the signup action.
    throw new Error('Could not send verification email.');
  }
}
