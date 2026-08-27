'use client';
import { useTheme } from 'next-themes';
import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  Menu,
  Bell,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Sliders,
  Sun,
  Moon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { getPendingReviews } from '@/lib/mock-data';

interface TopbarProps {
  onMobileMenu: () => void;
}

export function Topbar({ onMobileMenu }: TopbarProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [pendingCount, setPendingCount] =
    React.useState(0);

  React.useEffect(() => {
    setPendingCount(getPendingReviews().length);
  }, []);

  const handleSignOut = () => {
    /*
     * Demo authentication flow:
     * There is currently no real auth/session backend.
     * Redirect the user to the public ControlPlane landing page.
     */
    router.push('/');
  };

  return (
    <header className="flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-sm lg:px-6">
      {/* =====================================================
          MOBILE MENU
      ===================================================== */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMobileMenu}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* =====================================================
          BRAND / CONTEXT
      ===================================================== */}
      <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
        <span className="font-medium text-foreground">
          CONTROLPLANE
        </span>

        <span className="text-border">|</span>

        <span>Responsible AI Control Layer</span>
      </div>

      {/* =====================================================
          RIGHT ACTIONS
      ===================================================== */}
      <div className="ml-auto flex items-center gap-2">

        <Button
  variant="ghost"
  size="icon"
  aria-label="Toggle theme"
  onClick={() =>
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }
  className="relative"
>
  {theme === 'dark' ? (
    <Sun className="h-4.5 w-4.5" />
  ) : (
    <Moon className="h-4.5 w-4.5" />
  )}

  <span className="sr-only">
    Toggle dark mode
  </span>
</Button>
        {/* ===================================================
            ENVIRONMENT
        =================================================== */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="hidden items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs transition-colors hover:bg-accent md:flex"
              aria-label="Environment information"
            >
              <span className="text-muted-foreground">
                Environment
              </span>

              <span className="font-semibold text-foreground">
                Production
              </span>

              <span className="text-border">·</span>

              <span className="flex items-center gap-1.5 text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Operational
              </span>
            </button>
          </PopoverTrigger>

          <PopoverContent align="end" className="w-72">
            <div className="space-y-3">
              <div className="text-sm font-semibold">
                Environment Status
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Environment
                  </span>

                  <span className="font-medium">
                    Production (Demo)
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Status
                  </span>

                  <span className="flex items-center gap-1.5 text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    Operational
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Mode
                  </span>

                  <span className="font-medium">
                    Prototype / Simulated
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Backend
                  </span>

                  <span className="font-medium">
                    Mock Data
                  </span>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* ===================================================
            NOTIFICATIONS
        =================================================== */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
            >
              <div className="relative">
                <Bell className="h-5 w-5" />

                {pendingCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-review px-1 text-[10px] font-bold text-review-foreground">
                    {pendingCount}
                  </span>
                )}
              </div>
            </Button>
          </PopoverTrigger>

          <PopoverContent align="end" className="w-80">
            <div className="space-y-3">
              <div className="text-sm font-semibold">
                Notifications
              </div>

              {pendingCount > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-start gap-2 rounded-lg border border-border p-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-review/10">
                      <Bell className="h-4 w-4 text-review" />
                    </div>

                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        Human review required
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {pendingCount} evaluation
                        {pendingCount > 1 ? 's' : ''} pending
                        human review.
                      </div>

                      <Link
                        href="/review"
                        className="mt-1 inline-block text-xs font-medium text-primary hover:underline"
                      >
                        View review queue
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No new notifications.
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* ===================================================
            USER MENU
        =================================================== */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="gap-2 px-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                RA
              </div>

              <span className="hidden text-sm font-medium sm:inline">
                Risk Admin
              </span>

              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56"
          >
            <DropdownMenuLabel>
              <div className="text-sm font-medium">
                Risk Admin
              </div>

              <div className="text-xs text-muted-foreground">
                governance@controlplane.ai
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Profile */}
            <DropdownMenuItem
              onClick={() => router.push('/profile')}
              className="cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>

            {/* Preferences */}
            <DropdownMenuItem
              onClick={() => router.push('/settings')}
              className="cursor-pointer"
            >
              <Sliders className="mr-2 h-4 w-4" />
              Preferences
            </DropdownMenuItem>

            {/* Settings */}
            <DropdownMenuItem
              onClick={() => router.push('/settings')}
              className="cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>

            {/* Help */}
            <DropdownMenuItem
              onClick={() => router.push('/settings')}
              className="cursor-pointer"
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Help
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* =================================================
                SIGN OUT
            ================================================= */}
            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer text-muted-foreground focus:text-foreground"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}