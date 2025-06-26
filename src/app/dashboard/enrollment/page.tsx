
"use client";

import { useEffect, useActionState, useState, useRef } from "react";
import { useFormStatus } from "react-dom";
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
import { submitRegistration, type RegistrationFormData } from "./actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

type Child = {
  id: string;
  name: string;
  age: number;
  program: 'Preschool' | 'Toddler' | 'Pre-K';
  status: 'Active' | 'Waitlisted';
  dob: string;
  motherName: string;
  fatherName: string;
  mobilePhone: string;
  address: string;
  emergencyName: string;
  emergencyPhone: string;
  allergies?: string;
  notes?: string;
  vaccination?: string;
};

const initialEnrolledChildren: Child[] = [
    { id: '1', name: 'Olivia Martin', age: 4, program: 'Preschool', status: 'Active', dob: '2020-05-10', motherName: 'Sarah Martin', fatherName: 'David Martin', mobilePhone: '(555) 111-1111', address: '123 Maple St, Anytown, USA', emergencyName: 'Carol White', emergencyPhone: '(555) 222-2222', allergies: 'Peanuts', vaccination: 'Up to date.' },
    { id: '2', name: 'Liam Garcia', age: 3, program: 'Toddler', status: 'Active', dob: '2021-08-22', motherName: 'Maria Garcia', fatherName: 'Jose Garcia', mobilePhone: '(555) 333-3333', address: '456 Oak Ave, Anytown, USA', emergencyName: 'Luis Hernandez', emergencyPhone: '(555) 444-4444', notes: 'Loves building blocks.', vaccination: 'Up to date.' },
    { id: '3', name: 'Emma Rodriguez', age: 5, program: 'Pre-K', status: 'Active', dob: '2019-02-15', motherName: 'Ana Rodriguez', fatherName: 'Carlos Rodriguez', mobilePhone: '(555) 555-5555', address: '789 Pine Ln, Anytown, USA', emergencyName: 'Sofia Rodriguez', emergencyPhone: '(555) 666-6666', vaccination: 'Up to date.' },
    { id: '4', name: 'Noah Hernandez', age: 2, program: 'Toddler', status: 'Waitlisted', dob: '2022-01-30', motherName: 'Isabella Hernandez', fatherName: 'Mateo Hernandez', mobilePhone: '(555) 777-7777', address: '101 Birch Rd, Anytown, USA', emergencyName: 'Elena Cruz', emergencyPhone: '(555) 888-8888', allergies: 'Dairy, Gluten', vaccination: 'Missing one shot.' },
    { id: '5', name: 'Ava Lopez', age: 4, program: 'Preschool', status: 'Active', dob: '2020-11-05', motherName: 'Mia Lopez', fatherName: 'James Lopez', mobilePhone: '(555) 999-9999', address: '212 Elm Ct, Anytown, USA', emergencyName: 'Sophia King', emergencyPhone: '(555) 000-0000', vaccination: 'Up to date.' },
];


const initialState: {
  message: string | null;
  errors: any;
  data: RegistrationFormData | null;
} = {
  message: null,
  errors: null,
  data: null,
};

function calculateAge(dob: string): number {
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
  const [enrolledChildren, setEnrolledChildren] = useState<Child[]>(initialEnrolledChildren);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(submitRegistration, initialState);
  const { toast } = useToast();
  
  const processedStateRef = useRef(initialState);

  useEffect(() => {
    if (state !== processedStateRef.current) {
      if (state.message) {
        if (state.errors) {
          toast({
            variant: "destructive",
            title: "Error submitting form",
            description: state.message,
          });
        } else if (state.data) {
          toast({
            title: "Success!",
            description: state.message,
          });

          const newChild: Child = {
            id: String(new Date().getTime()),
            name: state.data.childName,
            age: calculateAge(state.data.dob),
            program: 'Preschool',
            status: 'Active',
            dob: state.data.dob,
            motherName: state.data.motherName,
            fatherName: state.data.fatherName,
            mobilePhone: state.data.mobilePhone,
            address: state.data.address,
            emergencyName: state.data.emergencyName,
            emergencyPhone: state.data.emergencyPhone,
            allergies: state.data.allergies,
            notes: state.data.notes,
            vaccination: state.data.vaccination,
          };
          
          setEnrolledChildren(prev => [newChild, ...prev]);
          formRef.current?.reset();
        }
      }
      processedStateRef.current = state;
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
                        <Button variant="ghost" size="sm" onClick={() => setSelectedChild(child)}>View</Button>
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
              <form ref={formRef} action={formAction} className="space-y-8">
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
      
      <Dialog open={!!selectedChild} onOpenChange={(isOpen) => !isOpen && setSelectedChild(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Child Details</DialogTitle>
            <DialogDescription>
              Detailed information for {selectedChild?.name}.
            </DialogDescription>
          </DialogHeader>
          {selectedChild && (
            <div className="grid gap-4 py-4 text-sm">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div><span className="font-semibold">Name:</span> {selectedChild.name}</div>
                    <div><span className="font-semibold">Age:</span> {selectedChild.age}</div>
                    <div><span className="font-semibold">Date of Birth:</span> {new Date(selectedChild.dob).toLocaleDateString()}</div>
                    <div><span className="font-semibold">Program:</span> {selectedChild.program}</div>
                    <div className="col-span-2"><span className="font-semibold">Status:</span> 
                        <Badge variant={selectedChild.status === 'Active' ? 'default' : 'secondary'} className={`${selectedChild.status === 'Active' ? 'bg-accent text-accent-foreground' : ''} ml-2`}>
                            {selectedChild.status}
                        </Badge>
                    </div>
                </div>
                <Separator />
                <h4 className="font-semibold text-base">Parent/Guardian Information</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div><span className="font-semibold">Mother:</span> {selectedChild.motherName}</div>
                    <div><span className="font-semibold">Father:</span> {selectedChild.fatherName}</div>
                    <div className="col-span-2"><span className="font-semibold">Mobile Phone:</span> {selectedChild.mobilePhone}</div>
                    <div className="col-span-2"><span className="font-semibold">Address:</span> {selectedChild.address}</div>
                </div>
                <Separator />
                <h4 className="font-semibold text-base">Emergency Contact</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div><span className="font-semibold">Name:</span> {selectedChild.emergencyName}</div>
                    <div><span className="font-semibold">Phone:</span> {selectedChild.emergencyPhone}</div>
                </div>
                <Separator />
                <h4 className="font-semibold text-base">Health Information</h4>
                <div className="grid grid-cols-1 gap-y-2">
                    <div><span className="font-semibold">Vaccination:</span> {selectedChild.vaccination || 'N/A'}</div>
                    <div><span className="font-semibold">Allergies:</span> {selectedChild.allergies || 'None'}</div>
                    <div><span className="font-semibold">Notes:</span> {selectedChild.notes || 'None'}</div>
                </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedChild(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

