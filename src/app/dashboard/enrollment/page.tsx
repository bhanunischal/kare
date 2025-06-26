"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileUp, ImageUp, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { submitRegistration } from "./actions";

const enrolledChildren = [
  { id: '1', name: 'Olivia Martin', age: 4, program: 'Preschool', status: 'Active' },
  { id: '2', name: 'Liam Garcia', age: 3, program: 'Toddler', status: 'Active' },
  { id: '3', name: 'Emma Rodriguez', age: 5, program: 'Pre-K', status: 'Active' },
  { id: '4', name: 'Noah Hernandez', age: 2, program: 'Toddler', status: 'Waitlisted' },
  { id: '5', name: 'Ava Lopez', age: 4, program: 'Preschool', status: 'Active' },
];

const initialState = {
  message: null,
  errors: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button size="lg" type="submit" disabled={pending} className="w-full md:w-auto">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Submit Registration
    </Button>
  );
}

export default function EnrollmentPage() {
  const [state, formAction] = useFormState(submitRegistration, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast({
          variant: "destructive",
          title: "Error submitting form",
          description: state.message,
        });
      } else {
        toast({
          title: "Success!",
          description: state.message,
        });
        // Here you might want to reset the form
        // document.querySelector('form')?.reset();
      }
    }
  }, [state, toast]);


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Child Enrollment</h1>
        <p className="text-muted-foreground">Manage child registrations and documentation.</p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Enrolled Children</TabsTrigger>
          <TabsTrigger value="new">Add New Child</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Children</CardTitle>
              <CardDescription>A list of all children currently enrolled or on the waitlist.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrolledChildren.map((child) => (
                    <TableRow key={child.id}>
                      <TableCell className="font-medium">{child.name}</TableCell>
                      <TableCell>{child.age}</TableCell>
                      <TableCell>{child.program}</TableCell>
                      <TableCell>
                        <Badge variant={child.status === 'Active' ? 'default' : 'secondary'} className={child.status === 'Active' ? 'bg-accent text-accent-foreground' : ''}>
                          {child.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>New Child Registration</CardTitle>
              <CardDescription>Fill out the form below to register a new child.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-8">
                <div className="space-y-2">
                  <Label>Child's Profile Photo</Label>
                  <Card className="border-2 border-dashed">
                    <CardContent className="p-6 text-center">
                      <ImageUp className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2">
                        Drag & drop a photo here, or click to upload.
                      </p>
                      <Button variant="outline" size="sm" className="mt-4" type="button">
                        Upload Photo
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="child-name">Child's Full Name</Label>
                    <Input id="child-name" name="child-name" placeholder="e.g., Jane Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" name="dob" type="date" required />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">Parent/Guardian Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="mother-name">Mother's Name</Label>
                      <Input id="mother-name" name="mother-name" placeholder="e.g., Mary Smith" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="father-name">Father's Name</Label>
                      <Input id="father-name" name="father-name" placeholder="e.g., John Smith" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="home-phone">Home Phone</Label>
                      <Input id="home-phone" name="home-phone" type="tel" placeholder="e.g., (555) 123-4567" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile-phone">Mobile Phone</Label>
                      <Input id="mobile-phone" name="mobile-phone" type="tel" placeholder="e.g., (555) 987-6543" required />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea id="address" name="address" placeholder="e.g., 123 Main St, Anytown, USA 12345" required />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="emergency-name">Contact Full Name</Label>
                      <Input id="emergency-name" name="emergency-name" placeholder="e.g., Carol Danvers" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergency-phone">Contact Phone Number</Label>
                      <Input id="emergency-phone" name="emergency-phone" type="tel" placeholder="e.g., (555) 111-2222" required />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">Health Information</h3>
                  <div className="grid grid-cols-1 gap-6 pt-2">
                      <div className="space-y-2">
                          <Label htmlFor="vaccination">Vaccination Information</Label>
                          <Textarea id="vaccination" name="vaccination" placeholder="e.g., Up to date on all required vaccinations. Record attached." />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="allergies">Allergies</Label>
                          <Textarea id="allergies" name="allergies" placeholder="e.g., Peanuts, dairy. Carries an EpiPen." />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="notes">Additional Notes</Label>
                          <Textarea id="notes" name="notes" placeholder="e.g., Requires a nap in the afternoon. Loves to play with blocks." />
                      </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Required Documents</Label>
                  <Card className="border-2 border-dashed">
                    <CardContent className="p-6 text-center">
                      <FileUp className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mt-2">
                        Drag & drop files here, or click to upload.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        (Birth Certificate, Immunization Records)
                      </p>
                      <Button variant="outline" size="sm" className="mt-4" type="button">
                        Upload Files
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                <SubmitButton />
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
