
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { Hourglass } from "lucide-react"

export default function PendingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/50">
      <Card className="mx-auto max-w-md w-full text-center">
        <CardHeader>
            <div className="flex justify-center mb-4">
                <Logo />
            </div>
            <div className="flex justify-center mb-4">
                 <Hourglass className="h-12 w-12 text-primary" />
            </div>
          <CardTitle className="text-2xl font-headline">
            Thank You For Registering!
          </CardTitle>
          <CardDescription className="pt-2 !px-6">
            Your account is now pending approval from our administration team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You will receive an email notification once your account has been activated. After activation, you will be able to log in and access the dashboard.
          </p>
          <div className="mt-6">
            <Link href="/" className="text-sm underline">
              Return to Homepage
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
