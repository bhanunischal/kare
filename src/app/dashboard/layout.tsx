
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("Rendering simplified DashboardLayout...");
  return (
    <div>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
