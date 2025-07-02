
'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ToyBrick } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function NewTemplatePage() {
    const { toast } = useToast();
    const router = useRouter();

    const handleSave = () => {
        toast({
            title: "Template Saved",
            description: "The new template has been saved successfully.",
        });
        // In a real app, this would be a server action to save to DB.
        // After success, redirect back to the templates list.
        router.push('/admin/templates');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                 <Link href="/admin/templates">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">Create New Report Template</h1>
                    <p className="text-muted-foreground">Design a new template for child assessments.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Template Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="template-name">Template Name</Label>
                                <Input id="template-name" placeholder="e.g., Detailed Quarterly Review" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="template-description">Description</Label>
                                <Textarea id="template-description" placeholder="A short description of this template." />
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => router.push('/admin/templates')}>Cancel</Button>
                        <Button onClick={handleSave}>Save Template</Button>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <Card className="shadow-lg">
                        <CardContent className="p-8 aspect-[8.5/11] flex flex-col bg-white text-black">
                            {/* PDF Header */}
                            <div className="flex justify-between items-start pb-4 border-b border-gray-300">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <ToyBrick className="h-8 w-8 text-blue-600" />
                                        <div className="font-bold text-2xl">{"{{daycareName}}"}</div>
                                    </div>
                                    <div className="text-xs text-gray-500">{"{{daycareAddress}}"}</div>
                                </div>
                                <div className="text-xs text-gray-500 text-right">
                                    <p className="font-semibold text-base text-gray-800">Child Assessment Report</p>
                                    <p>{"{{reportingPeriod}}"}</p>
                                </div>
                            </div>
                            
                            {/* Child Info */}
                            <div className="py-6">
                                <h2 className="text-lg font-semibold mb-4 text-gray-800">Child Information</h2>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                    <div><span className="font-medium text-gray-600">Name:</span> {"{{childName}}"}</div>
                                    <div><span className="font-medium text-gray-600">Age:</span> {"{{childAge}}"}</div>
                                    <div><span className="font-medium text-gray-600">Gender:</span> {"{{childGender}}"}</div>
                                    <div><span className="font-medium text-gray-600">Parent/Guardian:</span> {"{{fatherName}}"}</div>
                                </div>
                            </div>

                            <Separator className="bg-gray-200" />
                            
                            {/* Assessment Body */}
                            <div className="flex-grow py-6 space-y-6">
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-gray-800">Social-Emotional Development</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{"{{socialEmotional}}"}</p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-gray-800">Cognitive Skills</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{"{{cognitiveSkills}}"}</p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-gray-800">Language & Communication</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{"{{languageCommunication}}"}</p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-gray-800">Fine & Gross Motor Skills</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{"{{motorSkills}}"}</p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-gray-800">Summary & Recommendations</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{"{{summaryRecommendations}}"}</p>
                                </div>
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
