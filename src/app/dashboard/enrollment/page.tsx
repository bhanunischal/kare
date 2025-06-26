
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";


type Program = 'Infant (0-12months)' | 'Toddler (1 to 3 years)' | 'Preschool (3 to 5 years)' | 'Gradeschooler (5 to 12 years)';
const programOptions: Program[] = ['Infant (0-12months)', 'Toddler (1 to 3 years)', 'Preschool (3 to 5 years)', 'Gradeschooler (5 to 12 years)'];

type ProgramType = 'Full time' | 'Part time' | 'Ad-hoc daily basis';
const programTypeOptions: ProgramType[] = ['Full time', 'Part time', 'Ad-hoc daily basis'];

type Child = {
  id: string;
  name: string;
  age: number;
  program: Program;
  programType: ProgramType;
  status: 'Active' | 'Waitlisted' | 'Inactive';
  dob: string;
  startDate: string;
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
    { id: '1', name: 'Olivia Martin', age: 4, program: 'Preschool (3 to 5 years)', programType: 'Full time', startDate: '2023-09-01', status: 'Active', dob: '2020-05-10', motherName: 'Sarah Martin', fatherName: 'David Martin', mobilePhone: '(555) 111-1111', address: '123 Maple St, Anytown, USA', emergencyName: 'Carol White', emergencyPhone: '(555) 222-2222', allergies: 'Peanuts', vaccination: 'Up to date.' },
    { id: '2', name: 'Liam Garcia', age: 3, program: 'Toddler (1 to 3 years)', programType: 'Full time', startDate: '2023-09-01', status: 'Active', dob: '2021-08-22', motherName: 'Maria Garcia', fatherName: 'Jose Garcia', mobilePhone: '(555) 333-3333', address: '456 Oak Ave, Anytown, USA', emergencyName: 'Luis Hernandez', emergencyPhone: '(555) 444-4444', notes: 'Loves building blocks.', vaccination: 'Up to date.' },
    { id: '3', name: 'Emma Rodriguez', age: 5, program: 'Preschool (3 to 5 years)', programType: 'Part time', startDate: '2023-09-01', status: 'Active', dob: '2019-02-15', motherName: 'Ana Rodriguez', fatherName: 'Carlos Rodriguez', mobilePhone: '(555) 555-5555', address: '789 Pine Ln, Anytown, USA', emergencyName: 'Sofia Rodriguez', emergencyPhone: '(555) 666-6666', vaccination: 'Up to date.' },
    { id: '4', name: 'Noah Hernandez', age: 2, program: 'Toddler (1 to 3 years)', programType: 'Full time', startDate: '2024-02-01', status: 'Waitlisted', dob: '2022-01-30', motherName: 'Isabella Hernandez', fatherName: 'Mateo Hernandez', mobilePhone: '(555) 777-7777', address: '101 Birch Rd, Anytown, USA', emergencyName: 'Elena Cruz', emergencyPhone: '(555) 888-8888', allergies: 'Dairy, Gluten', vaccination: 'Missing one shot.' },
    { id: '5', name: 'Ava Lopez', age: 4, program: 'Preschool (3 to 5 years)', programType: 'Full time', startDate: '2023-12-01', status: 'Active', dob: '2020-11-05', motherName: 'Mia Lopez', fatherName: 'James Lopez', mobilePhone: '(555) 999-9999', address: '212 Elm Ct, Anytown, USA', emergencyName: 'Sophia King', emergencyPhone: '(555) 000-0000', vaccination: 'Up to date.' },
    { id: '6', name: 'James Wilson', age: 6, program: 'Gradeschooler (5 to 12 years)', programType: 'Part time', startDate: '2022-09-01', status: 'Inactive', dob: '2018-03-12', motherName: 'Jessica Wilson', fatherName: 'Brian Wilson', mobilePhone: '(555) 123-7890', address: '333 Cedar Dr, Anytown, USA', emergencyName: 'Robert Johnson', emergencyPhone: '(555) 987-6543' },
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Child | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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
            program: state.data.program as Program,
            programType: state.data.programType as ProgramType,
            status: 'Active',
            dob: state.data.dob,
            startDate: state.data.startDate,
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

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editedData) {
      const { name, value } = e.target;
      setEditedData({ ...editedData, [name]: value });
    }
  };

  const handleProgramChange = (value: Program) => {
    if (editedData) {
      setEditedData({ ...editedData, program: value });
    }
  };

  const handleProgramTypeChange = (value: ProgramType) => {
    if (editedData) {
      setEditedData({ ...editedData, programType: value });
    }
  };

  const handleSaveChanges = () => {
    if (editedData) {
      setEnrolledChildren(prev => prev.map(child => child.id === editedData.id ? editedData : child));
      setSelectedChild(editedData);
      setIsEditing(false);
      toast({ title: "Success!", description: "Child information updated." });
    }
  };

  const handleDeactivateChild = () => {
    if (selectedChild) {
      const newStatus = selectedChild.status === 'Active' ? 'Inactive' : 'Active';
      const updatedChild = { ...selectedChild, status: newStatus };
      setEnrolledChildren(prev => prev.map(child => child.id === selectedChild.id ? updatedChild : child));
      setSelectedChild(updatedChild);
      toast({ title: "Success!", description: `Child has been marked as ${newStatus.toLowerCase()}.` });
    }
  };

  const handleDeleteChild = () => {
    if (selectedChild) {
      setEnrolledChildren(prev => prev.filter(child => child.id !== selectedChild.id));
      setSelectedChild(null);
      setIsDeleteDialogOpen(false);
      toast({ title: "Success!", description: "Child record has been deleted." });
    }
  };


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
                    <TableHead>Program Group</TableHead>
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
                        <Badge
                          variant={
                            child.status === 'Active'
                              ? 'default'
                              : child.status === 'Waitlisted'
                              ? 'secondary'
                              : 'outline'
                          }
                          className={cn({
                            'bg-accent text-accent-foreground': child.status === 'Active',
                          })}
                        >
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="start-date">Start Date</Label>
                        <Input id="start-date" name="start-date" type="date" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="program-type">Program Type</Label>
                        <Select name="program-type" required>
                            <SelectTrigger id="program-type">
                                <SelectValue placeholder="Select a program type" />
                            </SelectTrigger>
                            <SelectContent>
                                {programTypeOptions.map(option => (
                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                 <div className="space-y-2">
                    <Label htmlFor="program">Program Group</Label>
                    <Select name="program" required>
                        <SelectTrigger id="program">
                            <SelectValue placeholder="Select a program group" />
                        </SelectTrigger>
                        <SelectContent>
                            {programOptions.map(option => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
      
      <Dialog open={!!selectedChild} onOpenChange={(isOpen) => { if (!isOpen) { setSelectedChild(null); setIsEditing(false); } }}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Child Details' : 'Child Details'}</DialogTitle>
            <DialogDescription>
              {isEditing ? `Update information for ${editedData?.name}.` : `Detailed information for ${selectedChild?.name}.`}
            </DialogDescription>
          </DialogHeader>
          {selectedChild && (
            isEditing && editedData ? (
                <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Name</Label>
                      <Input id="edit-name" name="name" value={editedData.name} onChange={handleEditChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-dob">Date of Birth</Label>
                        <Input id="edit-dob" name="dob" type="date" value={editedData.dob} onChange={handleEditChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-startDate">Start Date</Label>
                        <Input id="edit-startDate" name="startDate" type="date" value={editedData.startDate} onChange={handleEditChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-programType">Program Type</Label>
                        <Select value={editedData.programType} onValueChange={(value: ProgramType) => handleProgramTypeChange(value)}>
                            <SelectTrigger id="edit-programType">
                                <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                                {programTypeOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="edit-program">Program Group</Label>
                      <Select value={editedData.program} onValueChange={(value: Program) => handleProgramChange(value)}>
                          <SelectTrigger id="edit-program">
                              <SelectValue placeholder="Select a program" />
                          </SelectTrigger>
                          <SelectContent>
                              {programOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                          </SelectContent>
                      </Select>
                   </div>
                  </div>
                  <Separator />
                  <h4 className="font-semibold text-base">Parent/Guardian Information</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-motherName">Mother's Name</Label>
                      <Input id="edit-motherName" name="motherName" value={editedData.motherName} onChange={handleEditChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-fatherName">Father's Name</Label>
                      <Input id="edit-fatherName" name="fatherName" value={editedData.fatherName} onChange={handleEditChange} />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="edit-mobilePhone">Mobile Phone</Label>
                      <Input id="edit-mobilePhone" name="mobilePhone" value={editedData.mobilePhone} onChange={handleEditChange} />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="edit-address">Address</Label>
                      <Textarea id="edit-address" name="address" value={editedData.address} onChange={handleEditChange} />
                    </div>
                  </div>
                  <Separator />
                  <h4 className="font-semibold text-base">Emergency Contact</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="space-y-2">
                      <Label htmlFor="edit-emergencyName">Name</Label>
                      <Input id="edit-emergencyName" name="emergencyName" value={editedData.emergencyName} onChange={handleEditChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-emergencyPhone">Phone</Label>
                      <Input id="edit-emergencyPhone" name="emergencyPhone" value={editedData.emergencyPhone} onChange={handleEditChange} />
                    </div>
                  </div>
                   <Separator />
                  <h4 className="font-semibold text-base">Health Information</h4>
                  <div className="grid grid-cols-1 gap-4">
                     <div className="space-y-2">
                      <Label htmlFor="edit-vaccination">Vaccination</Label>
                      <Textarea id="edit-vaccination" name="vaccination" value={editedData.vaccination || ''} onChange={handleEditChange} />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="edit-allergies">Allergies</Label>
                      <Textarea id="edit-allergies" name="allergies" value={editedData.allergies || ''} onChange={handleEditChange} />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="edit-notes">Notes</Label>
                      <Textarea id="edit-notes" name="notes" value={editedData.notes || ''} onChange={handleEditChange} />
                    </div>
                  </div>
                </div>
            ) : (
                <div className="space-y-6 py-4 text-sm max-h-[70vh] overflow-y-auto pr-4">
                    <div>
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                                <dt className="font-medium text-muted-foreground">Name</dt>
                                <dd className="mt-1 text-foreground">{selectedChild.name}</dd>
                            </div>
                             <div className="sm:col-span-1">
                                <dt className="font-medium text-muted-foreground">Age</dt>
                                <dd className="mt-1 text-foreground">{selectedChild.age}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="font-medium text-muted-foreground">Date of Birth</dt>
                                <dd className="mt-1 text-foreground">{new Date(selectedChild.dob).toLocaleDateString()}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="font-medium text-muted-foreground">Start Date</dt>
                                <dd className="mt-1 text-foreground">{new Date(selectedChild.startDate).toLocaleDateString()}</dd>
                            </div>
                             <div className="sm:col-span-1">
                                <dt className="font-medium text-muted-foreground">Program Group</dt>
                                <dd className="mt-1 text-foreground">{selectedChild.program}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="font-medium text-muted-foreground">Program Type</dt>
                                <dd className="mt-1 text-foreground">{selectedChild.programType}</dd>
                            </div>
                             <div className="sm:col-span-2">
                                <dt className="font-medium text-muted-foreground">Status</dt>
                                <dd className="mt-1 text-foreground">
                                    <Badge 
                                        variant={
                                            selectedChild.status === 'Active' ? 'default' :
                                            selectedChild.status === 'Waitlisted' ? 'secondary' :
                                            'outline'
                                        } 
                                        className={cn({'bg-accent text-accent-foreground': selectedChild.status === 'Active'})}>
                                        {selectedChild.status}
                                    </Badge>
                                </dd>
                            </div>
                        </dl>
                    </div>
                    <Separator />
                    <div>
                        <h4 className="font-semibold text-base mb-4">Parent/Guardian Information</h4>
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                             <div className="sm:col-span-1">
                                <dt className="font-medium text-muted-foreground">Mother's Name</dt>
                                <dd className="mt-1 text-foreground">{selectedChild.motherName}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="font-medium text-muted-foreground">Father's Name</dt>
                                <dd className="mt-1 text-foreground">{selectedChild.fatherName}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="font-medium text-muted-foreground">Mobile Phone</dt>
                                <dd className="mt-1 text-foreground">{selectedChild.mobilePhone}</dd>
                            </div>
                            <div className="sm:col-span-2">
                                <dt className="font-medium text-muted-foreground">Address</dt>
                                <dd className="mt-1 text-foreground whitespace-pre-wrap">{selectedChild.address}</dd>
                            </div>
                        </dl>
                    </div>
                    <Separator />
                     <div>
                        <h4 className="font-semibold text-base mb-4">Emergency Contact</h4>
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                             <div className="sm:col-span-1">
                                <dt className="font-medium text-muted-foreground">Name</dt>
                                <dd className="mt-1 text-foreground">{selectedChild.emergencyName}</dd>
                            </div>
                            <div className="sm:col-span-1">
                                <dt className="font-medium text-muted-foreground">Phone</dt>
                                <dd className="mt-1 text-foreground">{selectedChild.emergencyPhone}</dd>
                            </div>
                        </dl>
                    </div>
                    <Separator />
                    <div>
                        <h4 className="font-semibold text-base mb-4">Health Information</h4>
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-1">
                             <div>
                                <dt className="font-medium text-muted-foreground">Vaccination</dt>
                                <dd className="mt-1 text-foreground">{selectedChild.vaccination || 'N/A'}</dd>
                            </div>
                             <div>
                                <dt className="font-medium text-muted-foreground">Allergies</dt>
                                <dd className="mt-1 text-foreground">{selectedChild.allergies || 'None'}</dd>
                            </div>
                             <div>
                                <dt className="font-medium text-muted-foreground">Notes</dt>
                                <dd className="mt-1 text-foreground">{selectedChild.notes || 'None'}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
             )
          )}
          <DialogFooter>
             {isEditing ? (
                <>
                    <Button variant="outline" onClick={() => { setIsEditing(false); setEditedData(null); }}>Cancel</Button>
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                </>
             ) : (
                <>
                    <div className="mr-auto">
                        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">Delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the child's record.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteChild}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    <Button variant="outline" onClick={() => setSelectedChild(null)}>Close</Button>
                    <Button variant="outline" onClick={handleDeactivateChild}>
                      {selectedChild?.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button onClick={() => { setIsEditing(true); setEditedData(selectedChild); }}>Edit</Button>
                </>
             )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
