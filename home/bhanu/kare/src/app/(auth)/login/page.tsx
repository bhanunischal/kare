
'use client';

import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { login, handleGoogleLogin, type LoginFormState } from './actions';
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';
import { GoogleIcon } from '@/components/google-icon';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const initialState: LoginFormState = {
  message: '',
  errors: {},
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
             {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
             Login
        </Button>
    );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(login, initialState);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { pending } = useFormStatus();


  useEffect(() => {
    if (state.message && state.errors?._form) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: state.errors._form[0],
      });
    }
  }, [state, toast]);

  const onGoogleSignIn = async () => {
    if (!auth) {
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Disabled',
        description: 'Firebase credentials are not configured. Please check the server logs.',
      });
      return;
    }

    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        if (user.email) {
            const serverResponse = await handleGoogleLogin(user.email);
            if (serverResponse.error) {
                toast({ variant: 'destructive', title: 'Google Login Failed', description: serverResponse.error });
            } else if (serverResponse.redirect) {
                router.push(serverResponse.redirect);
            }
        } else {
             toast({ variant: 'destructive', title: 'Google Login Failed', description: 'Could not retrieve email from Google.' });
        }

    } catch (error: any) {
        if (error.code !== 'auth/popup-closed-by-user') {
            toast({ variant: 'destructive', title: 'Google Login Failed', description: 'An error occurred during sign-in.' });
        }
    } finally {
        setIsGoogleLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/50">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Logo />
            </div>
          <CardTitle className="text-2xl font-headline">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <form action={formAction} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
                {state.errors?.email && <p className="text-xs text-destructive">{state.errors.email[0]}</p>}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" name="password" type="password" required />
                {state.errors?.password && <p className="text-xs text-destructive">{state.errors.password[0]}</p>}
              </div>
              <SubmitButton />
              {state.errors?._form && <p className="text-xs text-destructive text-center">{state.errors._form[0]}</p>}
            </form>
            
            <Button variant="outline" className="w-full" onClick={onGoogleSignIn} disabled={isGoogleLoading || pending}>
                {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2 h-4 w-4" />}
                Login with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
