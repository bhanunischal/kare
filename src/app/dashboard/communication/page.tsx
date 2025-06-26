import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

const announcements = [
    { title: "Field Trip to the Pumpkin Patch", date: "October 15, 2024", content: "Reminder: Our annual trip to the pumpkin patch is next Tuesday. Please ensure your child has a packed lunch and is dressed for the weather. Permission slips are due this Friday." },
    { title: "Parent-Teacher Conferences", date: "October 10, 2024", content: "Sign-up sheets for parent-teacher conferences are now available at the front desk. Conferences will be held during the last week of October." },
    { title: "Picture Day is Coming!", date: "October 5, 2024", content: "Get ready to smile! Picture day is scheduled for Monday, October 28th. Order forms will be sent home next week." }
]

export default function CommunicationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Parent Communication</h1>
        <p className="text-muted-foreground">Send announcements and updates to parents.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Announcements</CardTitle>
                    <CardDescription>A log of announcements sent to parents.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {announcements.map((item, index) => (
                        <div key={index} className="space-y-1">
                             <div className="flex justify-between items-baseline">
                                <h3 className="font-semibold">{item.title}</h3>
                                <p className="text-xs text-muted-foreground">{item.date}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">{item.content}</p>
                            {index < announcements.length -1 && <Separator className="mt-4"/>}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
        <div className="md:col-span-1">
            <Card>
                <CardHeader>
                    <CardTitle>New Announcement</CardTitle>
                    <CardDescription>Create and send a new message.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea placeholder="Type your announcement here..." className="min-h-48" />
                </CardContent>
                <CardFooter>
                    <Button>Send to All Parents</Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
