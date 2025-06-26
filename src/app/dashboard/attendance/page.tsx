import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

const attendanceRecords = [
    { id: "1", name: "Olivia Martin", checkIn: "8:30 AM", checkOut: "4:00 PM", status: "Present" },
    { id: "2", name: "Liam Garcia", checkIn: "9:00 AM", checkOut: "5:00 PM", status: "Present" },
    { id: "3", name: "Emma Rodriguez", checkIn: "8:45 AM", checkOut: null, status: "Present" },
    { id: "4", name: "Noah Hernandez", checkIn: null, checkOut: null, status: "Absent" },
    { id: "5", name: "Ava Lopez", checkIn: "9:15 AM", checkOut: "4:30 PM", status: "Present" },
    { id: "6", name: "James Wilson", checkIn: "8:00 AM", checkOut: null, status: "Present" },
];

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Attendance</h1>
        <p className="text-muted-foreground">Track daily check-ins and check-outs.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Attendance</CardTitle>
          <CardDescription>A real-time log of today's attendance records.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Child's Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.name}</TableCell>
                  <TableCell>
                    <Badge variant={record.status === 'Present' ? 'default' : 'secondary'} className={record.status === 'Present' ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'}>
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.checkIn || "N/A"}</TableCell>
                  <TableCell>{record.checkOut || "N/A"}</TableCell>
                  <TableCell>
                     <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
