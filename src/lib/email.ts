'use server';

// In a real app, you would use a service like Resend, SendGrid, or Nodemailer.
// For this demo, we'll just log the email to the console.

const FROM_EMAIL = 'noreply@childcareops.com';

export async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002'}/verify-email?token=${token}`;

  console.log('--- SENDING VERIFICATION EMAIL ---');
  console.log('To:', email);
  console.log('From:', FROM_EMAIL);
  console.log('Subject: Verify your email address');
  console.log('Body:');
  console.log(`  Click this link to verify your email address:`);
  console.log(`  ${verificationLink}`);
  console.log('---------------------------------');

  // Here you would add your email sending logic.
  // Example with Resend:
  //
  // import { Resend } from 'resend';
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: FROM_EMAIL,
  //   to: email,
  //   subject: 'Verify your email address',
  //   html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`
  // });
}
