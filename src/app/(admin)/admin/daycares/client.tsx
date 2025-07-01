
"use client";

import { useState } from "react";
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
import { MoreHorizontal, CheckCircle, XCircle, Archive, ArchiveRestore } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { updateDaycareStatus } from "./actions";
import type { DaycareStatus } from "@prisma/client";

type DaycareWithCounts = {
    id: string;
    name: string;
    status: DaycareStatus;
    plan: string;
    location: string | null;
    joinDate: string;
    childrenCount: number;
    staffCount: number;
}

export function DaycaresClient({ daycares: initialDaycares }: { daycares: DaycareWithCounts[] }) {
  const [daycares, setDaycares] = useState<DaycareWithCounts[]>(initialDaycares);
  const { toast } = useToast();

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
                <TableCell>{daycare.location || 'N/A'}</TableCell>
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
  );
}
