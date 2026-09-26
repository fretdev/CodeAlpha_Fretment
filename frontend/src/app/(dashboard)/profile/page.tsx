"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/utils";
import { Mail, Calendar, LogOut } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <Header
        title="USER PROFILE"
        subtitle="Manage session authentication, profile information, and credentials."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-5">
        <Card className="p-6 bg-[#FFFCED] border-[#D8D8C8] shadow-xs">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-5 border-b border-[#D8D8C8]">
            <Avatar
              name={user?.username}
              src={user?.avatarUrl}
              size="xl"
              className="w-16 h-16 text-xl font-bold rounded-lg border border-[#D8D8C8]"
            />

            <div className="space-y-1.5 text-center sm:text-left">
              <h2 className="text-xl font-bold text-[#20251F] tracking-tight">
                {user?.username}
              </h2>
              <p className="text-xs text-[#596057] flex items-center justify-center sm:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#588157]" />
                {user?.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 py-5 text-xs">
            <div className="p-3.5 bg-[#FFF8D6] rounded-md border border-[#D8D8C8] space-y-1">
              <span className="text-[10px] font-bold text-[#7D857B] uppercase tracking-wider block">
                Account Status
              </span>
              <span className="font-semibold text-[#588157] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#588157]" />
                Active Account
              </span>
            </div>

            <div className="p-3.5 bg-[#FFF8D6] rounded-md border border-[#D8D8C8] space-y-1">
              <span className="text-[10px] font-bold text-[#7D857B] uppercase tracking-wider block">
                Member Since
              </span>
              <span className="font-medium text-[#20251F] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#588157]" />
                {user?.createdAt ? formatDate(user.createdAt) : "Recently"}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#D8D8C8] flex justify-end">
            <Button
              variant="danger"
              size="sm"
              onClick={logout}
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
            >
              Sign Out of Session
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
