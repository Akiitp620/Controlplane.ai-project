'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileSearch,
  Briefcase,
  ScrollText,
  BookOpen,
  History,
  BarChart3,
  ShieldCheck,
  LockKeyhole,
  PanelLeftClose,
  PanelLeft,
  CircleDot,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeKey?: 'review';
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Evaluate',
    href: '/evaluate',
    icon: FileSearch,
  },
  {
    label: 'Action Gate',
    href: '/action-gate',
    icon: LockKeyhole,
  },
  {
    label: 'Use Cases',
    href: '/use-cases',
    icon: Briefcase,
  },
  {
    label: 'Policies',
    href: '/policies',
    icon: ScrollText,
  },
  {
    label: 'Knowledge Base',
    href: '/knowledge-base',
    icon: BookOpen,
  },
  {
    label: 'Human Review',
    href: '/review',
    icon: ShieldCheck,
    badgeKey: 'review',
  },
  {
    label: 'Audit Trail',
    href: '/audit',
    icon: History,
  },
  {
    label: 'Metrics',
    href: '/metrics',
    icon: BarChart3,
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface HumanReviewRecord {
  status?: string;
}

export function Sidebar({
  collapsed,
  onToggle,
}: SidebarProps) {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = React.useState(0);

  const loadPendingReviews = React.useCallback(async () => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ??
      'http://localhost:8080';

    const token =
      window.localStorage.getItem('token');

    try {
      const response = await fetch(
        `${apiUrl}/api/human-reviews`,
        {
          method: 'GET',
          headers: {
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        return;
      }

      const data: HumanReviewRecord[] =
        await response.json();

      const count = data.filter(
        (review) =>
          review.status?.toUpperCase() === 'PENDING'
      ).length;

      setPendingCount(count);
    } catch {
      // Non-fatal:
      // keep the current badge state if the backend
      // is temporarily unavailable.
    }
  }, []);

  React.useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    // Initial load.
    loadPendingReviews();

    // Keep the badge reasonably fresh while the app
    // remains open.
    intervalId = setInterval(
      loadPendingReviews,
      10_000
    );

    // Refresh immediately when the user returns
    // to the browser tab.
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible'
      ) {
        loadPendingReviews();
      }
    };

    const handleWindowFocus = () => {
      loadPendingReviews();
    };

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );

    window.addEventListener(
      'focus',
      handleWindowFocus
    );

    return () => {
      clearInterval(intervalId);

      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );

      window.removeEventListener(
        'focus',
        handleWindowFocus
      );
    };
  }, [loadPendingReviews]);

  return (
    <aside
      className={cn(
        'flex h-screen shrink-0 flex-col overflow-hidden border-r border-border bg-card transition-[width] duration-200',
        collapsed
          ? 'w-[68px]'
          : 'w-60'
      )}
    >
      {/* =======================================================
          BRAND
      ======================================================= */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-4">
        <Link
          href="/dashboard"
          className="flex min-w-0 items-center gap-2.5"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <CircleDot className="h-5 w-5" />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold tracking-tight text-foreground">
                ControlPlane
              </div>

              <div className="truncate text-[11px] text-muted-foreground">
                Responsible AI Control
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* =======================================================
          NAVIGATION
      ======================================================= */}
      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain scrollbar-thin px-2 py-3">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            pathname.startsWith(
              `${item.href}/`
            );

          const Icon = item.icon;

          const showReviewBadge =
            item.badgeKey === 'review' &&
            pendingCount > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={
                collapsed
                  ? item.label
                  : undefined
              }
              className={cn(
                'group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />

              {!collapsed && (
                <span className="truncate">
                  {item.label}
                </span>
              )}

              {/* Expanded sidebar badge */}
              {!collapsed &&
                showReviewBadge && (
                  <span
                    aria-label={`${pendingCount} pending human review${
                      pendingCount === 1 ? '' : 's'
                    }`}
                    className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-review px-1.5 text-[11px] font-semibold text-review-foreground"
                  >
                    {pendingCount}
                  </span>
                )}

              {/* Collapsed sidebar indicator */}
              {collapsed &&
                showReviewBadge && (
                  <span
                    aria-label={`${pendingCount} pending human review${
                      pendingCount === 1 ? '' : 's'
                    }`}
                    className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-review ring-2 ring-card"
                  />
                )}
            </Link>
          );
        })}
      </nav>

      {/* =======================================================
          SIDEBAR CONTROLS
      ======================================================= */}
      <div className="border-t border-border p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          title={
            collapsed
              ? 'Expand sidebar'
              : 'Collapse sidebar'
          }
        >
          {collapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}