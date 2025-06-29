
'use client';

import { useEffect, useActionState, useState, useRef, useMemo } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileUp, ImageUp, Loader2, Mail } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { submitRegistration, type RegistrationFormData } from "../actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Child } from "@prisma/client";
import { programOptions, programTypeOptions, type Program, type ProgramType } from '../data';

const initialState: {
  message: string | null;
  errors: any;
  data: RegistrationFormData | null;
} = {
  message: null,
  errors: null,
  data: null,
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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button size="lg" type="submit" disabled={pending} className="w-full md:w-auto">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Submit Registration
    </Button>
  );
}

export function EnrollmentClient({ initialEnrolledChildren }: { initialEnrolledChildren: Child[] }) {
  const [enrolledChildren, setEnrolledChildren] = useState<Child[]>(initialEnrolledChildren);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Child | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(submitRegistration, initialState);
  const { toast } = useToast();
  
  const [activeFilter, setActiveFilter] = useState<string>('All');

  // Update local state when server provides new initial data
  useEffect(() => {
    setEnrolledChildren(initialEnrolledChildren);
  }, [initialEnrolledChildren]);

  const filteredChildren = useMemo(() => {
    if (activeFilter === 'All') {
      return [...enrolledChildren].sort((a, b) => a.name.localeCompare(b.name));
    }
    return enrolledChildren
      .filter(child => child.status === activeFilter)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [activeFilter, enrolledChildren]);

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
          
          // Optimistically add to the list
          const newChild: Child = {
            id: new Date().toISOString(),
            createdAt: new Date(),
            updatedAt: new Date(),
            name: state.data.childName,
            dateOfBirth: new Date(state.data.dob),
            startDate: new Date(state.data.startDate),
            program: state.data.program,
            programType: state.data.programType,
            status: state.data.status,
            motherName: state.data.motherName,
            fatherName: state.data.fatherName,
            homePhone: state.data.homePhone || null,
            mobilePhone: state.data.mobilePhone,
            address: state.data.address,
            emergencyName: state.data.emergencyName,
            emergencyPhone: state.data.emergencyPhone,
            vaccination: state.data.vaccination || null,
            allergies: state.data.allergies || null,
            notes: state.data.notes || null,
            photoUrl: 'https://placehold.co/100x100.png',
            photoHint: 'child portrait',
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
      toast({ title: "Success!", description: "Child information updated (client-side)." });
    }
  };

  const handleDeactivateChild = () => {
    if (selectedChild) {
      const newStatus = selectedChild.status === 'Active' ? 'Inactive' : 'Active';
      const updatedChild = { ...selectedChild, status: newStatus };
      setEnrolledChildren(prev => prev.map(child => child.id === selectedChild.id ? updatedChild : child));
      setSelectedChild(updatedChild);
      toast({ title: "Success!", description: `Child has been marked as ${newStatus.toLowerCase()} (client-side).` });
    }
  };

  const handleDeleteChild = () => {
    if (selectedChild) {
      setEnrolledChildren(prev => prev.filter(child => child.id !== selectedChild.id));
      setSelectedChild(null);
      setIsDeleteDialogOpen(false);
      toast({ title: "Success!", description: "Child record has been deleted (client-side)." });
    }
  };

  const handleOfferSpot = () => {
    if (selectedChild) {
      toast({
        title: "Offer Sent",
        description: `An offer notification has been sent to the parents of ${selectedChild.name}. You can activate this child once they accept the offer.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Child Enrollment</h1>
        <p className="text-muted-foreground">Manage child registrations and documentation.</p>
      </div>

      <Tabs defaultValue="directory">
        <TabsList>
          <TabsTrigger value="directory">Child Directory</TabsTrigger>
          <TabsTrigger value="new">Add New Child</TabsTrigger>
        </TabsList>
        <TabsContent value="directory">
          <Card>
            <CardHeader>
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <CardTitle>Child Directory</CardTitle>
                        <CardDescription>A list of all children, filterable by status.</CardDescription>
                    </div>
                     <Tabs defaultValue="All" onValueChange={setActiveFilter} className="w-full sm:w-auto">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="All">All</TabsTrigger>
                            <TabsTrigger value="Active">Active</TabsTrigger>
                            <TabsTrigger value="Waitlisted">Waitlisted</TabsTrigger>
                            <TabsTrigger value="Inactive">Inactive</TabsTrigger>
                        </TabsList>
                    </Tabs>
               </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Photo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Program Group</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredChildren.map((child) => (
                    <TableRow key={child.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={child.photoUrl ?? undefined} alt={child.name} data-ai-hint={child.photoHint ?? undefined} />
                          <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{child.name}</TableCell>
                      <TableCell>{calculateAge(child.dateOfBirth)}</TableCell>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                     <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" required>
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Select initial status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Waitlisted">Waitlisted</SelectItem>
                            </SelectContent>
                        </Select>
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
      
      <Dialog open={!!selectedChild} onOpenChange={(isOpen) => { if (!isOpen) { setSelectedChild(null); setIsEditing(false); } }}>
        <DialogContent className="sm:max-w-2xl">
          {selectedChild && (
            <>
              <DialogHeader>
                  <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4">
                      <Avatar className="h-24 w-24">
                          <AvatarImage src={isEditing ? editedData?.photoUrl ?? undefined : selectedChild.photoUrl ?? undefined} alt={selectedChild.name} data-ai-hint={isEditing ? editedData?.photoHint ?? undefined : selectedChild.photoHint ?? undefined} />
                          <AvatarFallback>{selectedChild.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1.5">
                          <DialogTitle>{isEditing ? 'Edit Child Details' : selectedChild.name}</DialogTitle>
                          <DialogDescription>
                            {isEditing ? `Update information for ${editedData?.name}.` : `Detailed information for ${selectedChild.name}.`}
                          </DialogDescription>
                      </div>
                  </div>
              </DialogHeader>
              {isEditing && editedData ? (
                  <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto pr-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Name</Label>
                        <Input id="edit-name" name="name" value={editedData.name} onChange={handleEditChange} />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="edit-dob">Date of Birth</Label>
                          <Input id="edit-dob" name="dateOfBirth" type="date" value={new Date(editedData.dateOfBirth).toISOString().split('T')[0]} onChange={handleEditChange} />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="edit-startDate">Start Date</Label>
                          <Input id="edit-startDate" name="startDate" type="date" value={new Date(editedData.startDate).toISOString().split('T')[0]} onChange={handleEditChange} />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="edit-programType">Program Type</Label>
                          <Select value={editedData.programType} onValueChange={(value: ProgramType) => handleProgramTypeChange(value as ProgramType)}>
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
                        <Select value={editedData.program} onValueChange={(value: Program) => handleProgramChange(value as Program)}>
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
                  <div className="space-y-6 py-4 text-sm max-h-[60vh] overflow-y-auto pr-4">
                      <div>
                          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                              <div className="sm:col-span-1">
                                  <dt className="font-medium text-muted-foreground">Name</dt>
                                  <dd className="mt-1 text-foreground">{selectedChild.name}</dd>
                              </div>
                               <div className="sm:col-span-1">
                                  <dt className="font-medium text-muted-foreground">Age</dt>
                                  <dd className="mt-1 text-foreground">{calculateAge(selectedChild.dateOfBirth)}</dd>
                              </div>
                              <div className="sm:col-span-1">
                                  <dt className="font-medium text-muted-foreground">Date of Birth</dt>
                                  <dd className="mt-1 text-foreground">{new Date(selectedChild.dateOfBirth).toLocaleDateString()}</dd>
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
            }
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
                      <Button variant="outline" onClick={() => { setIsEditing(true); setEditedData(selectedChild); }}>Edit</Button>
                      <Button variant="outline" onClick={handleDeactivateChild}>
                        {selectedChild?.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </Button>
                       {selectedChild.status === 'Waitlisted' && (
                        <Button onClick={handleOfferSpot}>
                          <Mail className="mr-2 h-4 w-4" />
                          Offer Spot
                        </Button>
                      )}
                  </>
               )}
            </DialogFooter>
          </>
        )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
