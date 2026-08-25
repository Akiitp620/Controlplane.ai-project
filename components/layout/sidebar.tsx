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
  PanelLeftClose,
  PanelLeft,
  CircleDot,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { getPendingReviews } from '@/lib/mock-data';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeKey?: 'review';
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Evaluate', href: '/evaluate', icon: FileSearch },
  { label: 'Use Cases', href: '/use-cases', icon: Briefcase },
  { label: 'Policies', href: '/policies', icon: ScrollText },
  { label: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen },
  { label: 'Human Review', href: '/review', icon: ShieldCheck, badgeKey: 'review' },
  { label: 'Audit Trail', href: '/audit', icon: History },
  { label: 'Metrics', href: '/metrics', icon: BarChart3 },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = React.useState(0);

  React.useEffect(() => {
    setPendingCount(getPendingReviews().length);
  }, []);

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-border bg-card transition-[width] duration-200',
        collapsed ? 'w-[68px]' : 'w-60'
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-border px-4">
        <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
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

      <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-thin px-2 py-3">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.badgeKey === 'review' && pendingCount > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-review px-1.5 text-[11px] font-semibold text-review-foreground">
                  {pendingCount}
                </span>
              )}
              {collapsed && item.badgeKey === 'review' && pendingCount > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-review" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
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
