"use client";

import { useState, useActionState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ImageUp, Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import type { Daycare } from '@prisma/client';
import { updateSettings, connectStorage, disconnectStorage } from './actions';
import { useFormStatus } from 'react-dom';
import { cn } from '@/lib/utils';
import { GoogleDriveIcon } from '@/components/provider-icons/google-drive-icon';
import { OneDriveIcon } from '@/components/provider-icons/one-drive-icon';

type StorageProvider = 'google-drive' | 'one-drive';

const providers = [
  { id: 'google-drive', name: 'Google Drive', icon: <GoogleDriveIcon className="h-8 w-8" /> },
  { id: 'one-drive', name: 'Microsoft OneDrive', icon: <OneDriveIcon className="h-8 w-8" /> },
];

const updateSettingsInitialState = { message: null, errors: null };

function SaveButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Profile
        </Button>
    )
}

export default function SettingsClient({ daycare }: { daycare: Daycare }) {
  const { toast } = useToast();

  // State for profile tab
  const [state, formAction] = useActionState(updateSettings, updateSettingsInitialState);

  // State for integrations tab
  const [connectedProvider, setConnectedProvider] = useState<string | null>(daycare.storageProvider);
  const [selectedProvider, setSelectedProvider] = useState<StorageProvider | null>(daycare.storageProvider as StorageProvider | null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // State for homepage tab
  const [carouselImages, setCarouselImages] = useState([
    { id: 1, src: 'https://placehold.co/600x450.png', alt: 'Children playing', hint: 'kids playing' },
    { id: 2, src: 'https://placehold.co/600x450.png', alt: 'Daycare classroom', hint: 'bright classroom' },
    { id: 3, src: 'https://placehold.co/600x450.png', alt: 'Teacher reading to kids', hint: 'teacher reading' },
  ]);

  useEffect(() => {
    if (state?.message) {
      if (state.errors) {
        toast({ variant: "destructive", title: "Error", description: state.message });
      } else {
        toast({ title: "Success!", description: state.message });
      }
    }
  }, [state, toast]);
  
  // This useEffect ensures the client state is in sync with the server data after revalidation
  useEffect(() => {
    setConnectedProvider(daycare.storageProvider);
    setSelectedProvider(daycare.storageProvider as StorageProvider | null);
  }, [daycare.storageProvider]);

  const handleConnect = async () => {
    if (!selectedProvider) {
        toast({ variant: "destructive", title: "Error", description: "Please select a provider to connect." });
        return;
    }
    setIsConnecting(true);
    // In a real app, this would trigger the OAuth flow.
    // Here we just simulate a successful connection by updating the database.
    const result = await connectStorage(daycare.id, selectedProvider);
    if (result.success) {
      toast({ title: "Connection Successful", description: result.message });
    } else {
      toast({ variant: "destructive", title: "Connection Failed", description: result.message });
    }
    setIsConnecting(false);
  };
  
  const handleDisconnect = async () => {
    setIsConnecting(true);
    const result = await disconnectStorage(daycare.id);
    if (result.success) {
      toast({ title: "Disconnected", description: result.message });
    } else {
      toast({ variant: "destructive", title: "Disconnection Failed", description: result.message });
    }
    setIsConnecting(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
        <p className="text-muted-foreground">Manage your daycare's settings and integrations.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Daycare Profile</CardTitle>
              <CardDescription>Update your center's public information and branding.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="daycareName">Daycare Name</Label>
                    <Input id="daycareName" name="daycareName" defaultValue={daycare.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input id="licenseNumber" name="licenseNumber" defaultValue={daycare.licenseNumber || ''} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input id="contactEmail" name="contactEmail" type="email" defaultValue={daycare.contactEmail || ''} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input id="contactPhone" name="contactPhone" type="tel" defaultValue={daycare.contactPhone || ''} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" name="address" defaultValue={daycare.address || ''} />
                  </div>
                </div>

                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium">Program Capacity</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">Set the maximum number of children for each program group.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="space-y-2">
                          <Label htmlFor="infantCapacity">Infant (0-12months)</Label>
                          <Input id="infantCapacity" name="infantCapacity" type="number" defaultValue={daycare.infantCapacity} />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="toddlerCapacity">Toddler (1 to 3 years)</Label>
                          <Input id="toddlerCapacity" name="toddlerCapacity" type="number" defaultValue={daycare.toddlerCapacity} />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="preschoolCapacity">Preschool (3 to 5 years)</Label>
                          <Input id="preschoolCapacity" name="preschoolCapacity" type="number" defaultValue={daycare.preschoolCapacity} />
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="gradeschoolerCapacity">Gradeschooler (5 to 12 years)</Label>
                          <Input id="gradeschoolerCapacity" name="gradeschoolerCapacity" type="number" defaultValue={daycare.gradeschoolerCapacity} />
                      </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                        <Label>Logo</Label>
                        <Card className="border-2 border-dashed">
                            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2 aspect-square">
                                <ImageUp className="h-12 w-12 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    Click to upload a logo
                                </p>
                                 <p className="text-xs text-muted-foreground">
                                    (Recommended: 256x256)
                                 </p>
                                <Button variant="outline" size="sm" type="button">
                                    Upload
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                     <div className="space-y-2">
                        <Label>Banner Image</Label>
                        <Card className="border-2 border-dashed">
                            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2 aspect-square">
                                <ImageUp className="h-12 w-12 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    Click to upload a banner
                                </p>
                                 <p className="text-xs text-muted-foreground">
                                    (Recommended: 1200x400)
                                 </p>
                                <Button variant="outline" size="sm" type="button">
                                    Upload
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                
                <SaveButton />
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Cloud Storage Integration</CardTitle>
              <CardDescription>Connect a cloud storage provider to store documents and photos securely. Changes will apply to all future uploads.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providers.map((provider) => (
                  <Card 
                    key={provider.id} 
                    className={cn(
                        "cursor-pointer transition-all",
                        selectedProvider === provider.id && "border-primary ring-2 ring-primary"
                    )}
                    onClick={() => setSelectedProvider(provider.id as StorageProvider)}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {provider.icon}
                            <span className="font-medium">{provider.name}</span>
                        </div>
                        {connectedProvider === provider.id && (
                          <Badge variant="outline" className="border-green-500 text-green-600">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Connected
                          </Badge>
                        )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleConnect} disabled={isConnecting || !selectedProvider || selectedProvider === connectedProvider}>
                  {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                  {selectedProvider === connectedProvider ? 'Already Connected' : `Connect to ${providers.find(p => p.id === selectedProvider)?.name}`}
                </Button>
                 {connectedProvider && (
                  <Button variant="destructive" onClick={handleDisconnect} disabled={isConnecting}>
                    {isConnecting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    Disconnect
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="homepage">
            <Card>
                <CardHeader>
                    <CardTitle>Homepage Content</CardTitle>
                    <CardDescription>Manage the content displayed on your public-facing homepage.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <h3 className="font-medium">Carousel Images</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {carouselImages.map((image, index) => (
                            <Card key={image.id}>
                                <CardContent className="p-2">
                                    <div className="aspect-[4/3] bg-muted rounded-md overflow-hidden mb-2">
                                        <Image src={image.src} alt={image.alt} data-ai-hint={image.hint} className="w-full h-full object-cover" width={600} height={450} />
                                    </div>
                                    <Button variant="outline" className="w-full">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Replace Image {index + 1}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
