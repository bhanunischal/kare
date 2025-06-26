
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
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
import { MoreHorizontal, Mail, CheckCircle, CircleOff, FileText, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type InvoiceStatus = "Paid" | "Due" | "Overdue";

type Invoice = {
  id: string;
  childName: string;
  parent: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
  program: string;
};

const initialInvoices: Invoice[] = [
    { id: "INV001", childName: "Olivia Martin", parent: "The Martins", amount: 850.00, dueDate: "2024-07-01", status: "Paid", program: "Preschool (3 to 5 years)" },
    { id: "INV002", childName: "Liam Garcia", parent: "The Garcias", amount: 1200.00, dueDate: "2024-07-01", status: "Paid", program: "Toddler (1 to 3 years)" },
    { id: "INV003", childName: "Emma Rodriguez", parent: "The Rodriguezes", amount: 850.00, dueDate: "2024-08-01", status: "Due", program: "Preschool (3 to 5 years)" },
    { id: "INV004", childName: "Noah Hernandez", parent: "The Hernandezes", amount: 1500.00, dueDate: "2024-07-01", status: "Overdue", program: "Infant (0-12months)" },
    { id: "INV005", childName: "Ava Lopez", parent: "The Lopezes", amount: 850.00, dueDate: "2024-08-01", status: "Due", program: "Preschool (3 to 5 years)" },
];

const feeStructure = {
  'Infant (0-12months)': { 'Full time': 1500, 'Part time': 1000, 'Ad-hoc daily basis': 100 },
  'Toddler (1 to 3 years)': { 'Full time': 1200, 'Part time': 800, 'Ad-hoc daily basis': 85 },
  'Preschool (3 to 5 years)': { 'Full time': 850, 'Part time': 600, 'Ad-hoc daily basis': 70 },
  'Gradeschooler (5 to 12 years)': { 'Full time': 750, 'Part time': 500, 'Ad-hoc daily basis': 60 },
};

// Mock data representing enrolled children to simulate invoice generation
const activeChildren = [
    { id: '1', name: 'Olivia Martin', parent: 'The Martins', program: 'Preschool (3 to 5 years)', programType: 'Full time', status: 'Active' },
    { id: '2', name: 'Liam Garcia', parent: 'The Garcias', program: 'Toddler (1 to 3 years)', programType: 'Full time', status: 'Active' },
    { id: '3', name: 'Emma Rodriguez', parent: 'The Rodriguezes', program: 'Preschool (3 to 5 years)', programType: 'Full time', status: 'Active' },
    { id: '5', name: 'Ava Lopez', parent: 'The Lopezes', program: 'Preschool (3 to 5 years)', programType: 'Full time', status: 'Active' },
];

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const { toast } = useToast();

  const handleInvoiceAction = (id: string, action: "paid" | "unpaid" | "remind") => {
    const invoice = invoices.find(inv => inv.id === id);
    if (!invoice) return;

    if (action === "paid") {
      setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: "Paid" } : inv));
      toast({ title: "Invoice Marked Paid", description: `Invoice ${id} for ${invoice.childName} has been marked as paid.` });
    } else if (action === "unpaid") {
      setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: "Due" } : inv));
      toast({ title: "Invoice Status Updated", description: `Invoice ${id} for ${invoice.childName} has been marked as due.` });
    } else if (action === "remind") {
      toast({ title: "Reminder Sent", description: `A payment reminder for invoice ${id} has been sent to ${invoice.parent}.` });
    }
  };

  const handleGenerateInvoices = () => {
    const today = new Date();
    const currentMonth = today.toLocaleString('default', { month: 'long' });
    const currentYear = today.getFullYear();
    const dueDate = new Date(currentYear, today.getMonth() + 1, 1).toISOString().split('T')[0];

    let newInvoicesGenerated = 0;
    const newInvoices: Invoice[] = [];

    activeChildren.forEach(child => {
        const alreadyHasInvoice = invoices.some(inv => 
            inv.childName === child.name && 
            new Date(inv.dueDate).getMonth() === today.getMonth() + 1 &&
            new Date(inv.dueDate).getFullYear() === currentYear
        );

        if (!alreadyHasInvoice) {
            const programKey = child.program as keyof typeof feeStructure;
            const programTypeKey = child.programType as keyof typeof feeStructure[typeof programKey];
            const amount = feeStructure[programKey]?.[programTypeKey] || 0;

            if (amount > 0) {
                newInvoices.push({
                    id: `INV${(Math.random() * 9000 + 1000).toFixed(0)}`,
                    childName: child.name,
                    parent: child.parent,
                    amount,
                    dueDate,
                    status: "Due",
                    program: child.program
                });
                newInvoicesGenerated++;
            }
        }
    });

    if (newInvoicesGenerated > 0) {
        setInvoices(prev => [...newInvoices, ...prev]);
        toast({
            title: "Invoices Generated",
            description: `${newInvoicesGenerated} new invoices for ${currentMonth} ${currentYear} have been created.`
        });
    } else {
        toast({
            title: "No New Invoices",
            description: `All active children already have invoices for ${currentMonth} ${currentYear}.`
        });
    }
  };

  const getStatusBadgeVariant = (status: InvoiceStatus) => {
    switch (status) {
        case "Paid": return "default";
        case "Due": return "secondary";
        case "Overdue": return "destructive";
        default: return "outline";
    }
  };
  
  const getStatusBadgeClass = (status: InvoiceStatus) => {
    return status === 'Paid' ? 'bg-accent text-accent-foreground' : '';
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Billing & Payments</h1>
        <p className="text-muted-foreground">Manage invoices and track payments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Fee Structure</CardTitle>
                    <CardDescription>Monthly fees per child based on program.</CardDescription>
                </CardHeader>
                <CardContent>
                    <dl className="space-y-4">
                    {Object.entries(feeStructure).map(([program, types]) => (
                        <div key={program}>
                            <dt className="font-semibold text-sm">{program}</dt>
                            <dd className="pl-4 mt-1">
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                    {Object.entries(types).map(([type, fee]) => (
                                        <li key={type}>
                                            <span>{type}: </span>
                                            <span className="font-medium text-foreground">${fee.toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </dd>
                        </div>
                    ))}
                    </dl>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-2">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Invoices</CardTitle>
                    <CardDescription>A list of all recent invoices.</CardDescription>
                </div>
                <Button onClick={handleGenerateInvoices}>
                    <Bot className="mr-2 h-4 w-4" />
                    Generate Invoices
                </Button>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Child</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {invoices.sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()).map((invoice) => (
                        <TableRow key={invoice.id}>
                        <TableCell className="font-medium">
                            <div>{invoice.childName}</div>
                            <div className="text-xs text-muted-foreground">{invoice.parent}</div>
                        </TableCell>
                        <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                        <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                            <Badge
                                variant={getStatusBadgeVariant(invoice.status)}
                                className={cn(getStatusBadgeClass(invoice.status))}
                            >
                            {invoice.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
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
                                <DropdownMenuItem>
                                    <FileText className="mr-2 h-4 w-4" />
                                    View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleInvoiceAction(invoice.id, 'paid')}
                                    disabled={invoice.status === 'Paid'}
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Mark as Paid
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleInvoiceAction(invoice.id, 'unpaid')}
                                    disabled={invoice.status !== 'Paid'}
                                >
                                    <CircleOff className="mr-2 h-4 w-4" />
                                    Mark as Unpaid
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleInvoiceAction(invoice.id, 'remind')}>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Send Reminder
                                </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
