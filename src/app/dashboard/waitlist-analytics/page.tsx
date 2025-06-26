"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ForecastWaitlistOutput } from "@/ai/flows/waitlist-forecasting";
import { getWaitlistForecast } from "./actions";
import { Loader2, Lightbulb, BarChartBig, Route } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const initialState: { output: ForecastWaitlistOutput | null; error: string | null; } = {
  output: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Forecast Demand
    </Button>
  );
}

export default function WaitlistAnalyticsPage() {
  const [state, formAction] = useActionState(getWaitlistForecast, initialState);
  const { toast } = useToast();
  const stateRef = useRef(initialState);

  useEffect(() => {
    // Only show toast if the state has changed and there's a new error.
    if (state !== stateRef.current && state.error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: state.error,
      });
      stateRef.current = state;
    }
  }, [state, toast]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Waitlist Analytics</h1>
        <p className="text-muted-foreground">Forecast waitlist demand and optimize enrollment using AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Forecast Input</CardTitle>
              <CardDescription>Provide data to generate a forecast.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="historical-data">Historical Waitlist Data</Label>
                  <Textarea
                    id="historical-data"
                    name="historicalData"
                    placeholder="e.g., Jan 2023: 15 on waitlist, 5 enrolled. Feb 2023: 20 on waitlist, 7 enrolled."
                    className="min-h-32"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current-capacity">Current Capacity</Label>
                  <Input id="current-capacity" name="currentCapacity" type="number" placeholder="e.g., 75" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seasonal-trends">Seasonal Trends (Optional)</Label>
                  <Input id="seasonal-trends" name="seasonalTrends" placeholder="e.g., Higher demand in September" />
                </div>
                <SubmitButton />
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="min-h-full">
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
              <CardDescription>Results from the forecast will appear here.</CardDescription>
            </CardHeader>
            <CardContent>
              {state.output ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center font-headline">
                      <BarChartBig className="mr-2 h-5 w-5 text-primary" /> Forecasted Demand
                    </h3>
                    <p className="text-sm text-muted-foreground bg-secondary p-4 rounded-lg">{state.output.forecastedDemand}</p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center font-headline">
                      <Route className="mr-2 h-5 w-5 text-primary" /> Enrollment Strategies
                    </h3>
                    <p className="text-sm text-muted-foreground bg-secondary p-4 rounded-lg">{state.output.enrollmentStrategies}</p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center font-headline">
                      <Lightbulb className="mr-2 h-5 w-5 text-primary" /> Resource Allocation
                    </h3>
                    <p className="text-sm text-muted-foreground bg-secondary p-4 rounded-lg">{state.output.resourceAllocation}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 h-full">
                  <Lightbulb className="h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">Your forecast results will be generated here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
