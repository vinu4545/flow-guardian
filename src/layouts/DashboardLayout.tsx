import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { CopilotOrb } from "@/components/CopilotPanel";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      <CopilotOrb />
    </div>
  );
}
