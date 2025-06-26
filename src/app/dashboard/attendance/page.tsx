
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, LogIn, LogOut, CalendarOff, Plane, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

type AttendanceStatus = "Present" | "Absent" | "On Leave";

type AttendanceRecord = {
  id: string;
  name: string;
  checkIn: string | null;
  checkOut: string | null;
  status: AttendanceStatus;
  leaveReason?: string;
};

const initialAttendanceRecords: AttendanceRecord[] = [
    { id: "1", name: "Olivia Martin", checkIn: "8:30 AM", checkOut: "4:00 PM", status: "Present" },
    { id: "2", name: "Liam Garcia", checkIn: "9:00 AM", checkOut: null, status: "Present" },
    { id: "3", name: "Emma Rodriguez", checkIn: null, checkOut: null, status: "Absent" },
    { id: "4", name: "Noah Hernandez", checkIn: null, checkOut: null, status: "On Leave", leaveReason: "Family vacation." },
    { id: "5", name: "Ava Lopez", checkIn: "9:15 AM", checkOut: "4:30 PM", status: "Present" },
    { id: "6", name: "James Wilson", checkIn: null, checkOut: null, status: "Absent" },
];

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>(initialAttendanceRecords);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<AttendanceRecord | null>(null);
  const [leaveReason, setLeaveReason] = useState("");
  const { toast } = useToast();

  const handleUpdateRecord = (id: string, updates: Partial<AttendanceRecord>) => {
    setRecords(records.map(record => record.id === id ? { ...record, ...updates } : record));
  };

  const handleCheckIn = (id: string) => {
    const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const childName = records.find(r => r.id === id)?.name;
    handleUpdateRecord(id, { status: "Present", checkIn: time, checkOut: null, leaveReason: undefined });
    toast({ title: "Checked In", description: `${childName} has been checked in.` });
  };

  const handleCheckOut = (id: string) => {
    const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const childName = records.find(r => r.id === id)?.name;
    handleUpdateRecord(id, { checkOut: time });
    toast({ title: "Checked Out", description: `${childName} has been checked out.` });
  };

  const handleMarkAbsent = (id: string) => {
    const childName = records.find(r => r.id === id)?.name;
    handleUpdateRecord(id, { status: "Absent", checkIn: null, checkOut: null, leaveReason: undefined });
    toast({ variant: "default", title: "Marked Absent", description: `${childName} has been marked absent.` });
  };

  const handleResetStatus = (id: string) => {
    const childName = records.find(r => r.id === id)?.name;
    handleUpdateRecord(id, { status: "Absent", checkIn: null, checkOut: null, leaveReason: undefined });
    toast({ title: "Status Reset", description: `The status for ${childName} has been reset.` });
  };

  const openLeaveDialog = (child: AttendanceRecord) => {
    setSelectedChild(child);
    setLeaveReason(child.leaveReason || "");
    setIsLeaveDialogOpen(true);
  };

  const handleSaveLeave = () => {
    if (selectedChild) {
      handleUpdateRecord(selectedChild.id, { status: "On Leave", checkIn: null, checkOut: null, leaveReason: leaveReason });
      toast({ title: "Leave Added", description: `Leave has been recorded for ${selectedChild.name}.` });
      setIsLeaveDialogOpen(false);
      setSelectedChild(null);
      setLeaveReason("");
    }
  };
  
  const getStatusBadgeVariant = (status: AttendanceStatus): "default" | "destructive" | "secondary" | "outline" => {
    switch (status) {
      case "Present":
        return "default";
      case "Absent":
        return "destructive";
      case "On Leave":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusBadgeClass = (status: AttendanceStatus) => {
    switch (status) {
      case "Present":
        return "bg-accent text-accent-foreground";
      default:
        return ""; // Use default variant colors
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Attendance</h1>
        <p className="text-muted-foreground">Track daily check-ins, check-outs, and leaves.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Attendance</CardTitle>
          <CardDescription>A real-time log of today's attendance records. Update status using the action buttons.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px] min-w-[150px]">Child's Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.name}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusBadgeVariant(record.status)}
                        className={cn(getStatusBadgeClass(record.status))}
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.checkIn || "N/A"}</TableCell>
                    <TableCell>{record.checkOut || "N/A"}</TableCell>
                    <TableCell className="text-right space-x-2 whitespace-nowrap">
                       {(record.status === 'Absent' || record.status === 'On Leave') && (
                          <Button size="sm" onClick={() => handleCheckIn(record.id)}>
                            <LogIn className="mr-2 h-4 w-4" /> Check In
                          </Button>
                        )}
                        {record.status === 'Present' && !record.checkOut && (
                          <Button size="sm" variant="outline" onClick={() => handleCheckOut(record.id)}>
                             <LogOut className="mr-2 h-4 w-4" /> Check Out
                          </Button>
                        )}
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
                           <DropdownMenuItem onClick={() => handleMarkAbsent(record.id)} disabled={record.status === 'Absent'}>
                              <CalendarOff className="mr-2 h-4 w-4" /> Mark Absent
                           </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => openLeaveDialog(record)}>
                              <Plane className="mr-2 h-4 w-4" /> Add/Edit Leave
                           </DropdownMenuItem>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem onClick={() => handleResetStatus(record.id)}>
                              <RefreshCcw className="mr-2 h-4 w-4" /> Reset Status
                           </DropdownMenuItem>
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
      
      <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add/Edit Leave for {selectedChild?.name}</DialogTitle>
            <DialogDescription>
              Provide a reason for the leave. This will mark the child as "On Leave" and clear any check-in data for the day.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="leave-reason">Leave Reason</Label>
              <Textarea
                id="leave-reason"
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                placeholder="e.g., Family vacation, sick leave, etc."
                className="min-h-24"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLeaveDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveLeave}>Save Leave</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
