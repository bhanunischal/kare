
'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { updateDaycareDetails, resetDaycareAdminPassword } from '../actions';
import type { Daycare, User } from '@prisma/client';
import { Loader2, KeyRound } from 'lucide-react';

const updateDetailsInitialState = { message: null, errors: null };
const resetPasswordInitialState = { message: null, errors: null };

function SaveDetailsButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
        </Button>
    )
}

function ResetPasswordButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reset Password
        </Button>
    )
}

export function DaycareSettingsClient({ daycare, adminUser }: { daycare: Daycare; adminUser: User | null }) {
    const { toast } = useToast();
    
    const [detailsState, detailsFormAction] = useActionState(updateDaycareDetails, updateDetailsInitialState);
    const [passwordState, passwordFormAction] = useActionState(resetDaycareAdminPassword, resetPasswordInitialState);

    useEffect(() => {
        if (detailsState?.message) {
            if (detailsState.errors) {
                toast({ variant: 'destructive', title: 'Update Failed', description: detailsState.message });
            } else {
                toast({ title: 'Success!', description: detailsState.message });
            }
        }
    }, [detailsState, toast]);
    
     useEffect(() => {
        if (passwordState?.message) {
            if (passwordState.errors) {
                toast({ variant: 'destructive', title: 'Password Reset Failed', description: passwordState.message });
            } else {
                toast({ title: 'Success!', description: passwordState.message });
                 // Consider clearing password fields here if needed, requires form ref
            }
        }
    }, [passwordState, toast]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>Daycare Details</CardTitle>
                        <CardDescription>View and edit the daycare's information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={detailsFormAction} className="space-y-6">
                            <input type="hidden" name="id" value={daycare.id} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Daycare Name</Label>
                                    <Input id="name" name="name" defaultValue={daycare.name} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="plan">Subscription Plan</Label>
                                    <Select name="plan" defaultValue={daycare.plan}>
                                        <SelectTrigger id="plan">
                                            <SelectValue placeholder="Select a plan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Basic">Basic</SelectItem>
                                            <SelectItem value="Premium">Premium</SelectItem>
                                            <SelectItem value="Enterprise">Enterprise</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea id="address" name="address" defaultValue={daycare.address ?? ''} />
                            </div>
                            <SaveDetailsButton />
                        </form>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1 space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Admin User</CardTitle>
                        <CardDescription>Manage the primary administrator for this daycare.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {adminUser ? (
                            <>
                                <div>
                                    <Label>User Email</Label>
                                    <p className="text-sm font-medium">{adminUser.email}</p>
                                </div>
                                <Separator />
                                <form action={passwordFormAction} className="space-y-4">
                                    <input type="hidden" name="userId" value={adminUser.id} />
                                    <div className="space-y-2">
                                        <Label htmlFor="password">New Password</Label>
                                        <Input id="password" name="password" type="password" />
                                        {passwordState?.errors?.password && <p className="text-xs text-destructive">{passwordState.errors.password[0]}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                        <Input id="confirmPassword" name="confirmPassword" type="password" />
                                        {passwordState?.errors?.confirmPassword && <p className="text-xs text-destructive">{passwordState.errors.confirmPassword[0]}</p>}
                                    </div>
                                    <ResetPasswordButton />
                                </form>
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground">No admin user found for this daycare.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
