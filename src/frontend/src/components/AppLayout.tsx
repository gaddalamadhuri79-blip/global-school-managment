import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "@tanstack/react-router";
import { LogoAnimationProvider } from "../lib/LogoAnimationContext";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import ProfileSetupModal from "./auth/ProfileSetupModal";

export default function AppLayout() {
  return (
    <LogoAnimationProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <AppHeader />
        <main className="flex-1 container mx-auto px-4 py-6">
          <Outlet />
        </main>
        <AppFooter />
        <ProfileSetupModal />
        <Toaster />
      </div>
    </LogoAnimationProvider>
  );
}
