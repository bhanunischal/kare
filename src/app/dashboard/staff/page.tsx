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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const staffMembers = [
    { id: "1", name: "Jane Doe", role: "Lead ECE", certifications: "ECE License, First Aid", status: "Active" },
    { id: "2", name: "John Smith", role: "Assistant", certifications: "First Aid", status: "Active" },
    { id: "3", name: "Emily White", role: "ECE-IT", certifications: "ECE License", status: "Active" },
    { id: "4", name: "Michael Brown", role: "Support Staff", certifications: "Background Check", status: "On Leave" },
    { id: "5", name: "Sarah Green", role: "Lead ECE", certifications: "ECE License, First Aid", status: "Active" },
];

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Staff Management</h1>
        <p className="text-muted-foreground">Manage staff schedules, qualifications, and profiles.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Directory</CardTitle>
          <CardDescription>A list of all staff members and their statuses.</CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Certifications</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffMembers.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                            <Avatar className="hidden h-9 w-9 sm:flex">
                                <AvatarImage src={`https://placehold.co/100x100.png`} alt="Avatar" data-ai-hint="person face" />
                                <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {staff.name}
                        </div>
                    </TableCell>
                    <TableCell>{staff.role}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{staff.certifications.split(',')[0]}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={staff.status === 'Active' ? 'default' : 'secondary'} className={staff.status === 'Active' ? 'bg-accent text-accent-foreground' : ''}>
                        {staff.status}
                      </Badge>
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
