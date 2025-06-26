
'use client';

import { useEffect, useActionState, useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { format } from "date-fns";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { addExpense, type ExpenseFormData } from './actions';
import { Loader2, DollarSign } from 'lucide-react';
import { initialStaffMembers, type StaffMember } from '../staff/page';

type ExpenseCategory = 'Supplies' | 'Utilities' | 'Rent' | 'Salaries' | 'Food' | 'Maintenance' | 'Other';
const expenseCategories: ExpenseCategory[] = ['Supplies', 'Utilities', 'Rent', 'Salaries', 'Food', 'Maintenance', 'Other'];

type Expense = {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  vendor?: string;
};

const initialExpenses: Expense[] = [
    { id: '1', date: '2024-07-25', category: 'Supplies', description: 'Art supplies for craft time', amount: 150.75, vendor: 'Arts & Crafts Co.' },
    { id: '2', date: '2024-07-24', category: 'Food', description: 'Weekly groceries', amount: 320.50, vendor: 'Local Grocer' },
    { id: '3', date: '2024-07-22', category: 'Maintenance', description: 'Plumbing repair in kitchen', amount: 250.00, vendor: 'QuickFix Plumbers' },
    { id: '4', date: '2024-07-20', category: 'Utilities', description: 'Electricity Bill - July', amount: 180.25, vendor: 'BC Hydro' },
    { id: '5', date: '2024-07-15', category: 'Salaries', description: 'Bi-weekly payroll', amount: 8500.00, vendor: 'Payroll System' },
    { id: '6', date: '2024-07-10', category: 'Supplies', description: 'Cleaning supplies', amount: 75.00, vendor: 'Clean Co.' },
];

const initialState: { message: string | null; errors: any; data: ExpenseFormData | null; } = {
  message: null,
  errors: null,
  data: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Add Expense
    </Button>
  );
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(addExpense, initialState);
  const { toast } = useToast();
  
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | ''>('');
  const [amount, setAmount] = useState<string | number>('');
  const [description, setDescription] = useState('');
  const [staffList] = useState<StaffMember[]>(initialStaffMembers.filter(s => s.status === 'Active'));

  const processedStateRef = useRef(initialState);

  useEffect(() => {
    if (state !== processedStateRef.current) {
        if (state.message) {
            if (state.errors) {
                toast({ variant: 'destructive', title: 'Error adding expense', description: state.message });
            } else if (state.data) {
                toast({ title: 'Success!', description: state.message });
                const newExpense: Expense = {
                    id: String(new Date().getTime()),
                    date: state.data.date,
                    category: state.data.category as ExpenseCategory,
                    description: state.data.description,
                    amount: state.data.amount,
                    vendor: state.data.vendor,
                };
                setExpenses(prev => [newExpense, ...prev]);
                formRef.current?.reset();
                setSelectedCategory('');
                setAmount('');
                setDescription('');
            }
        }
        processedStateRef.current = state;
    }
  }, [state, toast]);
  
  const handleCategoryChange = (value: string) => {
    const category = value as ExpenseCategory;
    setSelectedCategory(category);
    setAmount('');
    setDescription('');
  };

  const handleStaffChange = (staffName: string) => {
    const staff = staffList.find(s => s.name === staffName);
    if (staff) {
      setAmount(staff.payRate.toFixed(2));
      if (staff.payType === 'Monthly Salary') {
        setDescription(`Monthly salary for ${staff.name}`);
      } else {
        setDescription(`Payment for ${staff.name}. Enter total amount.`);
      }
    }
  };
  
  const expenseReportData = expenseCategories.map(category => {
      const total = expenses
          .filter(expense => expense.category === category)
          .reduce((acc, curr) => acc + curr.amount, 0);
      return { name: category, total: total };
  }).filter(item => item.total > 0);
  
  const chartConfig = {
    total: {
      label: "Total",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Expense Management</h1>
        <p className="text-muted-foreground">Track expenses and view financial reports.</p>
      </div>

      <Tabs defaultValue="expenses">
        <TabsList>
          <TabsTrigger value="expenses">All Expenses</TabsTrigger>
          <TabsTrigger value="add">Add Expense</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Expense History</CardTitle>
              <CardDescription>A list of all recorded expenses.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{format(new Date(expense.date.replace(/-/g, '/')), 'MMM d, yyyy')}</TableCell>
                      <TableCell><Badge variant="outline">{expense.category}</Badge></TableCell>
                      <TableCell className="font-medium">{expense.description}</TableCell>
                      <TableCell>{expense.vendor || 'N/A'}</TableCell>
                      <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Expense</CardTitle>
              <CardDescription>Fill out the form below to record a new expense.</CardDescription>
            </CardHeader>
            <CardContent>
              <form ref={formRef} action={formAction} className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date of Expense</Label>
                    <Input id="date" name="date" type="date" required />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="amount" 
                          name="amount" 
                          type="number" 
                          step="0.01" 
                          placeholder="0.00" 
                          className="pl-8" 
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required 
                        />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select name="category" onValueChange={handleCategoryChange} required>
                            <SelectTrigger id="category">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {expenseCategories.map(option => (
                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="vendor">{selectedCategory === 'Salaries' ? 'Staff Member' : 'Vendor (Optional)'}</Label>
                        {selectedCategory === 'Salaries' ? (
                            <Select name="vendor" onValueChange={handleStaffChange}>
                                <SelectTrigger id="staff">
                                    <SelectValue placeholder="Select a staff member" />
                                </SelectTrigger>
                                <SelectContent>
                                    {staffList.map(staff => (
                                        <SelectItem key={staff.id} value={staff.name}>{staff.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <Input id="vendor" name="vendor" placeholder="e.g., Staples" />
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    placeholder="e.g., Purchase of new art supplies" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required 
                  />
                </div>
                
                <SubmitButton />
              </form>
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Expense Reports</CardTitle>
              <CardDescription>A visual summary of expenses by category for the current data.</CardDescription>
            </CardHeader>
            <CardContent>
                {expenseReportData.length > 0 ? (
                    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                        <BarChart accessibilityLayer data={expenseReportData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="name"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                            />
                            <YAxis
                                tickFormatter={(value) => `$${value}`}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar dataKey="total" fill="var(--color-total)" radius={4} />
                        </BarChart>
                    </ChartContainer>
                ) : (
                    <div className="flex items-center justify-center h-48">
                        <p className="text-muted-foreground">No expense data to display.</p>
                    </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
