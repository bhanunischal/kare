
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Cloud, ImageUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type StorageProvider = 'google-drive' | 'one-drive' | 'aws-s3' | 'azure-blob';

const providers = [
  { id: 'google-drive', name: 'Google Drive' },
  { id: 'one-drive', name: 'Microsoft OneDrive' },
  { id: 'aws-s3', name: 'Amazon S3' },
  { id: 'azure-blob', name: 'Azure Blob Storage' },
];

export default function SettingsPage() {
  // State for integrations tab
  const [connectedProvider, setConnectedProvider] = useState<StorageProvider | null>('google-drive');
  const [selectedProvider, setSelectedProvider] = useState<StorageProvider>(connectedProvider || 'google-drive');
  
  // State for profile tab
  const [daycareName, setDaycareName] = useState("CareConnect BC");
  const [licenseNumber, setLicenseNumber] = useState("L-123456789");
  const [contactEmail, setContactEmail] = useState("contact@careconnect.com");
  const [contactPhone, setContactPhone] = useState("(555) 123-4567");
  const [address, setAddress] = useState("123 Sunny Lane, Vancouver, BC V5K 0A1");

  const { toast } = useToast();

  const handleConnect = () => {
    // In a real app, this would trigger the OAuth flow or credential setup
    setConnectedProvider(selectedProvider);
    toast({
      title: "Connection Successful",
      description: `Successfully connected to ${providers.find(p => p.id === selectedProvider)?.name}.`
    })
  };
  
  const handleDisconnect = () => {
    setConnectedProvider(null);
    toast({
      title: "Disconnected",
      description: "Cloud storage has been disconnected."
    })
  };
  
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, save this data to the backend
    console.log({ daycareName, licenseNumber, contactEmail, contactPhone, address });
    toast({
        title: "Profile Updated",
        description: "Your daycare's profile information has been saved.",
    });
  }

  const isConnected = selectedProvider === connectedProvider;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
        <p className="text-muted-foreground">Manage your daycare's settings and integrations.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Daycare Profile</CardTitle>
              <CardDescription>Update your center's public information and branding.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="daycare-name">Daycare Name</Label>
                    <Input id="daycare-name" value={daycareName} onChange={(e) => setDaycareName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license-number">License Number</Label>
                    <Input id="license-number" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input id="contact-email" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="contact-phone">Contact Phone</Label>
                    <Input id="contact-phone" type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
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
                
                <Button type="submit">Save Profile</Button>
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
              <RadioGroup value={selectedProvider} onValueChange={(value) => setSelectedProvider(value as StorageProvider)} className="space-y-2">
                {providers.map((provider) => (
                  <Label key={provider.id} htmlFor={provider.id} className="flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent has-[[data-state=checked]]:border-primary transition-all">
                    <div className="flex items-center gap-4">
                       <RadioGroupItem value={provider.id} id={provider.id} />
                       <div className="flex items-center gap-2">
                           <Cloud className="h-5 w-5 text-muted-foreground" />
                           <span className="font-medium">{provider.name}</span>
                       </div>
                    </div>
                    {connectedProvider === provider.id && (
                      <Badge variant="default" className="bg-accent text-accent-foreground border-green-500 text-green-700">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Connected
                      </Badge>
                    )}
                  </Label>
                ))}
              </RadioGroup>
              
              <div className="flex gap-2">
                <Button onClick={handleConnect} disabled={isConnected}>
                  {connectedProvider === selectedProvider ? 'Already Connected' : `Connect to ${providers.find(p => p.id === selectedProvider)?.name}`}
                </Button>
                 {connectedProvider && (
                  <Button variant="destructive" onClick={handleDisconnect}>
                    Disconnect
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
