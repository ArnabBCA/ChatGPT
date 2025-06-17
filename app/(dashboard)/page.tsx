"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { useSidebar } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Dashboard() {
  const { open } = useSidebar();
  return (
    <div className="h-full w-full">
      {!open && <SidebarTrigger />}
      <ThemeToggle />
    </div>
  );
}
