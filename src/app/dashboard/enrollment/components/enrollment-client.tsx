
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
import { submitRegistration, updateChild, updateChildStatus, deleteChild, type RegistrationFormData } from "../actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Child, ChildStatus } from "@prisma/client";

const programOptions = ['Infant (0-12months)', 'Toddler (1 to 3 years)', 'Preschool (3 to 5 years)', 'Gradeschooler (5 to 12 years)'];
const programTypeOptions = ['Full time', 'Part time', 'Ad-hoc daily basis'];
const statusOptions: ChildStatus[] = ['Active', 'Waitlisted', 'Inactive'];

const registrationInitialState: {
  message: string | null;
  errors: any;
  data: RegistrationFormData | null;
} = {
  message: null,
  errors: null,
  data: null,
};

const updateInitialState: { message: string | null; errors: any; } = { message: null, errors: null };


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

function SubmitRegistrationButton() {
  const { pending } = useFormStatus();
  return (
    <Button size="lg" type="submit" disabled={pending} className="w-full md:w-auto">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Submit Registration
    </Button>
  );
}

function SubmitUpdateButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
             {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
             Save Changes
        </Button>
    )
}

export function EnrollmentClient({ initialEnrolledChildren }: { initialEnrolledChildren: Child[] }) {
  const [enrolledChildren, setEnrolledChildren] = useState<Child[]>(initialEnrolledChildren);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Child | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(submitRegistration, registrationInitialState);
  const [updateState, updateFormAction] = useActionState(updateChild, updateInitialState);
  const { toast } = useToast();
  
  const [activeFilter, setActiveFilter] = useState<string>('All');

  // Update local state when server provides new initial data (e.g., after revalidation)
  useEffect(() => {
    setEnrolledChildren(initialEnrolledChildren);
  }, [initialEnrolledChildren]);
  
  useEffect(() => {
    // This is for the child info viewer dialog
    if (selectedChild) {
        const freshChildData = enrolledChildren.find(c => c.id === selectedChild.id);
        if(freshChildData) {
            setSelectedChild(freshChildData);
        } else {
            // Child was deleted, close dialog
            setSelectedChild(null);
        }
    }
  }, [enrolledChildren, selectedChild]);


  const filteredChildren = useMemo(() => {
    if (activeFilter === 'All') {
      return [...enrolledChildren].sort((a, b) => a.name.localeCompare(b.name));
    }
    return enrolledChildren
      .filter(child => child.status === activeFilter)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [activeFilter, enrolledChildren]);

  // Handle form submission feedback from the server action
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
        // Reset the form after a successful submission
        formRef.current?.reset();
      }
    }
  }, [state, toast]);

  // Handle form update feedback
  useEffect(() => {
    if (updateState.message) {
        if (updateState.errors) {
            toast({ variant: "destructive", title: "Update Failed", description: updateState.message });
        } else {
            toast({ title: "Success!", description: updateState.message });
            setIsEditing(false); // Close edit mode on success
        }
    }
  }, [updateState, toast]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editedData) {
      const { name, value } = e.target;
      setEditedData({ ...editedData, [name]: value });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (editedData) {
      setEditedData({ ...editedData, [name]: value as any });
    }
  };
  
  const handleDeactivateChild = async () => {
    if (selectedChild) {
        const newStatus = selectedChild.status === 'Active' ? 'Inactive' : 'Active';
        const result = await updateChildStatus(selectedChild.id, newStatus);
        if (result.success) {
            toast({ title: "Status Updated", description: result.message });
            // The dialog will close because the selectedChild state will be updated via revalidation
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
    }
  };
  
  const handleDeleteChild = async () => {
    if (selectedChild) {
        const result = await deleteChild(selectedChild.id);
        if (result.success) {
            toast({ title: "Child Deleted", description: result.message });
            setIsDeleteDialogOpen(false);
            setSelectedChild(null);
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
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
                  {filteredChildren.length > 0 ? filteredChildren.map((child) => (
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
                  )) : (
                     <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            No children found for this filter.
                        </TableCell>
                     </TableRow>
                  )}
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
                <SubmitRegistrationButton />
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
                <form action={updateFormAction} className="space-y-6 py-4 max-h-[60vh] overflow-y-auto pr-4">
                    <input type="hidden" name="id" value={editedData.id} />
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
                          <Select name="programType" value={editedData.programType} onValueChange={(value) => handleSelectChange('programType', value)}>
                              <SelectTrigger id="edit-programType">
                                  <SelectValue placeholder="Select a type" />
                              </SelectTrigger>
                              <SelectContent>
                                  {programTypeOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                              </SelectContent>
                          </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-program">Program Group</Label>
                        <Select name="program" value={editedData.program} onValueChange={(value) => handleSelectChange('program', value)}>
                            <SelectTrigger id="edit-program">
                                <SelectValue placeholder="Select a program" />
                            </SelectTrigger>
                            <SelectContent>
                                {programOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                            </SelectContent>
                        </Select>
                     </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-status">Status</Label>
                        <Select name="status" value={editedData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                            <SelectTrigger id="edit-status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
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
                     <DialogFooter>
                      <Button variant="outline" type="button" onClick={() => { setIsEditing(false); setEditedData(null); }}>Cancel</Button>
                      <SubmitUpdateButton />
                  </DialogFooter>
                </form>
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
                        <DialogFooter>
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
                      </DialogFooter>
                  </div>
               )
            }
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
