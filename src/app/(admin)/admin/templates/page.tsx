
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Eye, Share2, Trash2 } from "lucide-react"
import { allDaycares } from "../daycares/data";

const initialTemplates = [
    {
        id: 'tpl_1',
        name: "Standard Monthly Report",
        description: "A comprehensive monthly summary for parents.",
        lastUpdated: "July 20, 2024",
        assignedTo: ['all'],
    },
    {
        id: 'tpl_2',
        name: "Quarterly Progress Snapshot",
        description: "A high-level overview of progress for the quarter.",
        lastUpdated: "June 15, 2024",
        assignedTo: ['dc_1', 'dc_4'],
    },
    {
        id: 'tpl_3',
        name: "End-of-Year Summary",
        description: "A detailed report covering the entire academic year.",
        lastUpdated: "May 30, 2024",
        assignedTo: ['all'],
    },
    {
        id: 'tpl_4',
        name: "Infant-Toddler Daily Log",
        description: "A simple daily log for infants and toddlers.",
        lastUpdated: "July 25, 2024",
        assignedTo: ['dc_2'],
    },
]

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState(initialTemplates);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<(typeof initialTemplates)[0] | null>(null);

  const handleOpenAssignDialog = (template: (typeof initialTemplates)[0]) => {
    setSelectedTemplate(template);
    setIsAssignDialogOpen(true);
  };
  
  const getAssignedCount = (template: (typeof initialTemplates)[0]) => {
    if (template.assignedTo.includes('all')) return 'All Daycares';
    return `${template.assignedTo.length} Daycare(s)`;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Report Templates</h1>
          <p className="text-muted-foreground">Create, manage, and assign PDF templates for child assessments.</p>
        </div>
        <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Template
        </Button>
      </div>

       <Card>
        <CardHeader>
            <CardTitle>All Templates</CardTitle>
            <CardDescription>Templates created here can be assigned to all or specific daycares.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
             <Card key={template.name} className="flex flex-col">
                <CardHeader>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-sm">Assigned to: <span className="font-semibold">{getAssignedCount(template)}</span></p>
                    <p className="text-sm text-muted-foreground mt-2">Last updated: {template.lastUpdated}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenAssignDialog(template)}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </CardFooter>
             </Card>
          ))}
        </CardContent>
      </Card>

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Assign Template: {selectedTemplate?.name}</DialogTitle>
                  <DialogDescription>
                      Select which daycares should have access to this template.
                  </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
                 <div className="flex items-center space-x-2">
                    <Checkbox id="assign-all" />
                    <Label htmlFor="assign-all" className="font-bold">Assign to all current and future daycares</Label>
                  </div>
                  <div className="text-sm text-muted-foreground">Or select specific daycares:</div>
                  <div className="space-y-2">
                      {allDaycares.filter(d => d.status === 'Active').map(daycare => (
                          <div key={daycare.id} className="flex items-center space-x-2">
                              <Checkbox id={`dc-${daycare.id}`} />
                              <Label htmlFor={`dc-${daycare.id}`}>{daycare.name}</Label>
                          </div>
                      ))}
                  </div>
              </div>
              <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>Cancel</Button>
                  <Button>Save Assignment</Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>
    </div>
  );
}
