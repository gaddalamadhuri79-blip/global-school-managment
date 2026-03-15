import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Building2,
  FileText,
  LogIn,
  LogOut,
  Search,
  Users,
} from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../hooks/useQueries";
import { useLogoAnimation } from "../lib/LogoAnimationContext";

export default function AppHeader() {
  const { identity, clear, login, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();
  const navigate = useNavigate();
  const { isAnimating } = useLogoAnimation();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: "/" });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error("Login error:", error);
        if (error.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="border-b bg-card shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img
              src="/assets/generated/global-school-logo.dim_512x512.png"
              alt="Global School"
              className={`h-12 w-12 object-contain transition-transform duration-500 ${
                isAnimating ? "animate-logo-success" : ""
              }`}
            />
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Global School
              </h1>
              <p className="text-xs text-muted-foreground">
                Internal Office Use
              </p>
            </div>
          </Link>

          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              <Link to="/">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Building2 className="h-4 w-4" />
                    Dashboard
                  </Button>
                )}
              </Link>
              <Link to="/students">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Students
                  </Button>
                )}
              </Link>
              <Link to="/search">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                )}
              </Link>
              <Link to="/reports">
                {({ isActive }) => (
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Reports
                  </Button>
                )}
              </Link>
            </nav>
          )}

          <div className="flex items-center gap-3">
            {isAuthenticated && userProfile && (
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {userProfile.name}
              </span>
            )}
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              variant={isAuthenticated ? "outline" : "default"}
              size="sm"
              className="gap-2"
            >
              {isLoggingIn ? (
                "Logging in..."
              ) : isAuthenticated ? (
                <>
                  <LogOut className="h-4 w-4" />
                  Logout
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
