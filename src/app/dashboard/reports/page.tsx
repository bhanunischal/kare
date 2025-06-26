
"use client";

import { useState, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Pie, PieChart, Cell, Legend, Tooltip } from "recharts";
import { format, subDays, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Download } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Mock Data - In a real app, this would come from an API
const allChildren = [
    { id: '1', name: 'Olivia Martin', program: 'Preschool (3 to 5 years)', status: 'Active', startDate: '2023-09-01' },
    { id: '2', name: 'Liam Garcia', program: 'Toddler (1 to 3 years)', status: 'Active', startDate: '2023-09-01' },
    { id: '3', name: 'Emma Rodriguez', program: 'Preschool (3 to 5 years)', status: 'Waitlisted', startDate: '2024-08-01' },
    { id: '4', name: 'Noah Hernandez', program: 'Toddler (1 to 3 years)', status: 'Active', startDate: '2024-02-01' },
    { id: '5', name: 'Ava Lopez', program: 'Preschool (3 to 5 years)', status: 'Inactive', startDate: '2022-12-01' },
    { id: '6', name: 'James Wilson', program: 'Gradeschooler (5 to 12 years)', status: 'Active', startDate: '2022-09-01' },
];

const allAttendance = Array.from({ length: 30 }).map((_, i) => {
    const date = subDays(new Date(), i);
    return {
        date: format(date, "yyyy-MM-dd"),
        present: Math.floor(Math.random() * (72 - 60 + 1)) + 60,
        absent: Math.floor(Math.random() * 5),
    };
});

const allInvoices = [
    { id: "INV001", childName: "Olivia Martin", amount: 850.00, dueDate: "2024-07-01", status: "Paid" },
    { id: "INV002", childName: "Liam Garcia", amount: 1200.00, dueDate: "2024-07-01", status: "Paid" },
    { id: "INV003", childName: "Emma Rodriguez", amount: 850.00, dueDate: "2024-08-01", status: "Due" },
    { id: "INV004", childName: "Noah Hernandez", amount: 1500.00, dueDate: "2024-07-01", status: "Overdue" },
    { id: "INV005", childName: "Ava Lopez", amount: 850.00, dueDate: "2024-08-01", status: "Due" },
];

const allExpenses = [
    { id: '1', date: '2024-07-25', category: 'Supplies', amount: 150.75 },
    { id: '2', date: '2024-07-24', category: 'Food', amount: 320.50 },
    { id: '3', date: '2024-06-22', category: 'Maintenance', amount: 250.00 },
    { id: '4', date: '2024-06-20', category: 'Utilities', amount: 180.25 },
    { id: '5', date: '2024-07-15', category: 'Salaries', amount: 8500.00 },
    { id: '6', date: '2024-07-10', category: 'Supplies', amount: 75.00 },
];

const programOptions = ['All', 'Infant (0-12months)', 'Toddler (1 to 3 years)', 'Preschool (3 to 5 years)', 'Gradeschooler (5 to 12 years)'];
const statusOptions = ['All', 'Active', 'Waitlisted', 'Inactive'];
const invoiceStatusOptions = ['All', 'Paid', 'Due', 'Overdue'];
const expenseCategoryOptions = ['All', 'Supplies', 'Utilities', 'Rent', 'Salaries', 'Food', 'Maintenance', 'Other'];

const PIE_CHART_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"];

const chartConfig = {
    count: { label: "Count", color: "hsl(var(--chart-1))" },
    amount: { label: "Amount", color: "hsl(var(--chart-1))" },
    present: { label: "Present", color: "hsl(var(--chart-2))" },
};

export default function ReportsPage() {
    const today = new Date();
    const defaultDateRange = { from: startOfMonth(today), to: endOfMonth(today) };

    const [enrollmentProgram, setEnrollmentProgram] = useState('All');
    const [enrollmentStatus, setEnrollmentStatus] = useState('All');

    const [attendanceDateRange, setAttendanceDateRange] = useState<DateRange | undefined>(defaultDateRange);
    const [isAttendanceCalendarOpen, setIsAttendanceCalendarOpen] = useState(false);

    const [billingStatus, setBillingStatus] = useState('All');
    const [billingDateRange, setBillingDateRange] = useState<DateRange | undefined>(defaultDateRange);
    const [isBillingCalendarOpen, setIsBillingCalendarOpen] = useState(false);

    const [expenseCategory, setExpenseCategory] = useState('All');
    const [expenseDateRange, setExpenseDateRange] = useState<DateRange | undefined>(defaultDateRange);
    const [isExpenseCalendarOpen, setIsExpenseCalendarOpen] = useState(false);

    const filteredChildren = useMemo(() => {
        return allChildren.filter(child =>
            (enrollmentProgram === 'All' || child.program === enrollmentProgram) &&
            (enrollmentStatus === 'All' || child.status === enrollmentStatus)
        );
    }, [enrollmentProgram, enrollmentStatus]);

    const enrollmentChartData = useMemo(() => {
        const counts = filteredChildren.reduce((acc, child) => {
            acc[child.program] = (acc[child.program] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(counts).map(([name, count]) => ({ name, count }));
    }, [filteredChildren]);

    const filteredAttendance = useMemo(() => {
        if (!attendanceDateRange?.from || !attendanceDateRange?.to) return allAttendance;
        return allAttendance.filter(item => isWithinInterval(new Date(item.date), { start: attendanceDateRange.from!, end: attendanceDateRange.to! }));
    }, [attendanceDateRange]);

    const filteredInvoices = useMemo(() => {
        return allInvoices.filter(invoice =>
            (billingStatus === 'All' || invoice.status === billingStatus) &&
            (billingDateRange?.from && billingDateRange?.to ? isWithinInterval(new Date(invoice.dueDate.replace(/-/g, '/')), { start: billingDateRange.from, end: billingDateRange.to }) : true)
        );
    }, [billingStatus, billingDateRange]);

    const filteredExpenses = useMemo(() => {
        return allExpenses.filter(expense =>
            (expenseCategory === 'All' || expense.category === expenseCategory) &&
            (expenseDateRange?.from && expenseDateRange?.to ? isWithinInterval(new Date(expense.date.replace(/-/g, '/')), { start: expenseDateRange.from, end: expenseDateRange.to }) : true)
        );
    }, [expenseCategory, expenseDateRange]);

    const expenseChartData = useMemo(() => {
        const categoryTotals = filteredExpenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
    }, [filteredExpenses]);

    const renderDateRangePicker = (
        dateRange: DateRange | undefined,
        setDateRange: (range: DateRange | undefined) => void,
        isOpen: boolean,
        setIsOpen: (open: boolean) => void
    ) => {
        const handleSelect = (range: DateRange | undefined) => {
            setDateRange(range);
            if (range?.from && range?.to) {
                setIsOpen(false);
            }
        }
        
        return (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn("w-full md:w-[280px] justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                            dateRange.to ? (
                                <>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</>
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
                        onSelect={handleSelect}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        )
    };
    
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">Reports & Analytics</h1>
                    <p className="text-muted-foreground">Analyze trends and export data across all modules.</p>
                </div>
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export All
                </Button>
            </div>

            <Tabs defaultValue="enrollment">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                    <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
                    <TabsTrigger value="attendance">Attendance</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                    <TabsTrigger value="expenses">Expenses</TabsTrigger>
                </TabsList>
                
                <TabsContent value="enrollment">
                    <Card>
                        <CardHeader>
                            <CardTitle>Enrollment Report</CardTitle>
                            <CardDescription>Breakdown of children by program and status.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <Select value={enrollmentProgram} onValueChange={setEnrollmentProgram}>
                                    <SelectTrigger className="w-full md:w-[220px]"><SelectValue placeholder="Select Program" /></SelectTrigger>
                                    <SelectContent>{programOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                                </Select>
                                <Select value={enrollmentStatus} onValueChange={setEnrollmentStatus}>
                                    <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Select Status" /></SelectTrigger>
                                    <SelectContent>{statusOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <Card>
                                <CardHeader><CardTitle className="text-lg">Enrollment by Program</CardTitle></CardHeader>
                                <CardContent>
                                    <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                                        <BarChart accessibilityLayer data={enrollmentChartData}>
                                            <CartesianGrid vertical={false} />
                                            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                                            <YAxis allowDecimals={false} />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                                        </BarChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="attendance">
                    <Card>
                        <CardHeader>
                            <CardTitle>Attendance Report</CardTitle>
                            <CardDescription>Daily attendance trends over time.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                {renderDateRangePicker(attendanceDateRange, setAttendanceDateRange, isAttendanceCalendarOpen, setIsAttendanceCalendarOpen)}
                            </div>
                            <Card>
                                <CardHeader><CardTitle className="text-lg">Daily Attendance</CardTitle></CardHeader>
                                <CardContent>
                                    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                                        <LineChart data={filteredAttendance.slice().reverse()} margin={{ left: 12, right: 12 }}>
                                            <CartesianGrid vertical={false} />
                                            <XAxis dataKey="date" tickFormatter={(value) => format(new Date(value), 'MMM d')} />
                                            <YAxis />
                                            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                                            <Line type="monotone" dataKey="present" stroke="var(--color-present)" strokeWidth={2} dot={false} />
                                        </LineChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="billing">
                    <Card>
                        <CardHeader>
                            <CardTitle>Billing Report</CardTitle>
                            <CardDescription>Summary of invoices by status and date.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                {renderDateRangePicker(billingDateRange, setBillingDateRange, isBillingCalendarOpen, setIsBillingCalendarOpen)}
                                <Select value={billingStatus} onValueChange={setBillingStatus}>
                                    <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Select Status" /></SelectTrigger>
                                    <SelectContent>{invoiceStatusOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Invoice ID</TableHead>
                                        <TableHead>Child Name</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredInvoices.map(invoice => (
                                        <TableRow key={invoice.id}>
                                            <TableCell>{invoice.id}</TableCell>
                                            <TableCell>{invoice.childName}</TableCell>
                                            <TableCell>{format(new Date(invoice.dueDate.replace(/-/g, '/')), 'PPP')}</TableCell>
                                            <TableCell><Badge variant={invoice.status === 'Paid' ? 'default' : invoice.status === 'Overdue' ? 'destructive' : 'secondary'}>{invoice.status}</Badge></TableCell>
                                            <TableCell className="text-right">${invoice.amount.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="expenses">
                     <Card>
                        <CardHeader>
                            <CardTitle>Expense Report</CardTitle>
                            <CardDescription>Breakdown of expenses by category and date.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                {renderDateRangePicker(expenseDateRange, setExpenseDateRange, isExpenseCalendarOpen, setIsExpenseCalendarOpen)}
                                <Select value={expenseCategory} onValueChange={setExpenseCategory}>
                                    <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Select Category" /></SelectTrigger>
                                    <SelectContent>{expenseCategoryOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                             <Card>
                                <CardHeader><CardTitle className="text-lg">Expenses by Category</CardTitle></CardHeader>
                                <CardContent>
                                    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                                        <PieChart>
                                            <Tooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                                            <Pie data={expenseChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                                {expenseChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Legend />
                                        </PieChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
