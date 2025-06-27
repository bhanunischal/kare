
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
                  defaultValue="CareOps"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-email">Support Email</Label>
                <Input
                  id="support-email"
                  type="email"
                  defaultValue="support@careops.com"
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Billing Plans</CardTitle>
                <CardDescription>
                  Manage subscription plans and pricing for daycares.
                </CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add New Plan
              </Button>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Basic</CardTitle>
                  <CardDescription>
                    For small daycares getting started.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-4xl font-bold">
                    $49<span className="text-xl font-normal text-muted-foreground">/mo</span>
                  </div>
                  <ul className="space-y-2 pt-4 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Up to 25 children
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Core features
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Email support
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Edit Plan
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-primary shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Premium</CardTitle>
                    <Badge>Most Popular</Badge>
                  </div>
                  <CardDescription>
                    For growing daycares with more needs.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-4xl font-bold">
                    $99<span className="text-xl font-normal text-muted-foreground">/mo</span>
                  </div>
                  <ul className="space-y-2 pt-4 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Up to 75 children
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      All core features
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      AI-powered features
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Priority support
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Edit Plan</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <CardDescription>
                    For large organizations and multi-location daycares.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-4xl font-bold">
                    Custom
                  </div>
                  <ul className="space-y-2 pt-4 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Unlimited children
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      All features included
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Dedicated account manager
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Custom branding
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Edit Plan
                  </Button>
                </CardFooter>
              </Card>
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
