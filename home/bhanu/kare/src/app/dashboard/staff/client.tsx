
'use client';

import { useEffect, useActionState, useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { addStaffMember, updateStaff, updateStaffStatus, deleteStaff, type StaffFormData, type StaffStatus } from "./actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { Staff } from "@prisma/client";
import { format } from "date-fns";

const payTypeOptions = ['Hourly', 'Salary'];

const addInitialState: {
  message: string | null;
  errors: any;
  data: StaffFormData | null;
} = {
  message: null,
  errors: null,
  data: null,
};

const updateInitialState: { message: string | null; errors: any; } = { message: null, errors: null };

function SubmitAddButton() {
  const { pending } = useFormStatus();
  return (
    <Button size="lg" type="submit" disabled={pending} className="w-full md:w-auto">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Add Staff Member
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
  );
}

export default function StaffClientPage({ initialStaffMembers }: { initialStaffMembers: Staff[] }) {
  const [staffMembers, setStaffMembers] = useState<Staff[]>(initialStaffMembers);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Staff | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);
  
  const [addState, addFormAction] = useActionState(addStaffMember, addInitialState);
  const [updateState, updateFormAction] = useActionState(updateStaff, updateInitialState);

  const { toast } = useToast();

  useEffect(() => {
    setStaffMembers(initialStaffMembers);
  }, [initialStaffMembers]);

  useEffect(() => {
    if (selectedStaff) {
      const freshStaffData = staffMembers.find(s => s.id === selectedStaff.id);
      if (freshStaffData) {
        setSelectedStaff(freshStaffData);
        if (isEditing) {
          setEditedData(freshStaffData);
        }
      } else {
        setSelectedStaff(null); // Staff member was deleted, so close dialog
        setIsEditing(false);
      }
    }
  }, [staffMembers, selectedStaff, isEditing]);

  useEffect(() => {
    if (addState.message) {
      if (addState.errors) {
        toast({
          variant: "destructive",
          title: "Error submitting form",
          description: addState.message,
        });
      } else {
        toast({
          title: "Success!",
          description: addState.message,
        });
        formRef.current?.reset();
      }
    }
  }, [addState, toast]);

  useEffect(() => {
    if (updateState.message) {
        if (updateState.errors) {
            toast({ variant: "destructive", title: "Update Failed", description: updateState.message });
        } else {
            toast({ title: "Success!", description: updateState.message });
            setIsEditing(false);
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

  const handleStatusUpdate = async (newStatus: StaffStatus) => {
    if (!selectedStaff) return;
    
    const result = await updateStaffStatus(selectedStaff.id, newStatus);
    if (!result.success) {
      toast({ variant: "destructive", title: "Error", description: result.message });
    } else {
      toast({ title: "Status Updated", description: result.message });
    }
  };

  const handleDelete = async () => {
    if (!selectedStaff) return;
    const result = await deleteStaff(selectedStaff.id);
    if (result.success) {
        toast({ title: "Staff Deleted", description: result.message });
        setIsDeleteDialogOpen(false);
        setSelectedStaff(null);
    } else {
        toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Staff Management</h1>
        <p className="text-muted-foreground">Manage staff profiles, schedules, and certifications.</p>
      </div>

      <Tabs defaultValue="directory">
        <TabsList>
          <TabsTrigger value="directory">Staff Directory</TabsTrigger>
          <TabsTrigger value="new">Add New Staff</TabsTrigger>
        </TabsList>
        <TabsContent value="directory">
          <Card>
            <CardHeader>
              <CardTitle>Staff Directory</CardTitle>
              <CardDescription>A list of all staff members.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Photo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffMembers.length > 0 ? staffMembers.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={staff.photoUrl ?? undefined} alt={staff.name} data-ai-hint={staff.photoHint ?? undefined} />
                          <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{staff.name}</TableCell>
                      <TableCell>{staff.role}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            staff.status === 'Active' ? 'default'
                            : staff.status === 'Inactive' ? 'secondary'
                            : 'outline'
                          }
                        >
                          {staff.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedStaff(staff)}>View</Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                     <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            No staff members found. Add one to get started.
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
              <CardTitle>Add New Staff Member</CardTitle>
              <CardDescription>Fill out the form below to add a new staff member.</CardDescription>
            </CardHeader>
            <CardContent>
              <form ref={formRef} action={addFormAction} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" placeholder="e.g., Emily Jones" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" name="role" placeholder="e.g., Lead Teacher" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="start-date">Start Date</Label>
                        <Input id="start-date" name="start-date" type="date" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" type="tel" placeholder="e.g., (555) 555-5555" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" name="address" placeholder="e.g., 456 Oak Ave, Anytown, USA 12345" required />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="emergency-name">Contact Full Name</Label>
                      <Input id="emergency-name" name="emergency-name" placeholder="e.g., Michael Jones" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergency-phone">Contact Phone Number</Label>
                      <Input id="emergency-phone" name="emergency-phone" type="tel" placeholder="e.g., (555) 111-2222" required />
                    </div>
                  </div>
                </div>

                 <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">Compensation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="pay-type">Pay Type</Label>
                      <Select name="pay-type" required>
                        <SelectTrigger id="pay-type">
                            <SelectValue placeholder="Select pay type" />
                        </SelectTrigger>
                        <SelectContent>
                            {payTypeOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pay-rate">Pay Rate</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                            <Input id="pay-rate" name="pay-rate" type="number" step="0.01" placeholder="e.g., 25.50" className="pl-6" required />
                        </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">Certifications & Notes</h3>
                  <div className="grid grid-cols-1 gap-6 pt-2">
                      <div className="space-y-2">
                          <Label htmlFor="certifications">Certifications</Label>
                          <Textarea id="certifications" name="certifications" placeholder="e.g., ECE Level 1, First Aid/CPR (Expires 2025-12-31)" />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="notes">Additional Notes</Label>
                          <Textarea id="notes" name="notes" placeholder="e.g., Works Monday to Friday, 8am-4pm." />
                      </div>
                  </div>
                </div>
                
                <SubmitAddButton />
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={!!selectedStaff} onOpenChange={(isOpen) => { if (!isOpen) { setSelectedStaff(null); setIsEditing(false); } }}>
        <DialogContent className="sm:max-w-2xl">
          {selectedStaff && (
            <>
              <DialogHeader>
                  <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                          <AvatarImage src={isEditing ? editedData?.photoUrl ?? undefined : selectedStaff.photoUrl ?? undefined} alt={selectedStaff.name} data-ai-hint={isEditing ? editedData?.photoHint ?? undefined : selectedStaff.photoHint ?? undefined} />
                          <AvatarFallback>{selectedStaff.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                          <DialogTitle>{isEditing ? 'Edit Staff Details' : selectedStaff.name}</DialogTitle>
                          <DialogDescription>
                            {isEditing ? `Update profile for ${editedData?.name}.` : `${selectedStaff.role}`}
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
                        <Label htmlFor="edit-role">Role</Label>
                        <Input id="edit-role" name="role" value={editedData.role} onChange={handleEditChange} />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="edit-startDate">Start Date</Label>
                          <Input id="edit-startDate" name="startDate" type="date" value={new Date(editedData.startDate).toISOString().split('T')[0]} onChange={handleEditChange} />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="edit-phone">Phone</Label>
                          <Input id="edit-phone" name="phone" value={editedData.phone} onChange={handleEditChange} />
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <Label htmlFor="edit-address">Address</Label>
                        <Textarea id="edit-address" name="address" value={editedData.address} onChange={handleEditChange} />
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
                    <h4 className="font-semibold text-base">Compensation</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-payType">Pay Type</Label>
                        <Select name="payType" value={editedData.payType} onValueChange={(value) => handleSelectChange('payType', value)}>
                          <SelectTrigger id="edit-payType"><SelectValue /></SelectTrigger>
                          <SelectContent>{payTypeOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-payRate">Pay Rate</Label>
                        <Input id="edit-payRate" name="payRate" type="number" step="0.01" value={editedData.payRate} onChange={handleEditChange} />
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-1 gap-4">
                       <div className="space-y-2">
                        <Label htmlFor="edit-certifications">Certifications</Label>
                        <Textarea id="edit-certifications" name="certifications" value={editedData.certifications || ''} onChange={handleEditChange} />
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
                <>
                  <div className="space-y-4 py-4 text-sm max-h-[60vh] overflow-y-auto pr-4">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                          <div className="sm:col-span-1">
                              <dt className="font-medium text-muted-foreground">Status</dt>
                              <dd className="mt-1"><Badge variant={selectedStaff.status === 'Active' ? 'default' : selectedStaff.status === 'Inactive' ? 'secondary' : 'outline'}>{selectedStaff.status}</Badge></dd>
                          </div>
                          <div className="sm:col-span-1">
                              <dt className="font-medium text-muted-foreground">Start Date</dt>
                              <dd className="mt-1">{format(new Date(selectedStaff.startDate), 'PPP')}</dd>
                          </div>
                          <div className="sm:col-span-1">
                              <dt className="font-medium text-muted-foreground">Phone</dt>
                              <dd className="mt-1">{selectedStaff.phone}</dd>
                          </div>
                          <div className="sm:col-span-2">
                              <dt className="font-medium text-muted-foreground">Address</dt>
                              <dd className="mt-1 whitespace-pre-wrap">{selectedStaff.address}</dd>
                          </div>
                          <div className="sm:col-span-1">
                              <dt className="font-medium text-muted-foreground">Emergency Contact</dt>
                              <dd className="mt-1">{selectedStaff.emergencyName}</dd>
                          </div>
                          <div className="sm:col-span-1">
                              <dt className="font-medium text-muted-foreground">Emergency Phone</dt>
                              <dd className="mt-1">{selectedStaff.emergencyPhone}</dd>
                          </div>
                          <div className="sm:col-span-1">
                              <dt className="font-medium text-muted-foreground">Pay Type</dt>
                              <dd className="mt-1">{selectedStaff.payType}</dd>
                          </div>
                          <div className="sm:col-span-1">
                              <dt className="font-medium text-muted-foreground">Pay Rate</dt>
                              <dd className="mt-1">${selectedStaff.payRate.toFixed(2)}</dd>
                          </div>
                          <div className="sm:col-span-2">
                              <dt className="font-medium text-muted-foreground">Certifications</dt>
                              <dd className="mt-1 whitespace-pre-wrap">{selectedStaff.certifications || 'N/A'}</dd>
                          </div>
                          <div className="sm:col-span-2">
                              <dt className="font-medium text-muted-foreground">Notes</dt>
                              <dd className="mt-1 whitespace-pre-wrap">{selectedStaff.notes || 'N/A'}</dd>
                          </div>
                      </dl>
                  </div>
                  <DialogFooter className="flex-wrap justify-between items-center">
                      <div>
                        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                          <AlertDialogTrigger asChild>
                              <Button variant="destructive">Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                              <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete this staff member's record from the database.
                              </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                              </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setSelectedStaff(null)}>Close</Button>
                        <Button variant="outline" onClick={() => { setIsEditing(true); setEditedData(selectedStaff); }}>Edit</Button>
                        {selectedStaff.status === 'Active' && (
                          <Button variant="outline" onClick={() => handleStatusUpdate('Inactive')}>Deactivate</Button>
                        )}
                        {selectedStaff.status === 'Inactive' && (
                          <>
                            <Button variant="outline" onClick={() => handleStatusUpdate('Active')}>Activate</Button>
                            <Button variant="secondary" onClick={() => handleStatusUpdate('Archived')}>Archive</Button>
                          </>
                        )}
                        {selectedStaff.status === 'Archived' && (
                          <Button variant="outline" onClick={() => handleStatusUpdate('Inactive')}>Restore</Button>
                        )}
                      </div>
                  </DialogFooter>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
