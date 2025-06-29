
"use client";

export default function DashboardPage() {
  console.log("Rendering simplified DashboardPage...");
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! The system is online.</p>
        <p>If you can see this, the page has successfully loaded.</p>
      </div>
    </div>
  );
}
