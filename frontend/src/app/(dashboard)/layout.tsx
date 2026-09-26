"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { Spinner } from "@/components/ui/Spinner";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF3B0]">
        <Spinner size="lg" label="Initializing workspace..." />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFF3B0] text-[#20251F] paper-texture">
      <Sidebar />

      <header className="md:hidden h-14 bg-[#FFF8D6] border-b border-[#D8D8C8] px-4 flex items-center justify-between sticky top-0 z-30 shrink-0">
        <Link href="/dashboard" className="flex items-center group">
          <span className="font-display text-2xl tracking-widest text-[#20251F] group-hover:text-[#588157] transition-colors">
            FRETMENT
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <NotificationDropdown />
          <button
            onClick={() => setMobileNavOpen(true)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md bg-[#FFFCED] border border-[#D8D8C8] text-[#20251F] hover:bg-[#FFF8D6] hover:border-[#588157] transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 bg-[#FFF3B0]">
        <main className="flex-1 pb-12">{children}</main>
      </div>
    </div>
  );
}
