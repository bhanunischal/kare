
"use client";

import { useState, useMemo } from "react";
import { format, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Sparkles, BookOpen, Music, Paintbrush, Leaf, Microscope, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type ActivityCategory = "Art & Craft" | "Music & Movement" | "Outdoor Play" | "Story Time" | "Science & Discovery";
const activityCategories: ActivityCategory[] = ["Art & Craft", "Music & Movement", "Outdoor Play", "Story Time", "Science & Discovery"];

type LearningDomain = "Cognitive" | "Fine Motor" | "Gross Motor" | "Social-Emotional" | "Language";
const learningDomains: LearningDomain[] = ["Cognitive", "Fine Motor", "Gross Motor", "Social-Emotional", "Language"];

type Activity = {
  id: string;
  date: string; // 'yyyy-MM-dd' format
  time: string;
  title: string;
  category: ActivityCategory;
  description: string;
  materials: string;
  domains: LearningDomain[];
};

type View = 'month' | 'week' | 'day';

const initialActivities: Activity[] = [
  {
    id: '1',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: "10:00 AM",
    title: "Nature Collage",
    category: "Art & Craft",
    description: "Children will use leaves, twigs, and flowers collected from our walk to create a collage.",
    materials: "Paper, glue, collected nature items",
    domains: ["Fine Motor", "Cognitive"],
  },
  {
    id: '2',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: "2:00 PM",
    title: "Freeze Dance",
    category: "Music & Movement",
    description: "Dancing to music and freezing when the music stops to practice listening skills and body control.",
    materials: "Music player",
    domains: ["Gross Motor", "Social-Emotional"],
  },
  {
    id: '3',
    date: format(new Date(new Date().setDate(new Date().getDate() + 1)), 'yyyy-MM-dd'),
    time: "11:00 AM",
    title: "The Very Hungry Caterpillar",
    category: "Story Time",
    description: "Reading the classic story and then discussing the life cycle of a butterfly.",
    materials: "Book, butterfly lifecycle props",
    domains: ["Language", "Cognitive"],
  },
  {
    id: '4',
    date: format(new Date(new Date().setDate(new Date().getDate() - 2)), 'yyyy-MM-dd'),
    time: "09:30 AM",
    title: "Sink or Float",
    category: "Science & Discovery",
    description: "Exploring which objects sink and which float in a tub of water.",
    materials: "Water tub, various small objects (spoons, toys, rocks)",
    domains: ["Cognitive", "Language"],
  },
];

const categoryIcons: Record<ActivityCategory, React.ReactNode> = {
    "Art & Craft": <Paintbrush className="h-5 w-5 text-primary" />,
    "Music & Movement": <Music className="h-5 w-5 text-primary" />,
    "Outdoor Play": <Leaf className="h-5 w-5 text-primary" />,
    "Story Time": <BookOpen className="h-5 w-5 text-primary" />,
    "Science & Discovery": <Microscope className="h-5 w-5 text-primary" />,
};

const ActivityCard = ({ activity, onEdit, onDelete }: { activity: Activity; onEdit: (activity: Activity) => void; onDelete: (id: string) => void; }) => (
    <Card className="flex flex-col">
        <CardHeader className="p-4">
            <div className="flex justify-between items-start">
                <div className="space-y-1.5">
                    <CardTitle className="text-base flex items-center gap-2">
                        {categoryIcons[activity.category]}
                        {activity.title}
                    </CardTitle>
                    <CardDescription className="text-xs">{activity.time} - <Badge variant="outline" className="text-xs">{activity.category}</Badge></CardDescription>
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-grow space-y-3">
            <p className="text-sm text-muted-foreground">{activity.description}</p>
            <div className="flex flex-wrap gap-1">
                {activity.domains.map(domain => (
                    <Badge key={domain} variant="secondary" className="text-xs">{domain}</Badge>
                ))}
            </div>
        </CardContent>
            <CardFooter className="p-2 flex justify-end gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(activity)}>
                <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDelete(activity.id)}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </CardFooter>
    </Card>
);

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const { toast } = useToast();

  const [view, setView] = useState<View>('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleOpenDialog = (activity: Activity | null = null) => {
    setEditingActivity(activity);
    setIsDialogOpen(true);
  };
  
  const handleSaveActivity = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(formData.entries());
    
    const newActivityData = {
        title: formValues.title as string,
        date: formValues.date as string,
        time: formValues.time as string,
        category: formValues.category as ActivityCategory,
        description: formValues.description as string,
        materials: formValues.materials as string,
        domains: formData.getAll("domains") as LearningDomain[],
    };

    if (editingActivity) {
      const updatedActivity = { ...editingActivity, ...newActivityData };
      setActivities(activities.map(act => act.id === editingActivity.id ? updatedActivity : act));
      toast({ title: "Activity Updated", description: `${updatedActivity.title} has been updated.` });
    } else {
      const newActivity = { ...newActivityData, id: new Date().toISOString() };
      setActivities([newActivity, ...activities]);
      toast({ title: "Activity Added", description: `${newActivity.title} has been added to the planner.` });
    }
    
    setIsDialogOpen(false);
    setEditingActivity(null);
  };
  
  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter(act => act.id !== id));
    toast({ title: "Activity Deleted", description: "The activity has been removed from the planner." });
  }

  const handlePrev = () => {
    if (view === 'day') setCurrentDate(subDays(currentDate, 1));
    if (view === 'week') setCurrentDate(subWeeks(currentDate, 1));
    if (view === 'month') setCurrentDate(subMonths(currentDate, 1));
  };
  const handleNext = () => {
    if (view === 'day') setCurrentDate(addDays(currentDate, 1));
    if (view === 'week') setCurrentDate(addWeeks(currentDate, 1));
    if (view === 'month') setCurrentDate(addMonths(currentDate, 1));
  };
  const handleToday = () => setCurrentDate(new Date());

  const headerDateString = useMemo(() => {
    if (view === 'day') return format(currentDate, 'MMMM d, yyyy');
    if (view === 'week') {
        const start = startOfWeek(currentDate);
        const end = endOfWeek(currentDate);
        return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    }
    if (view === 'month') return format(currentDate, 'MMMM yyyy');
    return '';
  }, [currentDate, view]);

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Activity Planner</h1>
          <p className="text-muted-foreground">Plan and organize daily activities for the children.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog(null)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Activity
              </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <form onSubmit={handleSaveActivity}>
              <DialogHeader>
                  <DialogTitle>{editingActivity ? 'Edit Activity' : 'Add New Activity'}</DialogTitle>
                  <DialogDescription>
                  Fill in the details for the learning activity.
                  </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label htmlFor="title">Activity Title</Label>
                          <Input id="title" name="title" defaultValue={editingActivity?.title} required />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select name="category" defaultValue={editingActivity?.category} required>
                              <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                              <SelectContent>
                                  {activityCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                              </SelectContent>
                          </Select>
                      </div>
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <Label htmlFor="date">Date</Label>
                          <Input id="date" name="date" type="date" defaultValue={editingActivity?.date || format(new Date(), 'yyyy-MM-dd')} required />
                      </div>
                       <div className="space-y-2">
                          <Label htmlFor="time">Time</Label>
                          <Input id="time" name="time" type="time" defaultValue={editingActivity?.time} required />
                      </div>
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description" placeholder="Describe the activity..." defaultValue={editingActivity?.description} />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="materials">Materials Needed</Label>
                      <Textarea id="materials" name="materials" placeholder="List materials, e.g., Crayons, paper, scissors" defaultValue={editingActivity?.materials} />
                  </div>
                   <div className="space-y-2">
                      <Label>Learning & Development Domains</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                          {learningDomains.map(domain => (
                              <Label key={domain} htmlFor={`domain-${domain}`} className="flex items-center gap-2 font-normal border p-2 rounded-md has-[:checked]:bg-secondary cursor-pointer">
                                  <Input 
                                      type="checkbox" 
                                      id={`domain-${domain}`} 
                                      name="domains" 
                                      value={domain}
                                      className="h-4 w-4"
                                      defaultChecked={editingActivity?.domains.includes(domain)}
                                  />
                                  {domain}
                              </Label>
                          ))}
                      </div>
                  </div>
              </div>
              <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Save Activity</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="flex-grow flex flex-col">
        <CardHeader className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={handlePrev}><ChevronLeft className="h-4 w-4" /></Button>
                <h2 className="text-xl font-bold tracking-tight font-headline text-center w-48 sm:w-64">
                    {headerDateString}
                </h2>
                <Button variant="outline" size="icon" onClick={handleNext}><ChevronRight className="h-4 w-4" /></Button>
            </div>
            <Button variant="outline" onClick={handleToday} className="md:ml-2">Today</Button>
            <div className="md:ml-auto">
                <Tabs defaultValue={view} onValueChange={(value) => setView(value as View)} >
                    <TabsList>
                        <TabsTrigger value="day">Day</TabsTrigger>
                        <TabsTrigger value="week">Week</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </CardHeader>
        <CardContent className="flex-grow overflow-auto">
            {activities.length === 0 ? (
                 <div className="flex flex-col items-center justify-center text-center p-8 h-full">
                    <Sparkles className="h-12 w-12 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mt-4">No Activities Planned</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Get started by adding your first learning activity.</p>
                     <Button className="mt-4" onClick={() => handleOpenDialog(null)}>
                      <Plus className="mr-2 h-4 w-4" /> Add Activity
                    </Button>
                </div>
            ) : (
                <>
                    {view === 'month' && <MonthView activities={activities} currentDate={currentDate} onEdit={handleOpenDialog} onDelete={handleDeleteActivity} />}
                    {view === 'week' && <WeekView activities={activities} currentDate={currentDate} onEdit={handleOpenDialog} onDelete={handleDeleteActivity} />}
                    {view === 'day' && <DayView activities={activities} currentDate={currentDate} onEdit={handleOpenDialog} onDelete={handleDeleteActivity} />}
                </>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

const MonthView = ({ activities, currentDate, onEdit, onDelete }: { activities: Activity[], currentDate: Date, onEdit: (a: Activity) => void, onDelete: (id: string) => void }) => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const getActivitiesForDay = (day: Date) => {
        return activities
            .filter(act => act.date === format(day, 'yyyy-MM-dd'))
            .sort((a,b) => a.time.localeCompare(b.time));
    };

    return (
        <div className="grid grid-cols-7 border-t border-l">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-bold p-2 border-r border-b text-sm text-muted-foreground">{day}</div>
            ))}
            {days.map(day => {
                const activitiesForDay = getActivitiesForDay(day);
                return (
                    <div key={day.toString()} className="border-r border-b p-2 min-h-[120px] flex flex-col gap-1">
                        <span className={cn(
                            'font-semibold self-start px-2 py-0.5 rounded-full text-sm',
                            !isSameMonth(day, currentDate) && 'text-muted-foreground',
                            isToday(day) && 'bg-primary text-primary-foreground',
                            isSameDay(day, new Date()) && !isToday(day) && 'bg-secondary'
                        )}>
                            {format(day, 'd')}
                        </span>
                        <div className="flex-grow overflow-y-auto space-y-1 mt-1">
                            {activitiesForDay.map(activity => (
                                <button key={activity.id} onClick={() => onEdit(activity)} className="w-full text-left">
                                    <Badge className="w-full justify-start truncate cursor-pointer text-xs">{activity.title}</Badge>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const WeekView = ({ activities, currentDate, onEdit, onDelete }: { activities: Activity[], currentDate: Date, onEdit: (a: Activity) => void, onDelete: (id: string) => void }) => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-px">
            {days.map(day => {
                const activitiesForDay = activities
                    .filter(act => act.date === format(day, 'yyyy-MM-dd'))
                    .sort((a,b) => a.time.localeCompare(b.time));
                
                return (
                    <div key={day.toString()} className="bg-background p-2 flex flex-col gap-2 border rounded-lg">
                        <h3 className={cn("text-center font-bold text-lg", isToday(day) && 'text-primary')}>{format(day, 'EEE')}</h3>
                        <h4 className="text-center text-sm text-muted-foreground mb-2">{format(day, 'd')}</h4>
                        <div className="flex-grow space-y-2 overflow-y-auto min-h-64">
                            {activitiesForDay.length > 0 ? (
                                activitiesForDay.map(activity => (
                                    <ActivityCard key={activity.id} activity={activity} onEdit={onEdit} onDelete={onDelete} />
                                ))
                            ) : (
                                <div className="text-center text-sm text-muted-foreground pt-10">No activities</div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const DayView = ({ activities, currentDate, onEdit, onDelete }: { activities: Activity[], currentDate: Date, onEdit: (a: Activity) => void, onDelete: (id: string) => void }) => {
    const activitiesForDay = activities
        .filter(act => act.date === format(currentDate, 'yyyy-MM-dd'))
        .sort((a,b) => a.time.localeCompare(b.time));

    return (
        <div className="space-y-4">
            {activitiesForDay.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {activitiesForDay.map(activity => (
                        <ActivityCard key={activity.id} activity={activity} onEdit={onEdit} onDelete={onDelete} />
                    ))}
                </div>
            ) : (
                <div className="text-center text-muted-foreground py-16">
                    No activities planned for {format(currentDate, 'MMMM d, yyyy')}.
                </div>
            )}
        </div>
    );
};
