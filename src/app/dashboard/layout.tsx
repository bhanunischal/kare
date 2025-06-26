import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { DashboardNav } from "@/components/dashboard-nav";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="min-h-screen">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2 justify-between">
                <Logo />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <DashboardNav />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger />
            <div className="ml-auto flex items-center gap-4">
              <span className="font-medium text-sm">Jane Doe</span>
              <Avatar>
                <AvatarImage src="https://placehold.co/100x100.png" alt="@janedoe" data-ai-hint="woman face" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <main className="p-4 sm:px-6 sm:py-0 space-y-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
