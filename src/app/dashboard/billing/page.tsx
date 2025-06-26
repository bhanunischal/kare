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

const invoices = [
    { id: "INV001", parent: "The Martins", amount: "$850.00", dueDate: "2024-11-01", status: "Paid" },
    { id: "INV002", parent: "The Garcias", amount: "$1200.00", dueDate: "2024-11-01", status: "Paid" },
    { id: "INV003", parent: "The Rodriguezes", amount: "$850.00", dueDate: "2024-11-01", status: "Due" },
    { id: "INV004", parent: "The Hernandezes", amount: "$1500.00", dueDate: "2024-10-01", status: "Overdue" },
    { id: "INV005", parent: "The Lopezes", amount: "$850.00", dueDate: "2024-11-01", status: "Paid" },
];

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Billing & Payments</h1>
        <p className="text-muted-foreground">Manage invoices and track payments.</p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>A list of all recent invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Parent/Family</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.parent}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>{invoice.dueDate}</TableCell>
                  <TableCell>
                    <Badge variant={
                        invoice.status === 'Paid' ? 'default' : 
                        invoice.status === 'Due' ? 'secondary' : 'destructive'
                    } className={
                        invoice.status === 'Paid' ? 'bg-accent text-accent-foreground' : ''
                    }>
                      {invoice.status}
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
