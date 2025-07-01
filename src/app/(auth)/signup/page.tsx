
'use client';

import { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { signup, type SignupFormState } from './actions';
import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

const initialState: SignupFormState = {
  message: '',
  isSuccess: false,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Create an account
        </Button>
    );
}

export default function SignupPage() {
  const [state, formAction] = useActionState(signup, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && !state.isSuccess) {
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: state.message,
      });
    }
    if (state.isSuccess) {
      toast({
        title: 'Success!',
        description: state.message,
      });
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
            <CardTitle className="text-2xl font-headline">Check Your Email</CardTitle>
            <CardDescription>
              We've sent a verification link to your email address. Please click the link to complete your registration.
            </CardDescription>
          </CardHeader>
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
          <CardTitle className="text-2xl font-headline">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input id="full-name" name="full-name" placeholder="John Doe" required />
              {state.errors?.fullName && <p className="text-xs text-destructive">{state.errors.fullName[0]}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="daycare-name">Day Care Name</Label>
              <Input id="daycare-name" name="daycare-name" placeholder="Sunshine Daycare" required />
              {state.errors?.daycareName && <p className="text-xs text-destructive">{state.errors.daycareName[0]}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              {state.errors?.email && <p className="text-xs text-destructive">{state.errors.email[0]}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
              {state.errors?.password && <p className="text-xs text-destructive">{state.errors.password[0]}</p>}
            </div>
            <SubmitButton />
            {state.errors?._form && <p className="text-xs text-destructive">{state.errors._form[0]}</p>}
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
