
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Sparkles, BookOpen, Music, PaintBrush, Leaf, Microscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ActivityCategory = "Art & Craft" | "Music & Movement" | "Outdoor Play" | "Story Time" | "Science & Discovery";
const activityCategories: ActivityCategory[] = ["Art & Craft", "Music & Movement", "Outdoor Play", "Story Time", "Science & Discovery"];

type LearningDomain = "Cognitive" | "Fine Motor" | "Gross Motor" | "Social-Emotional" | "Language";
const learningDomains: LearningDomain[] = ["Cognitive", "Fine Motor", "Gross Motor", "Social-Emotional", "Language"];

type Activity = {
  id: string;
  date: string;
  time: string;
  title: string;
  category: ActivityCategory;
  description: string;
  materials: string;
  domains: LearningDomain[];
};

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
];

const categoryIcons: Record<ActivityCategory, React.ReactNode> = {
    "Art & Craft": <PaintBrush className="h-5 w-5 text-primary" />,
    "Music & Movement": <Music className="h-5 w-5 text-primary" />,
    "Outdoor Play": <Leaf className="h-5 w-5 text-primary" />,
    "Story Time": <BookOpen className="h-5 w-5 text-primary" />,
    "Science & Discovery": <Microscope className="h-5 w-5 text-primary" />,
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const { toast } = useToast();

  const groupedActivities = activities.reduce((acc, activity) => {
    const date = activity.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  const sortedDates = Object.keys(groupedActivities).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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

      <div className="space-y-8">
        {sortedDates.map(date => (
            <div key={date}>
                <h2 className="text-xl font-bold tracking-tight font-headline mb-4 pb-2 border-b">
                    {format(new Date(date.replace(/-/g, '/')), "EEEE, MMMM d, yyyy")}
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {groupedActivities[date].sort((a,b) => a.time.localeCompare(b.time)).map(activity => (
                        <Card key={activity.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1.5">
                                        <CardTitle className="text-lg flex items-center gap-3">
                                            {categoryIcons[activity.category]}
                                            {activity.title}
                                        </CardTitle>
                                        <CardDescription>{activity.time} - <Badge variant="outline">{activity.category}</Badge></CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-4">
                                <p className="text-sm text-muted-foreground">{activity.description}</p>
                                <div>
                                    <h4 className="font-semibold text-sm mb-2">Learning Domains:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {activity.domains.map(domain => (
                                            <Badge key={domain} variant="secondary">{domain}</Badge>
                                        ))}
                                    </div>
                                </div>
                                 <div>
                                    <h4 className="font-semibold text-sm mb-2">Materials:</h4>
                                    <p className="text-sm text-muted-foreground">{activity.materials || "None"}</p>
                                </div>
                            </CardContent>
                             <CardFooter className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(activity)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteActivity(activity.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        ))}
        {activities.length === 0 && (
             <Card className="flex flex-col items-center justify-center text-center p-8 h-64 border-dashed">
                <Sparkles className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-semibold mt-4">No Activities Planned</h3>
                <p className="mt-2 text-sm text-muted-foreground">Get started by adding your first learning activity.</p>
                 <Button className="mt-4" onClick={() => handleOpenDialog(null)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Activity
                </Button>
            </Card>
        )}
      </div>
    </div>
  );
}
