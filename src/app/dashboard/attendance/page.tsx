
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
import { MoreHorizontal, LogIn, LogOut, CalendarOff, Plane, RefreshCcw, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import type { DateRange } from "react-day-picker";
import { format, differenceInDays } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import type { Child } from "@prisma/client";

type AttendanceStatus = "Present" | "Absent" | "On Leave" | "Pending";
type LeaveType = "Daily" | "Short-term" | "Long-term";

type AttendanceRecord = {
  id: string;
  name: string;
  checkIn: string | null;
  checkOut: string | null;
  status: AttendanceStatus;
  leaveReason?: string;
  leaveRange?: { from: Date; to: Date };
  leaveType?: LeaveType;
};

// This page should now be a server component that fetches children
// and passes them to a client component. For simplicity in this step,
// we will make this a client component that receives children as props.

export default function AttendancePage({ children }: { children: Child[] }) {
  const [records, setRecords] = useState<AttendanceRecord[]>(
    // Initialize attendance records based on the children fetched from the database
    children
      .filter(c => c.status === 'Active')
      .map(child => ({
        id: child.id,
        name: child.name,
        checkIn: null,
        checkOut: null,
        status: "Pending" as AttendanceStatus
      }))
  );
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<AttendanceRecord | null>(null);
  const [leaveReason, setLeaveReason] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { toast } = useToast();

  const handleUpdateRecord = (id: string, updates: Partial<AttendanceRecord>) => {
    setRecords(records.map(record => record.id === id ? { ...record, ...updates } : record));
  };

  const handleCheckIn = (id: string) => {
    const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    const childName = records.find(r => r.id === id)?.name;
    handleUpdateRecord(id, { status: "Present", checkIn: time, checkOut: null, leaveReason: undefined, leaveRange: undefined, leaveType: undefined });
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
    handleUpdateRecord(id, { status: "Absent", checkIn: null, checkOut: null, leaveReason: undefined, leaveRange: undefined, leaveType: undefined });
    toast({ variant: "default", title: "Marked Absent", description: `${childName} has been marked absent.` });
  };

  const handleResetStatus = (id: string) => {
    const childName = records.find(r => r.id === id)?.name;
    handleUpdateRecord(id, { status: "Pending", checkIn: null, checkOut: null, leaveReason: undefined, leaveRange: undefined, leaveType: undefined });
    toast({ title: "Status Reset", description: `The status for ${childName} has been reset.` });
  };

  const openLeaveDialog = (child: AttendanceRecord) => {
    setSelectedChild(child);
    setLeaveReason(child.leaveReason || "");
    setDateRange(child.leaveRange);
    setIsLeaveDialogOpen(true);
  };
  
  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    // Automatically close the calendar popover once a full range is selected.
    if (range?.from && range?.to) {
      setIsCalendarOpen(false);
    }
  };

  const handleSaveLeave = () => {
    if (selectedChild && dateRange?.from) {
      const from = dateRange.from;
      const to = dateRange.to || from;
      const days = differenceInDays(to, from) + 1;

      let leaveType: LeaveType;
      if (days > 21) {
        leaveType = "Long-term";
      } else if (days >= 7) {
        leaveType = "Short-term";
      } else {
        leaveType = "Daily";
      }

      handleUpdateRecord(selectedChild.id, {
        status: "On Leave",
        checkIn: null,
        checkOut: null,
        leaveReason,
        leaveRange: { from, to },
        leaveType,
      });

      toast({
        title: "Leave Saved",
        description: `${leaveType} leave has been recorded for ${selectedChild.name}.`,
      });
      setIsLeaveDialogOpen(false);
      setSelectedChild(null);
      setLeaveReason("");
      setDateRange(undefined);
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
      case "Pending":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusBadgeClass = (status: AttendanceStatus) => {
    switch (status) {
      case "Present":
        return "bg-accent text-accent-foreground";
      default:
        return "";
    }
  };

  const getStatusText = (record: AttendanceRecord) => {
    if (record.status === "On Leave") {
      return `On Leave${record.leaveType ? `: ${record.leaveType}` : ''}`;
    }
    return record.status;
  }

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
                        className={cn(getStatusBadgeClass(record.status), 'whitespace-nowrap')}
                      >
                        {getStatusText(record)}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.checkIn || "N/A"}</TableCell>
                    <TableCell>{record.checkOut || "N/A"}</TableCell>
                    <TableCell className="text-right space-x-2 whitespace-nowrap">
                       {(record.status !== 'Present') && (
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
              Select the date range and provide a reason for the leave. This will mark the child as "On Leave".
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label htmlFor="leave-dates">Leave Dates</Label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="leave-dates"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange && "text-muted-foreground"
                      )}
                      onClick={() => setIsCalendarOpen(true)}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={handleDateSelect}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            <div className="grid gap-2">
              <Label htmlFor="leave-reason">Leave Reason (Optional)</Label>
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
            <Button onClick={handleSaveLeave} disabled={!dateRange?.from}>Save Leave</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
