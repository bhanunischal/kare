
"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { GenerateAssessmentOutput } from "@/ai/flows/generate-assessment-flow";
import { generateAssessment } from "./actions";
import { Loader2, Bot, Share2, Download, BookUser, Brain, MessageSquare, PersonStanding } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Child } from "@prisma/client";

const initialState: { output: GenerateAssessmentOutput | null; error: string | null; } = {
  output: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating Report...
        </>
      ) : (
        <>
          <Bot className="mr-2 h-4 w-4" />
          Generate Assessment
        </>
      )}
    </Button>
  );
}

export default function AssessmentsClient({ children }: { children: Child[] }) {
  const [state, formAction] = useActionState(generateAssessment, initialState);
  const { toast } = useToast();
  const stateRef = useRef(initialState);
  
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const activeChildren = (children || []).filter(c => c.status === 'Active');
  const selectedChild = activeChildren.find(c => c.id === selectedChildId);

  useEffect(() => {
    if (state !== stateRef.current && state.error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: state.error,
      });
      stateRef.current = state;
    }
  }, [state, toast]);

  const handleShare = () => {
    if (!selectedChild) return;
    toast({
      title: "Report Shared",
      description: `The assessment for ${selectedChild.name} has been shared with their parents.`
    });
  }

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your report is being generated as a PDF."
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Child Assessments</h1>
        <p className="text-muted-foreground">Generate detailed child performance reports using AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Report</CardTitle>
              <CardDescription>Select a child and provide observations to generate a new assessment.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="child-select">Select Child</Label>
                  <Select name="childId" value={selectedChildId} onValueChange={setSelectedChildId} required>
                    <SelectTrigger id="child-select">
                      <SelectValue placeholder="Select a child..." />
                    </SelectTrigger>
                    <SelectContent>
                      {activeChildren.map(child => (
                        <SelectItem key={child.id} value={child.id}>
                          {child.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="reporting-period">Reporting Period</Label>
                    <Select name="reportingPeriod" defaultValue="monthly" required>
                        <SelectTrigger id="reporting-period">
                            <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="observations">Teacher's Observations</Label>
                  <Textarea
                    id="observations"
                    name="observations"
                    placeholder="Describe the child's progress, interactions, strengths, and areas for growth..."
                    className="min-h-48"
                    required
                  />
                </div>
                <SubmitButton />
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="min-h-full">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Assessment Report</CardTitle>
                        <CardDescription>The generated report will appear here.</CardDescription>
                    </div>
                     {state.output && (
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleShare}>
                                <Share2 className="mr-2 h-4 w-4" /> Share
                            </Button>
                             <Button variant="outline" size="sm" onClick={handleDownload}>
                                <Download className="mr-2 h-4 w-4" /> Download
                            </Button>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
              {state.output ? (
                <div className="space-y-6">
                  <AssessmentSection icon={<BookUser className="mr-3 h-6 w-6 text-primary" />} title="Social-Emotional Development">
                      {state.output.socialEmotional}
                  </AssessmentSection>
                  <AssessmentSection icon={<Brain className="mr-3 h-6 w-6 text-primary" />} title="Cognitive Skills">
                      {state.output.cognitiveSkills}
                  </AssessmentSection>
                   <AssessmentSection icon={<MessageSquare className="mr-3 h-6 w-6 text-primary" />} title="Language & Communication">
                      {state.output.languageCommunication}
                  </AssessmentSection>
                   <AssessmentSection icon={<PersonStanding className="mr-3 h-6 w-6 text-primary" />} title="Fine & Gross Motor Skills">
                      {state.output.motorSkills}
                  </AssessmentSection>
                   <Card className="bg-secondary/50">
                    <CardHeader>
                        <CardTitle className="text-lg font-headline">Summary & Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{state.output.summaryRecommendations}</p>
                    </CardContent>
                   </Card>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 h-full rounded-lg bg-secondary/30 min-h-[400px]">
                  <Bot className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">Your AI-generated assessment report will appear here once generated.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const AssessmentSection = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center font-headline">
            {icon}
            {title}
        </h3>
        <p className="text-sm text-muted-foreground pl-9">{children}</p>
    </div>
)
