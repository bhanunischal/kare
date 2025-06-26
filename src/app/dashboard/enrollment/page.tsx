import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileUp } from "lucide-react";

const enrolledChildren = [
  { id: '1', name: 'Olivia Martin', age: 4, program: 'Preschool', status: 'Active' },
  { id: '2', name: 'Liam Garcia', age: 3, program: 'Toddler', status: 'Active' },
  { id: '3', name: 'Emma Rodriguez', age: 5, program: 'Pre-K', status: 'Active' },
  { id: '4', name: 'Noah Hernandez', age: 2, program: 'Toddler', status: 'Waitlisted' },
  { id: '5', name: 'Ava Lopez', age: 4, program: 'Preschool', status: 'Active' },
];

export default function EnrollmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Child Enrollment</h1>
        <p className="text-muted-foreground">Manage child registrations and documentation.</p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Enrolled Children</TabsTrigger>
          <TabsTrigger value="new">Add New Child</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Children</CardTitle>
              <CardDescription>A list of all children currently enrolled or on the waitlist.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrolledChildren.map((child) => (
                    <TableRow key={child.id}>
                      <TableCell className="font-medium">{child.name}</TableCell>
                      <TableCell>{child.age}</TableCell>
                      <TableCell>{child.program}</TableCell>
                      <TableCell>
                        <Badge variant={child.status === 'Active' ? 'default' : 'secondary'} className={child.status === 'Active' ? 'bg-accent text-accent-foreground' : ''}>
                          {child.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
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
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="child-name">Child's Full Name</Label>
                  <Input id="child-name" placeholder="e.g., Jane Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="parent-name">Parent/Guardian Name</Label>
                  <Input id="parent-name" placeholder="e.g., John Smith" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="parent-email">Parent/Guardian Email</Label>
                  <Input id="parent-email" type="email" placeholder="e.g., parent@example.com" />
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
                    <Button variant="outline" size="sm" className="mt-4">
                        Upload Files
                    </Button>
                  </CardContent>
                </Card>
               </div>
              <Button>Submit Registration</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
