"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import {
  Circle,
  Clock,
  CheckCircle2,
  Calendar,
  MessageSquare,
  FolderKanban,
  Bell,
  Check,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-[#FFF3B0] text-[#20251F] flex flex-col justify-between paper-texture selection:bg-[#588157] selection:text-[#FFFCED]">
      <header className="h-16 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between border-b border-[#D8D8C8] bg-[#FFF8D6]/80 backdrop-blur-xs sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-display text-2xl sm:text-3xl tracking-widest text-[#20251F] group-hover:text-[#588157] transition-colors">
            FRETMENT
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs sm:text-sm font-semibold tracking-wider text-[#4D544B] uppercase">
          <a href="#preview" className="hover:text-[#20251F] transition-colors">
            Workspace
          </a>
          <a href="#features" className="hover:text-[#20251F] transition-colors">
            Capabilities
          </a>
          <a href="#philosophy" className="hover:text-[#20251F] transition-colors">
            Philosophy
          </a>
        </nav>

        <div className="flex items-center gap-2.5">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Start a project</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12 text-center space-y-6">
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-wider text-[#20251F] leading-[0.95]">
            PLAN CLEARLY. <br />
            <span className="text-[#344E41]">WORK TOGETHER.</span> <br />
            MOVE PROJECTS FORWARD.
          </h1>

          <p className="text-base sm:text-lg text-[#4D544B] max-w-2xl mx-auto leading-relaxed">
            A tactile, stationery-inspired workspace designed for clarity and velocity. Real-time collaboration, structured Kanban boards, and contextual threads without clutter.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link href="/register" className="inline-flex">
              <Button
                size="md"
                className="w-auto px-6 py-2.5 font-semibold text-sm sm:text-base tracking-wide"
              >
                Start a project
              </Button>
            </Link>
            <a
              href="#preview"
              className="text-sm font-bold text-[#344E41] hover:text-[#588157] transition-colors inline-flex items-center gap-1.5 py-2 px-3 tracking-wide"
            >
              Explore Fretment &rarr;
            </a>
          </div>
        </section>

        <section id="preview" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <div className="rounded-xl border border-[#D8D8C8] bg-[#FFF8D6] shadow-xl overflow-hidden">
            <div className="h-10 bg-[#FFFCED] border-b border-[#D8D8C8] px-4 flex items-center justify-between text-xs text-[#6B7369]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D8D8C8] border border-[#C5C5B5]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#D8D8C8] border border-[#C5C5B5]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#D8D8C8] border border-[#C5C5B5]" />
              </div>
              <span className="font-mono text-xs text-[#4D544B]">
                fretment / core-engine-architecture / board
              </span>
              <div className="flex items-center gap-1.5 text-xs text-[#344E41] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#588157] animate-pulse" />
                ● FRETMENT LIVE
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-5 bg-[#FFF3B0]/70">
              <div className="bg-[#FFFCED] rounded-lg border border-[#D8D8C8] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative overflow-hidden shadow-2xs">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#344E41]" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-[#20251F] tracking-tight">
                      Core Engine Architecture
                    </h2>
                    <span className="text-xs font-bold bg-[#588157]/15 text-[#344E41] border border-[#588157]/30 px-2 py-0.5 rounded uppercase">
                      OWNER
                    </span>
                  </div>
                  <p className="text-sm text-[#4D544B] mt-0.5">
                    Distributed event-driven backend services & socket routing.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    <div className="w-7 h-7 rounded bg-[#344E41] text-[#FFFCED] border border-[#D8D8C8] flex items-center justify-center text-xs font-bold">
                      JD
                    </div>
                    <div className="w-7 h-7 rounded bg-[#588157] text-[#FFFCED] border border-[#D8D8C8] flex items-center justify-center text-xs font-bold">
                      SM
                    </div>
                    <div className="w-7 h-7 rounded bg-[#A3B18A] text-[#20251F] border border-[#D8D8C8] flex items-center justify-center text-xs font-bold">
                      AK
                    </div>
                  </div>
                  <span className="text-xs text-[#596057] font-medium">
                    3 Members
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#FFF8D6] p-3.5 rounded-lg border border-[#D8D8C8] space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-[#D8D8C8]">
                    <div className="flex items-center gap-1.5">
                      <Circle className="w-3.5 h-3.5 text-[#6B7369]" />
                      <span className="text-xs font-bold text-[#20251F]">TO DO</span>
                      <span className="text-xs bg-[#FFFCED] text-[#4D544B] px-2 py-0.5 rounded border border-[#D8D8C8] font-bold">
                        2
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#FFFCED] p-3.5 rounded-md border border-[#D8D8C8] space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#BC4749] bg-[#BC4749]/10 border border-[#BC4749]/30 px-1.5 py-0.5 rounded">
                        URGENT
                      </span>
                      <span className="text-xs text-[#BC4749] font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Tomorrow
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#20251F] leading-snug">
                      Implement JWT socket handshake middleware
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-[#E8E8D8] text-xs text-[#596057]">
                      <span>#TASK-104</span>
                      <div className="w-5 h-5 rounded bg-[#344E41] text-[#FFFCED] flex items-center justify-center font-bold text-[10px]">
                        JD
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#FFFCED] p-3.5 rounded-md border border-[#D8D8C8] space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#4D544B] bg-[#FFF8D6] border border-[#D8D8C8] px-1.5 py-0.5 rounded">
                        LOW
                      </span>
                      <span className="text-xs text-[#596057] flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Oct 12
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#20251F] leading-snug">
                      Audit database connection pool timeout metrics
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-[#E8E8D8] text-xs text-[#596057]">
                      <span>#TASK-108</span>
                      <span className="text-[#6B7369] italic">Unassigned</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FFF8D6] p-3.5 rounded-lg border border-[#D8D8C8] space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-[#D8D8C8]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#C57B28]" />
                      <span className="text-xs font-bold text-[#20251F]">IN PROGRESS</span>
                      <span className="text-xs bg-[#C57B28]/15 text-[#9E5D15] px-2 py-0.5 rounded border border-[#C57B28]/30 font-bold">
                        2
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#FFFCED] p-3.5 rounded-md border border-[#D8D8C8] space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#9E5D15] bg-[#C57B28]/15 border border-[#C57B28]/30 px-1.5 py-0.5 rounded">
                        HIGH
                      </span>
                      <span className="text-xs text-[#596057] flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Oct 4
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#20251F] leading-snug">
                      Refactor task event notification trigger
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-[#E8E8D8] text-xs text-[#596057]">
                      <span className="flex items-center gap-1 text-[#4D544B]">
                        <MessageSquare className="w-3 h-3 text-[#588157]" /> 4 comments
                      </span>
                      <div className="w-5 h-5 rounded bg-[#588157] text-[#FFFCED] flex items-center justify-center font-bold text-[10px]">
                        SM
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#FFFCED] p-3.5 rounded-md border border-[#D8D8C8] space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#344E41] bg-[#A3B18A]/30 border border-[#A3B18A]/50 px-1.5 py-0.5 rounded">
                        MEDIUM
                      </span>
                      <span className="text-xs text-[#596057] flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Oct 8
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#20251F] leading-snug">
                      Design warm tactile token palette and typography
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-[#E8E8D8] text-xs text-[#596057]">
                      <span>#TASK-102</span>
                      <div className="w-5 h-5 rounded bg-[#A3B18A] text-[#20251F] flex items-center justify-center font-bold text-[10px]">
                        AK
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FFF8D6] p-3.5 rounded-lg border border-[#D8D8C8] space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-[#D8D8C8]">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#588157]" />
                      <span className="text-xs font-bold text-[#20251F]">DONE</span>
                      <span className="text-xs bg-[#588157]/15 text-[#344E41] px-2 py-0.5 rounded border border-[#588157]/30 font-bold">
                        1
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#FFFCED] p-3.5 rounded-md border border-[#D8D8C8] space-y-2 opacity-85 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#344E41] bg-[#588157]/15 border border-[#588157]/30 px-1.5 py-0.5 rounded">
                        COMPLETED
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#596057] leading-snug line-through">
                      Initial schema migrations and entity relations
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-[#E8E8D8] text-xs text-[#596057]">
                      <span>#TASK-99</span>
                      <div className="w-5 h-5 rounded bg-[#344E41] text-[#FFFCED] flex items-center justify-center font-bold text-[10px]">
                        JD
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-10">
          <div className="text-center space-y-2">
            <h2 className="font-display text-3xl sm:text-4xl tracking-wider text-[#20251F]">
              ENGINEERED FOR WORKSPACE CLARITY
            </h2>
            <p className="text-sm sm:text-base text-[#4D544B] max-w-xl mx-auto">
              Everything high-output engineering teams need to organize, delegate, and execute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-[#FFFCED] p-6 rounded-lg border border-[#D8D8C8] space-y-3 shadow-xs">
              <div className="w-9 h-9 rounded bg-[#FFF8D6] border border-[#D8D8C8] text-[#344E41] flex items-center justify-center">
                <FolderKanban className="w-4 h-4 text-[#588157]" />
              </div>
              <h3 className="font-bold text-base text-[#20251F] tracking-tight">
                Kanban Task Board
              </h3>
              <p className="text-sm text-[#4D544B] leading-relaxed">
                Structured stages across To Do, In Progress, and Done. Fast
                priority taxonomy, assignment delegation, and deadline tracking.
              </p>
            </div>

            <div className="bg-[#FFFCED] p-6 rounded-lg border border-[#D8D8C8] space-y-3 shadow-xs">
              <div className="w-9 h-9 rounded bg-[#FFF8D6] border border-[#D8D8C8] text-[#344E41] flex items-center justify-center">
                <Bell className="w-4 h-4 text-[#588157]" />
              </div>
              <h3 className="font-bold text-base text-[#20251F] tracking-tight">
                Real-Time Team Stream
              </h3>
              <p className="text-sm text-[#4D544B] leading-relaxed">
                Instant live updates deliver task status changes, member
                assignments, and project invitations directly to your workspace.
              </p>
            </div>

            <div className="bg-[#FFFCED] p-6 rounded-lg border border-[#D8D8C8] space-y-3 shadow-xs">
              <div className="w-9 h-9 rounded bg-[#FFF8D6] border border-[#D8D8C8] text-[#344E41] flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-[#588157]" />
              </div>
              <h3 className="font-bold text-base text-[#20251F] tracking-tight">
                Contextual Discussions
              </h3>
              <p className="text-sm text-[#4D544B] leading-relaxed">
                Threaded task comments keep technical discussion tied to
                execution items rather than getting lost in scattered channels.
              </p>
            </div>
          </div>
        </section>

        <section id="philosophy" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <div className="bg-[#FFF8D6] rounded-xl border border-[#D8D8C8] p-8 sm:p-10 space-y-6 shadow-sm">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-bold text-[#588157] uppercase tracking-widest">
                Philosophy
              </span>
              <h2 className="font-display text-3xl sm:text-4xl tracking-wider text-[#20251F]">
                ZERO DISTRACTION. FULL ALIGNMENT.
              </h2>
              <p className="text-sm sm:text-base text-[#4D544B] leading-relaxed">
                Fretment eliminates noisy SaaS dashboard gimmicks. No endless
                widgets or decorative bloat. Just pure, responsive task execution
                and team visibility on a tactile, warm foundation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 bg-[#FFFCED] rounded-lg border border-[#D8D8C8] space-y-1">
                <span className="text-sm font-bold text-[#20251F] flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#588157]" /> Secure Sessions
                </span>
                <p className="text-xs text-[#596057]">
                  Stateless JWT security and role protection.
                </p>
              </div>

              <div className="p-4 bg-[#FFFCED] rounded-lg border border-[#D8D8C8] space-y-1">
                <span className="text-sm font-bold text-[#20251F] flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#588157]" /> Instant Live Sync
                </span>
                <p className="text-xs text-[#596057]">
                  Real-time updates delivered as work happens.
                </p>
              </div>

              <div className="p-4 bg-[#FFFCED] rounded-lg border border-[#D8D8C8] space-y-1">
                <span className="text-sm font-bold text-[#20251F] flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#588157]" /> Team Member Roles
                </span>
                <p className="text-xs text-[#596057]">
                  Owner administrative controls and member access.
                </p>
              </div>

              <div className="p-4 bg-[#FFFCED] rounded-lg border border-[#D8D8C8] space-y-1">
                <span className="text-sm font-bold text-[#20251F] flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#588157]" /> Tactile Foundation
                </span>
                <p className="text-xs text-[#596057]">
                  Warm cream and forest greens engineered for focus.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center space-y-6">
          <h2 className="font-display text-4xl sm:text-6xl tracking-wider text-[#20251F]">
            MOVE WORK FORWARD.
          </h2>

          <p className="text-sm sm:text-base text-[#4D544B] max-w-xl mx-auto leading-relaxed">
            Organize projects, assign tasks, communicate with clarity, and keep
            every team member synchronized in one tactile workspace.
          </p>

          <div className="pt-2">
            <Link href="/register" className="inline-flex">
              <Button
                size="lg"
                className="w-auto px-7 font-bold tracking-wider text-sm sm:text-base"
              >
                Start a project with Fretment
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-[#FFF8D6] border-t border-[#D8D8C8] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#D8D8C8]">
          <div className="md:col-span-1 space-y-3">
            <span className="font-display text-2xl tracking-widest text-[#20251F]">
              FRETMENT
            </span>
            <p className="text-sm text-[#4D544B] leading-relaxed">
              Plan clearly. Work together. Move projects forward.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#6B7369] uppercase tracking-widest">
              Product
            </h3>
            <ul className="space-y-2 text-sm text-[#4D544B]">
              <li>
                <a href="#features" className="hover:text-[#20251F] transition-colors">
                  Capabilities
                </a>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[#20251F] transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <a href="#preview" className="hover:text-[#20251F] transition-colors">
                  Tasks
                </a>
              </li>
              <li>
                <Link href="/notifications" className="hover:text-[#20251F] transition-colors">
                  Notifications
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#6B7369] uppercase tracking-widest">
              Company
            </h3>
            <ul className="space-y-2 text-sm text-[#4D544B]">
              <li>
                <a href="#philosophy" className="hover:text-[#20251F] transition-colors">
                  About & Philosophy
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#20251F] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#6B7369] uppercase tracking-widest">
              Account
            </h3>
            <ul className="space-y-2 text-sm text-[#4D544B]">
              <li>
                <Link href="/login" className="hover:text-[#344E41] transition-colors font-medium">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#344E41] transition-colors font-medium">
                  Start a project
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#596057] gap-2">
          <div>&copy; 2026 Fretment. All rights reserved.</div>
          <div className="text-xs text-[#596057]">
            Tactile stationery & editorial project execution for high-velocity teams.
          </div>
        </div>
      </footer>
    </div>
  );
}