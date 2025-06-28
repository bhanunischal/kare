import { verifyEmail } from './actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token = typeof searchParams.token === 'string' ? searchParams.token : null;
  const { success, message } = await verifyEmail(token);

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/50">
      <Card className="mx-auto max-w-md w-full text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {success ? (
              <CheckCircle className="h-12 w-12 text-green-500" />
            ) : (
              <XCircle className="h-12 w-12 text-destructive" />
            )}
          </div>
          <CardTitle className="text-2xl font-headline">
            Email Verification
          </CardTitle>
          <CardDescription className="pt-2 !px-6">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success && (
            <Link href="/login">
              <Button>Go to Login</Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
