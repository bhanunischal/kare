
"use client";

import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MoreHorizontal, CheckCircle, XCircle, Archive, ArchiveRestore, Loader2, Plus, Settings, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { updateDaycareStatus, createDaycare } from "./actions";
import type { Daycare, DaycareStatus, User } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DaycareSettingsDialog } from "./daycare-settings-dialog";

type DaycareWithCountsAndUser = {
    id: string;
    name: string;
    status: DaycareStatus;
    plan: string;
    address: string | null;
    joinDate: string;
    childrenCount: number;
    staffCount: number;
    adminUser: User | null;
}

const createDaycareInitialState = { error: null };

function AddDaycareSubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Daycare
        </Button>
    )
}

export function DaycaresClient({ daycares: initialDaycares }: { daycares: (DaycareWithCountsAndUser & Daycare)[] }) {
  const [daycares, setDaycares] = useState<(DaycareWithCountsAndUser & Daycare)[]>(initialDaycares);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDaycare, setEditingDaycare] = useState<(DaycareWithCountsAndUser & Daycare) | null>(null);
  const { toast } = useToast();
  
  const [createState, createFormAction] = useActionState(createDaycare, createDaycareInitialState);

  // Update local state when server provides new data (after revalidation)
  useEffect(() => {
    setDaycares(initialDaycares);
     // If a daycare was being edited, find the updated version in the new data
    if (editingDaycare) {
      const updatedDaycare = initialDaycares.find(d => d.id === editingDaycare.id);
      if (updatedDaycare) {
        setEditingDaycare(updatedDaycare);
      } else {
        // The daycare was deleted or is no longer in the list, close the dialog.
        setEditingDaycare(null);
      }
    }
  }, [initialDaycares, editingDaycare]);
  
  // Handle feedback from create daycare action
  useEffect(() => {
    if (createState?.error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: createState.error,
        });
    } else if (createState?.error === null) {
        // success
        setIsAddDialogOpen(false);
        toast({
            title: "Daycare Created",
            description: "A new daycare has been added successfully.",
        });
    }
  }, [createState, toast]);

  const handleStatusChange = async (id: string, newStatus: DaycareStatus) => {
    const daycareName = daycares.find(dc => dc.id === id)?.name || "The daycare";
    const oldStatus = daycares.find(dc => dc.id === id)?.status;
    
    // Optimistic UI update
    setDaycares(currentDaycares => currentDaycares.map(dc => 
        dc.id === id ? { ...dc, status: newStatus } : dc
    ));

    const result = await updateDaycareStatus(id, newStatus);
    
    if (result.error) {
        // Revert UI on error
        setDaycares(currentDaycares => currentDaycares.map(dc => 
            dc.id === id ? { ...dc, status: oldStatus! } : dc
        ));
        toast({
            variant: "destructive",
            title: "Error Updating Status",
            description: result.error,
        });
    } else {
        let description = `${daycareName} has been set to ${newStatus}.`;
        if (newStatus === 'INACTIVE' && oldStatus === 'ACTIVE') {
            description = `${daycareName} has been deactivated.`;
        } else if (newStatus === 'ACTIVE' && (oldStatus === 'INACTIVE' || oldStatus === 'PENDING')) {
            description = `${daycareName} has been activated. The owner can now log in.`;
        } else if (newStatus === 'ARCHIVED') {
            description = `${daycareName} has been archived.`;
        } else if (newStatus === 'INACTIVE' && oldStatus === 'ARCHIVED') {
            description = `${daycareName} has been restored. You can now activate it.`;
        }

        toast({
            title: "Status Updated",
            description: description,
        });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Daycare Management</h1>
          <p className="text-muted-foreground">Manage all daycare centers on the platform.</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Daycare
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Daycare</DialogTitle>
                    <DialogDescription>
                        Create a new daycare center. An invitation can be sent to the owner later.
                    </DialogDescription>
                </DialogHeader>
                <form action={createFormAction}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Daycare Name</Label>
                            <Input id="name" name="name" placeholder="e.g., Happy Trails Daycare" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="plan">Subscription Plan</Label>
                            <Select name="plan" required>
                                <SelectTrigger id="plan">
                                    <SelectValue placeholder="Select a plan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Basic">Basic</SelectItem>
                                    <SelectItem value="Premium">Premium</SelectItem>
                                    <SelectItem value="Enterprise">Enterprise</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                        <AddDaycareSubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Daycares</CardTitle>
          <CardDescription>A list of all registered daycare centers.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="w-full overflow-x-auto">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Children</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {daycares.map((daycare) => (
                <TableRow key={daycare.id}>
                    <TableCell className="font-medium">{daycare.name}</TableCell>
                    <TableCell>
                    <Badge 
                        variant={
                            daycare.status === "ACTIVE" ? "default" :
                            daycare.status === "PENDING" ? "secondary" :
                            daycare.status === "INACTIVE" ? "destructive" :
                            "outline" // for ARCHIVED
                        }
                        className={cn(
                            daycare.status === 'ACTIVE' && 'bg-accent text-accent-foreground',
                            daycare.status === 'ARCHIVED' && 'border-dashed text-muted-foreground'
                        )}
                    >
                        {daycare.status}
                    </Badge>
                    </TableCell>
                    <TableCell>
                    <Badge variant="outline">{daycare.plan}</Badge>
                    </TableCell>
                    <TableCell>{daycare.address || 'N/A'}</TableCell>
                    <TableCell>{daycare.childrenCount}</TableCell>
                    <TableCell>{daycare.staffCount}</TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => setEditingDaycare(daycare)}>
                            <Settings className="mr-2 h-4 w-4" />
                            View & Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Manage Subscription
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {daycare.status === 'ACTIVE' && (
                                <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => handleStatusChange(daycare.id, 'INACTIVE')}
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Deactivate
                                </DropdownMenuItem>
                            )}
                            {(daycare.status === 'INACTIVE' || daycare.status === 'PENDING') && (
                                <DropdownMenuItem onClick={() => handleStatusChange(daycare.id, 'ACTIVE')}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Activate
                                </DropdownMenuItem>
                            )}
                            {daycare.status === 'INACTIVE' && (
                                <DropdownMenuItem onClick={() => handleStatusChange(daycare.id, 'ARCHIVED')}>
                                    <Archive className="mr-2 h-4 w-4" />
                                    Archive
                                </DropdownMenuItem>
                            )}
                            {daycare.status === 'ARCHIVED' && (
                                <DropdownMenuItem onClick={() => handleStatusChange(daycare.id, 'INACTIVE')}>
                                    <ArchiveRestore className="mr-2 h-4 w-4" />
                                    Restore
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
        </CardContent>
      </Card>
      
      {editingDaycare && (
        <DaycareSettingsDialog 
            key={editingDaycare.id}
            daycare={editingDaycare}
            adminUser={editingDaycare.adminUser}
            isOpen={!!editingDaycare}
            onOpenChange={() => setEditingDaycare(null)}
        />
      )}
    </div>
  );
}
