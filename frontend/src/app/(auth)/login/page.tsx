"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await login({ email: email.trim(), password });
      router.push("/dashboard");
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF3B0] p-4 sm:p-6 paper-texture">
      <div className="w-full max-w-md bg-[#FFFCED] rounded-xl border border-[#D8D8C8] p-8 sm:p-10 space-y-6 shadow-md">
        <Link
          href="/"
          className="inline-flex items-center text-xs sm:text-sm font-semibold text-[#596057] hover:text-[#20251F] transition-colors gap-1.5"
        >
          &larr; Back to home
        </Link>

        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <span className="font-display text-4xl tracking-widest text-[#20251F] hover:text-[#588157] transition-colors">
              FRETMENT
            </span>
          </Link>
          <p className="text-sm text-[#4D544B] leading-relaxed">
            Sign in to access your engineering workspaces, task boards, and team stream.
          </p>
        </div>

        {error && (
          <div className="p-3 text-xs sm:text-sm font-medium text-[#BC4749] bg-[#BC4749]/10 border border-[#BC4749]/30 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="developer@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            leftIcon={<Mail className="w-4 h-4 text-[#6B7369]" />}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            leftIcon={<Lock className="w-4 h-4 text-[#6B7369]" />}
          />

          <Button
            type="submit"
            className="w-full tracking-wider font-bold text-sm sm:text-base"
            size="lg"
            isLoading={loading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            SIGN IN
          </Button>
        </form>

        <div className="pt-4 border-t border-[#D8D8C8] text-center text-sm text-[#4D544B]">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-bold text-[#344E41] hover:text-[#588157] transition-colors"
          >
            Create an account &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
