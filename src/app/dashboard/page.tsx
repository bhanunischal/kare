
"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Activity, Users, UserCheck, FileWarning, Plus, Edit } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

const statusCards = [
    { title: "Total Children", value: "72", icon: <Users className="h-6 w-6 text-muted-foreground" /> },
    { title: "Children Present", value: "65", icon: <UserCheck className="h-6 w-6 text-muted-foreground" /> },
    { title: "Staff on Duty", value: "10", icon: <Activity className="h-6 w-6 text-muted-foreground" /> },
    { title: "Unpaid Invoices", value: "5", icon: <FileWarning className="h-6 w-6 text-muted-foreground" /> }
]

const recentActivities = [
    { name: "Liam Johnson", activity: "Checked In", time: "9:02 AM" },
    { name: "Olivia Smith", activity: "Checked Out", time: "9:00 AM" },
    { name: "Noah Williams", activity: "Incident Report Filed", time: "8:45 AM" },
    { name: "Emma Brown", activity: "Checked In", time: "8:30 AM" },
    { name: "Ava Jones", activity: "Payment Received", time: "8:15 AM" }
]

type CalendarEvent = {
  id: string;
  date: Date;
  title: string;
  description: string;
};

const initialEvents: CalendarEvent[] = [
  { id: '1', date: new Date(), title: "Team Meeting", description: "Weekly sync-up meeting with all staff." },
  { id: '2', date: new Date(new Date().setDate(new Date().getDate() + 2)), title: "Picture Day", description: "Get ready to smile! Order forms will be sent home." },
  { id: '3', date: new Date(new Date().setDate(new Date().getDate() - 5)), title: "Parent-Teacher Conferences", description: "Sign-up sheets are at the front desk." },
];

export default function DashboardPage() {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<CalendarEvent> | null>(null);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    return events
      .filter(event => 
        event.date.getDate() === selectedDate.getDate() &&
        event.date.getMonth() === selectedDate.getMonth() &&
        event.date.getFullYear() === selectedDate.getFullYear()
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [selectedDate, events]);
  
  const handleDayClick = (day: Date | undefined) => {
    setSelectedDate(day);
  };
  
  const handleOpenAddDialog = (date: Date) => {
    setSelectedDate(date);
    setEditingEvent({ date });
    setIsEventDialogOpen(true);
  };

  const handleOpenEditDialog = (event: CalendarEvent) => {
    setEditingEvent(event);
    setIsEventDialogOpen(true);
  };
  
  const handleSaveEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingEvent || !editingEvent.date) return;
    
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!title) return;

    if (editingEvent.id) {
      setEvents(events.map(event => event.id === editingEvent.id ? { ...event, title, description } : event));
    } else {
      const newEvent: CalendarEvent = {
        id: new Date().toISOString(),
        date: editingEvent.date,
        title,
        description,
      };
      setEvents([...events, newEvent]);
    }
    
    setIsEventDialogOpen(false);
    setEditingEvent(null);
  };

  const eventDates = useMemo(() => events.map(event => event.date), [events]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's a snapshot of your daycare today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statusCards.map(card => (
            <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    {card.icon}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                </CardContent>
            </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Recent Activity</CardTitle>
            <CardDescription>A log of the most recent check-ins, check-outs, and other important events.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Child</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivities.map(activity => (
                     <TableRow key={activity.name}>
                        <TableCell className="font-medium">{activity.name}</TableCell>
                        <TableCell>{activity.activity}</TableCell>
                        <TableCell className="text-right">{activity.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </CardContent>
        </Card>

         <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Announcements</CardTitle>
            <CardDescription>Recent updates for parents and staff.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-secondary rounded-lg">
                <h4 className="font-semibold text-sm">Field Trip Reminder</h4>
                <p className="text-sm text-muted-foreground">Don't forget, the field trip to the science museum is this Friday! Please sign permission slips by tomorrow.</p>
            </div>
             <div className="p-3 bg-secondary rounded-lg">
                <h4 className="font-semibold text-sm">Holiday Closure</h4>
                <p className="text-sm text-muted-foreground">The center will be closed next Monday for the public holiday.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-7">
          <CardHeader>
              <CardTitle className="font-headline">Calendar & Events</CardTitle>
              <CardDescription>View and manage upcoming events and holidays. Double-click a date to add an event.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="grid gap-8 md:grid-cols-3">
                  <div className="md:col-span-2">
                      <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleDayClick}
                          onDayDoubleClick={handleOpenAddDialog}
                          className="rounded-md border p-0"
                          modifiers={{ hasEvent: eventDates }}
                          modifiersStyles={{ hasEvent: { fontWeight: 'bold' } }}
                      />
                  </div>
                  <div className="md:col-span-1">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold">
                              {selectedDate ? format(selectedDate, 'PPP') : 'Select a date'}
                          </h3>
                          <Button size="sm" variant="outline" onClick={() => selectedDate && handleOpenAddDialog(selectedDate)} disabled={!selectedDate}>
                              <Plus className="h-4 w-4 mr-2" /> Add
                          </Button>
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                          {selectedDayEvents.length > 0 ? (
                              selectedDayEvents.map(event => (
                                  <div key={event.id} className="p-3 bg-secondary rounded-lg flex justify-between items-start gap-2">
                                      <div className="flex-grow">
                                          <h4 className="font-semibold text-sm">{event.title}</h4>
                                          <p className="text-sm text-muted-foreground">{event.description}</p>
                                      </div>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => handleOpenEditDialog(event)}>
                                          <Edit className="h-4 w-4" />
                                      </Button>
                                  </div>
                              ))
                          ) : (
                              <div className="text-sm text-muted-foreground text-center py-10">No events for this day.</div>
                          )}
                      </div>
                  </div>
              </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSaveEvent}>
            <DialogHeader>
              <DialogTitle>{editingEvent?.id ? 'Edit Event' : 'Add New Event'}</DialogTitle>
              <DialogDescription>
                  {editingEvent?.date && format(editingEvent.date, 'PPP')}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" name="title" defaultValue={editingEvent?.title || ''} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea id="description" name="description" defaultValue={editingEvent?.description || ''} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEventDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save Event</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
