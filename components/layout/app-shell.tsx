'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

export function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isPublicRoute =
    pathname === '/' ||
    pathname === '/login';

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-background">
      {/* =====================================================
          DESKTOP SIDEBAR
      ===================================================== */}
      <aside className="hidden h-full shrink-0 lg:flex">
        <Sidebar
          collapsed={collapsed}
          onToggle={() =>
            setCollapsed((value) => !value)
          }
        />
      </aside>

      {/* =====================================================
          MOBILE SIDEBAR
      ===================================================== */}
      <Sheet
        open={mobileOpen}
        onOpenChange={setMobileOpen}
      >
        <SheetContent
          side="left"
          className="w-72 p-0"
          aria-describedby={undefined}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>

          <Sidebar
            collapsed={false}
            onToggle={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* =====================================================
          APPLICATION AREA
      ===================================================== */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar
          onMobileMenu={() => setMobileOpen(true)}
        />

        {/* ONE AND ONLY MAIN SCROLL CONTAINER */}
        <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto min-h-full w-full max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}