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
import { Eye } from "lucide-react"

const availableTemplates = [
    {
        name: "Standard Monthly Report",
        description: "A comprehensive monthly summary for parents.",
        provider: "Provided by Child Care Ops",
    },
    {
        name: "Quarterly Progress Snapshot",
        description: "A high-level overview of progress for the quarter.",
        provider: "Provided by Child Care Ops",
    },
    {
        name: "End-of-Year Summary",
        description: "A detailed report covering the entire academic year.",
        provider: "Provided by Child Care Ops",
    },
]

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Report Templates</h1>
        <p className="text-muted-foreground">Available PDF templates for generating child assessments.</p>
      </div>

       <Card>
        <CardHeader>
            <CardTitle>Available Templates</CardTitle>
            <CardDescription>These templates are used to generate downloadable PDF reports.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {availableTemplates.map((template) => (
             <Card key={template.name}>
                <CardHeader>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{template.provider}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" size="sm"><Eye className="mr-2 h-4 w-4" />Preview</Button>
                </CardFooter>
             </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
