
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Eye } from "lucide-react"

const templates = [
    {
        name: "Standard Monthly Report",
        description: "A comprehensive monthly summary for parents.",
        lastUpdated: "July 20, 2024",
    },
    {
        name: "Quarterly Progress Snapshot",
        description: "A high-level overview of progress for the quarter.",
        lastUpdated: "June 15, 2024",
    },
    {
        name: "End-of-Year Summary",
        description: "A detailed report covering the entire academic year.",
        lastUpdated: "May 30, 2024",
    },
]

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Report Templates</h1>
        <p className="text-muted-foreground">Manage PDF templates for child assessments. (Admin Feature)</p>
      </div>

       <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Available Templates</CardTitle>
            <CardDescription>These templates are used to generate downloadable PDF reports.</CardDescription>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Template
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
             <Card key={template.name}>
                <CardHeader>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Last updated: {template.lastUpdated}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm"><Eye className="mr-2 h-4 w-4" />Preview</Button>
                    <Button variant="outline" size="sm"><Edit className="mr-2 h-4 w-4" />Edit</Button>
                </CardFooter>
             </Card>
          ))}
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">
                <strong>Feature Note:</strong> In a live application, this section would allow a SaaS administrator to create and edit PDF templates using a visual editor with dynamic placeholders (e.g., `{{childName}}`, `{{cognitiveSkills}}`). Daycare staff would then be able to select from these templates when downloading an assessment.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
