
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Admin Settings
        </h1>
        <p className="text-muted-foreground">
          Manage global platform settings.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="billing">Billing Plans</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Platform Settings</CardTitle>
              <CardDescription>
                Manage basic settings for the entire platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input
                  id="platform-name"
                  defaultValue="CareConnect BC"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-email">Support Email</Label>
                <Input
                  id="support-email"
                  type="email"
                  defaultValue="support@careconnect.com"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="maintenance-mode" />
                <Label htmlFor="maintenance-mode">
                  Enable Maintenance Mode
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing Plans</CardTitle>
              <CardDescription>
                Manage subscription plans and pricing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                This section would allow managing different subscription tiers
                (e.g., Basic, Premium, Enterprise), including setting prices,
                features per plan, and trial periods. This is a placeholder for a future feature.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Integrations</CardTitle>
              <CardDescription>
                Manage API keys and connections to external services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="stripe-key">Stripe API Key</Label>
                <Input
                  id="stripe-key"
                  type="password"
                  placeholder="sk_test_..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="google-maps-key">Google Maps API Key</Label>
                <Input
                  id="google-maps-key"
                  type="password"
                  placeholder="AIza..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Manage feature flags and other technical configurations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="ai-assessment-flag" className="text-base">AI Assessments</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable the AI-powered child assessment feature for all daycares.
                  </p>
                </div>
                <Switch id="ai-assessment-flag" defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="waitlist-analytics-flag" className="text-base">Waitlist Analytics</Label>
                   <p className="text-sm text-muted-foreground">
                    Enable or disable the AI-powered waitlist forecasting feature.
                  </p>
                </div>
                <Switch id="waitlist-analytics-flag" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-2">
        <Button>Save All Settings</Button>
      </div>
    </div>
  );
}
