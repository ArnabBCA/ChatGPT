import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Logo from "./icons/logo-icon";
import { Button } from "./ui/button";

export function AppSidebar() {
  return (
    <Sidebar className="dark:border-[var(--sidebar-chatgpt-border)]">
      <SidebarHeader className="px-2 py-0 flex justify-between flex-row header-height items-center">
        <Button
          size={"icon"}
          variant={"ghost"}
          className="[&_svg]:!w-auto [&_svg]:!h-auto hover:!bg-neutral-200/70 dark:hover:!bg-neutral-700/80"
        >
          <Logo size={24} />
        </Button>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
