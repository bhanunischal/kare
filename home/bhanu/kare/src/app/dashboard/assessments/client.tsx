
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
import { Loader2, Bot, Share2, Download, BookUser, Brain, MessageSquare, PersonStanding, ToyBrick } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Child, Daycare } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

export default function AssessmentsClient({ children, daycare }: { children: Child[], daycare: Daycare | null }) {
  const [state, formAction] = useActionState(generateAssessment, initialState);
  const { toast } = useToast();
  const stateRef = useRef(initialState);
  const reportPreviewRef = useRef<HTMLDivElement>(null);
  
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

  const handleDownload = () => {
    const input = reportPreviewRef.current;
    if (!input || !selectedChild) {
      toast({ variant: "destructive", title: "Error", description: "Cannot download report without a selected child and generated content." });
      return;
    }

    html2canvas(input, { scale: 2 }) // Using scale 2 for better resolution
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const canvasRatio = canvas.width / canvas.height;
        const pdfRatio = pdfWidth / pdfHeight;
        
        let imgWidth = pdfWidth;
        let imgHeight = pdfWidth / canvasRatio;

        if (imgHeight > pdfHeight) {
            imgHeight = pdfHeight;
            imgWidth = imgHeight * canvasRatio;
        }

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`assessment-report-${selectedChild.name.replace(/\s/g, '-')}.pdf`);
        toast({
          title: "Download Started",
          description: "Your report is being generated as a PDF.",
        });
      });
  };

  const handleShare = async () => {
    if (!navigator.share) {
      toast({
        variant: "destructive",
        title: "Unsupported",
        description: "Web Share API is not supported in your browser.",
      });
      return;
    }

    const input = reportPreviewRef.current;
    if (!input || !selectedChild) {
      toast({ variant: "destructive", title: "Error", description: "Cannot share report without generated content." });
      return;
    }
    
    try {
        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const canvasRatio = canvas.width / canvas.height;
        const imgWidth = pdfWidth;
        const imgHeight = pdfWidth / canvasRatio;
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight > pdfHeight ? pdfHeight : imgHeight);
        const pdfBlob = pdf.output('blob');

        const fileName = `assessment-report-${selectedChild.name.replace(/\s/g, '-')}.pdf`;
        const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
             await navigator.share({
                title: `Assessment for ${selectedChild.name}`,
                files: [file],
            });
            toast({
                title: "Report Shared",
                description: `The assessment for ${selectedChild.name} has been shared.`,
            });
        } else {
            toast({
                variant: "destructive",
                title: "Unsupported",
                description: "Sharing PDF files is not supported on this device.",
            });
        }
    } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
             toast({
                variant: 'destructive',
                title: 'Sharing Failed',
                description: 'There was an error while trying to share the report.',
            });
        }
    }
  };
  
  function calculateAge(dob: Date | string): number {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return 0; // Invalid date
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age > 0 ? age : 0;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Child Assessments</h1>
        <p className="text-muted-foreground">Generate detailed child performance reports using AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
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
                    <Select name="reportingPeriod" defaultValue="quarterly" required>
                        <SelectTrigger id="reporting-period">
                            <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                            <SelectItem value="Quarterly">Quarterly</SelectItem>
                            <SelectItem value="Yearly">Yearly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="template-select">Report Template</Label>
                    <Select name="template" defaultValue="standard" required>
                        <SelectTrigger id="template-select">
                            <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="standard">Standard Performance Report</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Separator />
                <h3 className="font-medium">Teacher's Notes</h3>
                <div className="space-y-2">
                  <Label htmlFor="socialEmotionalNotes">Social-Emotional Development</Label>
                  <Textarea id="socialEmotionalNotes" name="socialEmotionalNotes" placeholder="e.g., Shares toys, shows empathy..." required />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="cognitiveSkillsNotes">Cognitive Skills</Label>
                  <Textarea id="cognitiveSkillsNotes" name="cognitiveSkillsNotes" placeholder="e.g., Problem-solving, curiosity..." required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="languageCommunicationNotes">Language & Communication</Label>
                  <Textarea id="languageCommunicationNotes" name="languageCommunicationNotes" placeholder="e.g., Vocabulary, follows directions..." required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motorSkillsNotes">Fine & Gross Motor Skills</Label>
                  <Textarea id="motorSkillsNotes" name="motorSkillsNotes" placeholder="e.g., Drawing, running, jumping..." required />
                </div>
                <SubmitButton />
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
           <Card className="shadow-lg sticky top-6">
              <CardHeader className="flex flex-row justify-between items-center">
                  <div>
                      <CardTitle>Assessment Preview</CardTitle>
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
              </CardHeader>
              <CardContent ref={reportPreviewRef} className="p-8 aspect-[8.5/11] flex flex-col bg-white text-black overflow-y-auto">
                  {/* PDF Header */}
                  <div className="flex justify-between items-start pb-4 border-b border-gray-300">
                      <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-700">
                              <ToyBrick className="h-8 w-8 text-blue-600" />
                              <div className="font-bold text-2xl">{daycare?.name || "{{Daycare Name}}"}</div>
                          </div>
                          <div className="text-xs text-gray-500">{daycare?.address || "{{Daycare Address}}"}</div>
                      </div>
                      <div className="text-xs text-gray-500 text-right">
                          <p className="font-semibold text-base text-gray-800">Child Assessment Report</p>
                          <p>{state.output ? "For Period Ending July 2024" : "{{Reporting Period}}"}</p>
                      </div>
                  </div>

                  {/* Child Info */}
                  <div className="py-6">
                      <h2 className="text-lg font-semibold mb-4 text-gray-800">Child Information</h2>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                          <div><span className="font-medium text-gray-600">Name:</span> {selectedChild?.name || '{{childName}}'}</div>
                          <div><span className="font-medium text-gray-600">Age:</span> {selectedChild ? calculateAge(selectedChild.dateOfBirth) : '{{childAge}}'}</div>
                          <div><span className="font-medium text-gray-600">Parent/Guardian:</span> {selectedChild?.fatherName || '{{parentName}}'}</div>
                          <div><span className="font-medium text-gray-600">Date:</span> {new Date().toLocaleDateString()}</div>
                      </div>
                  </div>

                  <Separator className="bg-gray-200" />

                  {/* Assessment Body */}
                  <div className="flex-grow py-6 space-y-6">
                      {state.output ? (
                        <>
                          <ReportSection icon={<BookUser className="h-5 w-5 text-blue-600"/>} title="Social-Emotional Development" content={state.output.socialEmotional} />
                          <ReportSection icon={<Brain className="h-5 w-5 text-blue-600"/>} title="Cognitive Skills" content={state.output.cognitiveSkills} />
                          <ReportSection icon={<MessageSquare className="h-5 w-5 text-blue-600"/>} title="Language & Communication" content={state.output.languageCommunication} />
                          <ReportSection icon={<PersonStanding className="h-5 w-5 text-blue-600"/>} title="Fine & Gross Motor Skills" content={state.output.motorSkills} />
                           <div className="p-4 bg-gray-50 rounded-lg">
                              <h3 className="font-semibold text-gray-800 mb-2">Summary & Recommendations</h3>
                              <p className="text-sm text-gray-600 leading-relaxed">{state.output.summaryRecommendations}</p>
                           </div>
                        </>
                      ) : (
                         <div className="flex flex-col items-center justify-center text-center p-8 h-full rounded-lg bg-gray-50 text-gray-500">
                            <Bot className="h-12 w-12" />
                            <p className="mt-4 text-sm">Your AI-generated assessment report will appear here once generated.</p>
                          </div>
                      )}
                  </div>
                  
                  {/* Footer */}
                  <div className="pt-8 mt-auto border-t border-gray-300 text-sm text-gray-500 flex justify-between">
                      <div>
                          <div className="w-48 h-px bg-gray-500 mt-8"></div>
                          <p className="mt-1">Teacher's Signature</p>
                      </div>
                       <div>
                          <div className="w-32 h-px bg-gray-500 mt-8"></div>
                          <p className="mt-1">Date</p>
                      </div>
                  </div>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

const ReportSection = ({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) => (
    <div className="space-y-2">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            {icon}
            {title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">{content}</p>
    </div>
);
