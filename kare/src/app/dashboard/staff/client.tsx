
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
import { addStaffMember, type StaffFormData } from "./actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Staff } from "@prisma/client";
import { format } from "date-fns";

const payTypeOptions = ['Hourly', 'Salary'];

const initialState: {
  message: string | null;
  errors: any;
  data: StaffFormData | null;
} = {
  message: null,
  errors: null,
  data: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button size="lg" type="submit" disabled={pending} className="w-full md:w-auto">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Add Staff Member
    </Button>
  );
}

export default function StaffClientPage({ initialStaffMembers }: { initialStaffMembers: Staff[] }) {
  const [staffMembers, setStaffMembers] = useState<Staff[]>(initialStaffMembers);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(addStaffMember, initialState);
  const { toast } = useToast();

  useEffect(() => {
    setStaffMembers(initialStaffMembers);
  }, [initialStaffMembers]);

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
        formRef.current?.reset();
      }
    }
  }, [state, toast]);

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
                        <Badge variant={staff.status === 'Active' ? 'default' : 'outline'}>
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
              <form ref={formRef} action={formAction} className="space-y-8">
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
                
                <SubmitButton />
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={!!selectedStaff} onOpenChange={(isOpen) => { if (!isOpen) { setSelectedStaff(null); } }}>
        <DialogContent className="sm:max-w-xl">
          {selectedStaff && (
            <>
              <DialogHeader>
                  <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                          <AvatarImage src={selectedStaff.photoUrl ?? undefined} alt={selectedStaff.name} data-ai-hint={selectedStaff.photoHint ?? undefined} />
                          <AvatarFallback>{selectedStaff.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                          <DialogTitle>{selectedStaff.name}</DialogTitle>
                          <DialogDescription>
                            {selectedStaff.role}
                          </DialogDescription>
                      </div>
                  </div>
              </DialogHeader>
              <div className="space-y-4 py-4 text-sm max-h-[60vh] overflow-y-auto pr-4">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                          <dt className="font-medium text-muted-foreground">Status</dt>
                          <dd className="mt-1"><Badge variant={selectedStaff.status === 'Active' ? 'default' : 'outline'}>{selectedStaff.status}</Badge></dd>
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
              <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedStaff(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
