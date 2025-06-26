
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Cloud, Cloudy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type StorageProvider = 'google-drive' | 'one-drive' | 'aws-s3' | 'azure-blob';

const providers = [
  { id: 'google-drive', name: 'Google Drive' },
  { id: 'one-drive', name: 'Microsoft OneDrive' },
  { id: 'aws-s3', name: 'Amazon S3' },
  { id: 'azure-blob', name: 'Azure Blob Storage' },
];

export default function SettingsPage() {
  const [connectedProvider, setConnectedProvider] = useState<StorageProvider | null>('google-drive');
  const [selectedProvider, setSelectedProvider] = useState<StorageProvider>(connectedProvider || 'google-drive');
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

  const isConnected = selectedProvider === connectedProvider;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
        <p className="text-muted-foreground">Manage your daycare's settings and integrations.</p>
      </div>

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
    </div>
  );
}

