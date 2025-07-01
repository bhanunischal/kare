
'use client';

import {useEffect, useActionState, useState, useRef} from 'react';
import {useFormStatus} from 'react-dom';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Badge} from '@/components/ui/badge';
import {Loader2, ImageUp, DollarSign} from 'lucide-react';
import {Textarea} from '@/components/ui/textarea';
import {useToast} from '@/hooks/use-toast';
import {addStaffMember, type StaffFormData} from './actions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {Separator} from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {cn} from '@/lib/utils';
import type { Staff } from '@prisma/client';

type Role = 'Lead ECE' | 'Assistant' | 'ECE-IT' | 'Support Staff';
const roleOptions: Role[] = [
  'Lead ECE',
  'Assistant',
  'ECE-IT',
  'Support Staff',
];

type Status = 'Active' | 'On Leave' | 'Inactive';
type PayType = 'Monthly Salary' | 'Hourly Rate';
const payTypeOptions: PayType[] = ['Monthly Salary', 'Hourly Rate'];

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
  const {pending} = useFormStatus();
  return (
    <Button size="lg" type="submit" disabled={pending} className="w-full md:w-auto">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Add Staff Member
    </Button>
  );
}

export default function StaffPage() {
  // This should be fetched from the database
  const [staffMembers, setStaffMembers] = useState<Staff[]>([]); 
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Staff | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(addStaffMember, initialState);
  const {toast} = useToast();

  const processedStateRef = useRef(initialState);

  // TODO: Fetch initial staff members from the database
  // useEffect(() => {
  //   fetchStaff().then(setStaffMembers);
  // }, []);

  useEffect(() => {
    if (state !== processedStateRef.current) {
      if (state.message) {
        if (state.errors) {
          toast({
            variant: 'destructive',
            title: 'Error adding staff',
            description: state.message,
          });
        } else if (state.data) {
          toast({
            title: 'Success!',
            description: state.message,
          });

          const newStaff: any = {
            id: String(new Date().getTime()),
            name: state.data.name,
            photoUrl: 'https://placehold.co/100x100.png',
            photoHint: 'professional portrait',
            role: state.data.role,
            status: 'Active',
            startDate: new Date(state.data.startDate),
            phone: state.data.phone,
            address: state.data.address,
            emergencyName: state.data.emergencyName,
            emergencyPhone: state.data.emergencyPhone,
            certifications: state.data.certifications || '',
            notes: state.data.notes,
            payType: state.data.payType,
            payRate: state.data.payRate,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          setStaffMembers(prev => [newStaff, ...prev]);
          formRef.current?.reset();
        }
      }
      processedStateRef.current = state;
    }
  }, [state, toast]);

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (editedData) {
      const {name, value} = e.target;
      const newValue = e.target.type === 'number' ? parseFloat(value) : value;
      setEditedData({...editedData, [name]: newValue});
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (editedData) {
      setEditedData({ ...editedData, [name]: value });
    }
  };

  const handleSaveChanges = () => {
    if (editedData) {
      setStaffMembers(prev =>
        prev.map(staff => (staff.id === editedData.id ? editedData : staff))
      );
      setSelectedStaff(editedData);
      setIsEditing(false);
      toast({title: 'Success!', description: 'Staff information updated.'});
    }
  };

  const handleDeactivateStaff = () => {
    if (selectedStaff) {
      const newStatus =
        selectedStaff.status === 'Active' ? 'Inactive' : 'Active';
      const updatedStaff = {...selectedStaff, status: newStatus};
      setStaffMembers(prev =>
        prev.map(staff =>
          staff.id === selectedStaff.id ? updatedStaff : staff
        )
      );
      setSelectedStaff(updatedStaff);
      toast({
        title: 'Success!',
        description: `Staff member has been marked as ${newStatus.toLowerCase()}.`,
      });
    }
  };

  const handleDeleteStaff = () => {
    if (selectedStaff) {
      setStaffMembers(prev => prev.filter(staff => staff.id !== selectedStaff.id));
      setSelectedStaff(null);
      setIsDeleteDialogOpen(false);
      toast({title: 'Success!', description: 'Staff record has been deleted.'});
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Staff Management
        </h1>
        <p className="text-muted-foreground">
          Manage staff schedules, qualifications, and profiles.
        </p>
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
              <CardDescription>
                A list of all staff members and their statuses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Certifications</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffMembers.length > 0 ? staffMembers.map(staff => (
                    <TableRow key={staff.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="hidden h-9 w-9 sm:flex">
                            <AvatarImage
                              src={staff.photoUrl ?? undefined}
                              alt={staff.name}
                              data-ai-hint={staff.photoHint ?? undefined}
                            />
                            <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {staff.name}
                        </div>
                      </TableCell>
                      <TableCell>{staff.role}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {staff.certifications?.split(',')[0] || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            staff.status === 'Active'
                              ? 'default'
                              : staff.status === 'On Leave'
                              ? 'secondary'
                              : 'outline'
                          }
                          className={cn({
                            'bg-accent text-accent-foreground':
                              staff.status === 'Active',
                          })}
                        >
                          {staff.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedStaff(staff)}
                        >
                          View
                        </Button>
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
              <CardDescription>
                Fill out the form to add a new staff member to the directory.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form ref={formRef} action={formAction} className="space-y-8">
                <div className="space-y-2">
                  <Label>Staff Profile Photo</Label>
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
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" placeholder="e.g., Jane Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select name="role" required>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map(option => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input id="start-date" name="start-date" type="date" required />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="e.g., (555) 123-4567"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    placeholder="e.g., 123 Main St, Anytown, USA 12345"
                    required
                  />
                </div>
                
                 <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">
                    Financial Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="pay-type">Pay Type</Label>
                      <Select name="pay-type" required>
                        <SelectTrigger id="pay-type">
                          <SelectValue placeholder="Select a pay type" />
                        </SelectTrigger>
                        <SelectContent>
                          {payTypeOptions.map(option => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pay-rate">Pay Rate</Label>
                      <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input id="pay-rate" name="pay-rate" type="number" step="0.01" placeholder="e.g., 5000 or 25.50" className="pl-8" required />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="emergency-name">Contact Full Name</Label>
                      <Input
                        id="emergency-name"
                        name="emergency-name"
                        placeholder="e.g., Carol Danvers"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergency-phone">Contact Phone</Label>
                      <Input
                        id="emergency-phone"
                        name="emergency-phone"
                        type="tel"
                        placeholder="e.g., (555) 111-2222"
                        required
                      />
                    </div>
                  </div>
                </div>
                 <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b pb-2">
                    Qualifications & Notes
                  </h3>
                   <div className="grid grid-cols-1 gap-6 pt-2">
                      <div className="space-y-2">
                          <Label htmlFor="certifications">Certifications</Label>
                          <Textarea id="certifications" name="certifications" placeholder="e.g., ECE License, First Aid, Food Safe" />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="notes">Additional Notes</Label>
                          <Textarea id="notes" name="notes" placeholder="e.g., Availability, special skills, etc." />
                      </div>
                  </div>
                </div>
                <SubmitButton />
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={!!selectedStaff}
        onOpenChange={isOpen => {
          if (!isOpen) {
            setSelectedStaff(null);
            setIsEditing(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
           {selectedStaff && (
            <>
              <DialogHeader>
                  <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4">
                      <Avatar className="h-24 w-24">
                          <AvatarImage src={isEditing ? editedData?.photoUrl ?? undefined : selectedStaff.photoUrl ?? undefined} alt={selectedStaff.name} data-ai-hint={isEditing ? editedData?.photoHint ?? undefined : selectedStaff.photoHint ?? undefined} />
                          <AvatarFallback>{selectedStaff.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1.5">
                          <DialogTitle>{isEditing ? 'Edit Staff Details' : selectedStaff.name}</DialogTitle>
                          <DialogDescription>
                              {isEditing ? `Update information for ${editedData?.name}.` : `Detailed information for ${selectedStaff.name}.`}
                          </DialogDescription>
                      </div>
                  </div>
              </DialogHeader>

              {isEditing && editedData ? (
                <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto pr-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Name</Label>
                      <Input
                        id="edit-name"
                        name="name"
                        value={editedData.name}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-role">Role</Label>
                      <Select
                        value={editedData.role}
                        onValueChange={(value) => handleSelectChange('role', value)}
                      >
                        <SelectTrigger id="edit-role">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roleOptions.map(option => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-startDate">Start Date</Label>
                      <Input
                        id="edit-startDate"
                        name="startDate"
                        type="date"
                        value={new Date(editedData.startDate).toISOString().split('T')[0]}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-phone">Phone</Label>
                      <Input
                        id="edit-phone"
                        name="phone"
                        value={editedData.phone}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-pay-type">Pay Type</Label>
                        <Select value={editedData.payType} onValueChange={(value) => handleSelectChange('payType', value)}>
                            <SelectTrigger id="edit-pay-type"><SelectValue placeholder="Select a type" /></SelectTrigger>
                            <SelectContent>{payTypeOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-payRate">Pay Rate</Label>
                        <Input id="edit-payRate" name="payRate" type="number" value={editedData.payRate} onChange={handleEditChange} />
                      </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="edit-address">Address</Label>
                    <Textarea
                      id="edit-address"
                      name="address"
                      value={editedData.address}
                      onChange={handleEditChange}
                    />
                  </div>
                  <Separator />
                  <h4 className="font-semibold text-base">Emergency Contact</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-emergencyName">Name</Label>
                      <Input
                        id="edit-emergencyName"
                        name="emergencyName"
                        value={editedData.emergencyName}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-emergencyPhone">Phone</Label>
                      <Input
                        id="edit-emergencyPhone"
                        name="emergencyPhone"
                        value={editedData.emergencyPhone}
                        onChange={handleEditChange}
                      />
                    </div>
                  </div>
                  <Separator />
                   <h4 className="font-semibold text-base">Qualifications & Notes</h4>
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
                </div>
              ) : (
                <div className="space-y-6 py-4 text-sm max-h-[60vh] overflow-y-auto pr-4">
                  <div>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="font-medium text-muted-foreground">Name</dt>
                        <dd className="mt-1 text-foreground">{selectedStaff.name}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="font-medium text-muted-foreground">Role</dt>
                        <dd className="mt-1 text-foreground">{selectedStaff.role}</dd>
                      </div>
                       <div className="sm:col-span-1">
                          <dt className="font-medium text-muted-foreground">Start Date</dt>
                          <dd className="mt-1 text-foreground">{new Date(selectedStaff.startDate).toLocaleDateString()}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="font-medium text-muted-foreground">Status</dt>
                        <dd className="mt-1 text-foreground">
                          <Badge
                            variant={
                              selectedStaff.status === 'Active'
                                ? 'default'
                                : selectedStaff.status === 'On Leave'
                                ? 'secondary'
                                : 'outline'
                            }
                             className={cn({'bg-accent text-accent-foreground': selectedStaff.status === 'Active'})}
                          >
                            {selectedStaff.status}
                          </Badge>
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <Separator />
                   <div>
                      <h4 className="font-semibold text-base mb-4">Contact & Financial Information</h4>
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                           <div className="sm:col-span-1">
                              <dt className="font-medium text-muted-foreground">Phone</dt>
                              <dd className="mt-1 text-foreground">{selectedStaff.phone}</dd>
                          </div>
                           <div className="sm:col-span-1">
                              <dt className="font-medium text-muted-foreground">Pay</dt>
                              <dd className="mt-1 text-foreground">{selectedStaff.payType === 'Monthly Salary' ? `$${selectedStaff.payRate.toLocaleString()}/month` : `$${selectedStaff.payRate.toFixed(2)}/hour`}</dd>
                          </div>
                          <div className="sm:col-span-2">
                              <dt className="font-medium text-muted-foreground">Address</dt>
                              <dd className="mt-1 text-foreground whitespace-pre-wrap">{selectedStaff.address}</dd>
                          </div>
                      </dl>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-base mb-4">Emergency Contact</h4>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="font-medium text-muted-foreground">Name</dt>
                        <dd className="mt-1 text-foreground">
                          {selectedStaff.emergencyName}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="font-medium text-muted-foreground">Phone</dt>
                        <dd className="mt-1 text-foreground">
                          {selectedStaff.emergencyPhone}
                        </dd>
                      </div>
                    </dl>
                  </div>
                   <Separator />
                   <div>
                      <h4 className="font-semibold text-base mb-4">Qualifications & Notes</h4>
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-1">
                           <div>
                              <dt className="font-medium text-muted-foreground">Certifications</dt>
                              <dd className="mt-1 text-foreground">{selectedStaff.certifications || 'N/A'}</dd>
                          </div>
                           <div>
                              <dt className="font-medium text-muted-foreground">Notes</dt>
                              <dd className="mt-1 text-foreground">{selectedStaff.notes || 'None'}</dd>
                          </div>
                      </dl>
                  </div>
                </div>
              )}
              <DialogFooter>
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setEditedData(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                  </>
                ) : (
                  <>
                    <div className="mr-auto">
                      <AlertDialog
                        open={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                      >
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete
                              this staff member's record.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteStaff}>
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    <Button variant="outline" onClick={() => setSelectedStaff(null)}>
                      Close
                    </Button>
                    <Button variant="outline" onClick={handleDeactivateStaff}>
                      {selectedStaff?.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(true);
                        setEditedData(selectedStaff);
                      }}
                    >
                      Edit
                    </Button>
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
