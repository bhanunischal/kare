'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { useToast } from "@/hooks/use-toast"
import { useFormStatus } from "react-dom"
import { Loader2 } from "lucide-react"

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
  const { toast } = useToast();

  async function loginAction(formData: FormData) {
    // TODO: Implement real login logic
    toast({
      title: "Feature Not Implemented",
      description: "Login functionality is not yet available.",
    });
  }

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
          <form action={loginAction} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
            <SubmitButton />
            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </form>
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
