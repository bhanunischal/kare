
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { initialEnrolledChildren } from "../enrollment/data";

const activeChildren = initialEnrolledChildren.filter(
  (child) => child.status === "Active"
);

const announcements = [
  {
    title: "Field Trip to the Pumpkin Patch",
    date: "October 15, 2024",
    content:
      "Reminder: Our annual trip to the pumpkin patch is next Tuesday. Please ensure your child has a packed lunch and is dressed for the weather. Permission slips are due this Friday.",
  },
  {
    title: "Parent-Teacher Conferences",
    date: "October 10, 2024",
    content:
      "Sign-up sheets for parent-teacher conferences are now available at the front desk. Conferences will be held during the last week of October.",
  },
  {
    title: "Picture Day is Coming!",
    date: "October 5, 2024",
    content:
      "Get ready to smile! Picture day is scheduled for Monday, October 28th. Order forms will be sent home next week.",
  },
];

export default function CommunicationPage() {
  const { toast } = useToast();
  const [selectedChildId, setSelectedChildId] = useState<string>("");

  const handleSendBroadcast = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get("broadcast-message") as string;
    if (message.trim()) {
      toast({
        title: "Announcement Sent",
        description: "Your message has been broadcast to all parents.",
      });
      e.currentTarget.reset();
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Broadcast message cannot be empty.",
      });
    }
  };

  const handleSendDirectMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get("direct-message") as string;

    if (!selectedChildId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a child.",
      });
      return;
    }
    if (!message.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Direct message cannot be empty.",
      });
      return;
    }

    const child = activeChildren.find((c) => c.id === selectedChildId);
    toast({
      title: "Direct Message Sent",
      description: `Your message has been sent to the parents of ${child?.name}.`,
    });
    e.currentTarget.reset();
    setSelectedChildId("");
  };

  const selectedChild = activeChildren.find((c) => c.id === selectedChildId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Parent Communication
        </h1>
        <p className="text-muted-foreground">
          Send announcements and direct messages to parents.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
              <CardDescription>
                A log of broadcast announcements sent to all parents.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {announcements.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.content}
                  </p>
                  {index < announcements.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>New Message</CardTitle>
              <CardDescription>Create and send a new message.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="broadcast" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
                  <TabsTrigger value="direct">Direct</TabsTrigger>
                </TabsList>
                <TabsContent value="broadcast">
                  <form onSubmit={handleSendBroadcast}>
                    <Card className="border-0 shadow-none">
                      <CardContent className="p-0 pt-6">
                        <Textarea
                          name="broadcast-message"
                          placeholder="Type your announcement here..."
                          className="min-h-[228px]"
                        />
                      </CardContent>
                      <CardFooter className="p-0 pt-4">
                        <Button type="submit">Send to All Parents</Button>
                      </CardFooter>
                    </Card>
                  </form>
                </TabsContent>
                <TabsContent value="direct">
                  <form onSubmit={handleSendDirectMessage}>
                    <Card className="border-0 shadow-none">
                      <CardContent className="p-0 pt-6 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="child-select">Select Child</Label>
                          <Select
                            value={selectedChildId}
                            onValueChange={setSelectedChildId}
                          >
                            <SelectTrigger id="child-select">
                              <SelectValue placeholder="Select a child..." />
                            </SelectTrigger>
                            <SelectContent>
                              {activeChildren.map((child) => (
                                <SelectItem key={child.id} value={child.id}>
                                  {child.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {selectedChild && (
                            <p className="text-xs text-muted-foreground">
                              Message will be sent to:{" "}
                              {selectedChild.motherName} &{" "}
                              {selectedChild.fatherName}
                            </p>
                          )}
                        </div>
                        <Textarea
                          name="direct-message"
                          placeholder="Type your direct message here..."
                          className="min-h-[152px]"
                        />
                      </CardContent>
                      <CardFooter className="p-0 pt-4">
                        <Button type="submit" disabled={!selectedChildId}>
                          Send Direct Message
                        </Button>
                      </CardFooter>
                    </Card>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
