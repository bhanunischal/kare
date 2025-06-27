
"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, CheckCircle, XCircle } from "lucide-react";
import { allDaycares, Daycare } from "./data";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function AdminDaycaresPage() {
  const [daycares, setDaycares] = useState<Daycare[]>(allDaycares);
  const { toast } = useToast();

  const handleStatusChange = (id: string, newStatus: "Active" | "Inactive") => {
    const daycareName = daycares.find(dc => dc.id === id)?.name || "The daycare";
    setDaycares(daycares.map(dc => 
        dc.id === id ? { ...dc, status: newStatus } : dc
    ));
    toast({
        title: "Status Updated",
        description: `${daycareName} has been ${newStatus.toLowerCase()}.`,
    });
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Daycare Management</h1>
                <p className="text-muted-foreground">Manage all daycare centers on the platform.</p>
            </div>
            <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Daycare
            </Button>
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
                  <TableHead>Location</TableHead>
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
                        variant={daycare.status === "Active" ? "default" : daycare.status === "Pending" ? "secondary" : "destructive"}
                        className={cn(daycare.status === 'Active' && 'bg-accent text-accent-foreground')}
                      >
                        {daycare.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{daycare.plan}</Badge>
                    </TableCell>
                    <TableCell>{daycare.location}</TableCell>
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
                           <DropdownMenuItem>View Details</DropdownMenuItem>
                           <DropdownMenuItem>Manage Subscription</DropdownMenuItem>
                           <DropdownMenuSeparator />
                           {daycare.status === 'Active' ? (
                                <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => handleStatusChange(daycare.id, 'Inactive')}
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Deactivate
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem onClick={() => handleStatusChange(daycare.id, 'Active')}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Activate
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
    </div>
  );
}
