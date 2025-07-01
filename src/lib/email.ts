
'use server';

import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const fromEmail = 'verify@daytrack.nischal.ca';

export async function sendVerificationEmail(email: string, token: string) {
  if (!resend) {
    const errorMessage = 'Resend API key is not configured. Cannot send email.';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
  
  const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/verify-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
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

    if (error) {
      console.error('Resend API Error:', error);
      throw new Error(`Could not send verification email. Reason: ${error.message}`);
    }

    console.log(`Verification email sent successfully to ${email}. Message ID: ${data?.id}`);
  } catch (error) {
    console.error('Error in sendVerificationEmail function:', error);
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    throw new Error('An unknown error occurred while sending the email.');
  }
}
