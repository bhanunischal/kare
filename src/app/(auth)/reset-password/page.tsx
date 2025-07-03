
'use client';

import { useActionState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { resetPassword } from './actions';
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';

const initialState = {
  message: '',
  errors: null,
  isSuccess: false,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
             {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
             Reset Password
        </Button>
    );
}

export default function ResetPasswordPage() {
  const [state, formAction] = useActionState(resetPassword, initialState);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast({ variant: 'destructive', title: 'Error', description: state.message });
      } else if (state.isSuccess) {
        toast({ title: 'Success!', description: state.message });
      }
    }
  }, [state, toast]);

  if (state.isSuccess) {
     return (
      <div className="flex items-center justify-center min-h-screen bg-secondary/50">
        <Card className="mx-auto max-w-sm w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <CardTitle className="text-2xl font-headline">Password Reset Successful</CardTitle>
            <CardDescription>
              {state.message}
            </CardDescription>
          </CardHeader>
           <CardContent className="flex flex-col items-center gap-4">
             <Link href="/login">
                <Button>Return to Login</Button>
             </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!token) {
     return (
      <div className="flex items-center justify-center min-h-screen bg-secondary/50">
        <Card className="mx-auto max-w-sm w-full text-center">
          <CardHeader>
             <CardTitle className="text-2xl font-headline">Invalid Link</CardTitle>
             <CardDescription>
               The password reset link is missing or invalid. Please request a new one.
            </CardDescription>
          </CardHeader>
           <CardContent>
             <Link href="/forgot-password">
                <Button variant="outline">Request New Link</Button>
             </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/50">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Logo />
            </div>
          <CardTitle className="text-2xl font-headline">Reset Password</CardTitle>
          <CardDescription>
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="grid gap-4">
            <input type="hidden" name="token" value={token} />
            <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
              />
              {state.errors?.password && <p className="text-xs text-destructive">{state.errors.password[0]}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
              />
              {state.errors?.confirmPassword && <p className="text-xs text-destructive">{state.errors.confirmPassword[0]}</p>}
            </div>
            <SubmitButton />
             {state.errors?._form && <p className="text-xs text-destructive text-center">{state.errors._form[0]}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
