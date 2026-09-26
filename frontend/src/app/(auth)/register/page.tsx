"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (username.trim().length < 3 || username.trim().length > 30) {
      setError("Username must be between 3 and 30 characters.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await register({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      router.push("/dashboard");
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Registration failed. Please check your credentials.");
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
            Create your engineering profile and initialize your collaborative workspaces.
          </p>
        </div>

        {error && (
          <div className="p-3 text-xs sm:text-sm font-medium text-[#BC4749] bg-[#BC4749]/10 border border-[#BC4749]/30 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            placeholder="johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            minLength={3}
            maxLength={30}
            leftIcon={<User className="w-4 h-4 text-[#6B7369]" />}
          />

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
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            leftIcon={<Lock className="w-4 h-4 text-[#6B7369]" />}
            helperText="Must be at least 8 characters long."
          />

          <Button
            type="submit"
            className="w-full tracking-wider font-bold text-sm sm:text-base"
            size="lg"
            isLoading={loading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            CREATE ACCOUNT
          </Button>
        </form>

        <div className="pt-4 border-t border-[#D8D8C8] text-center text-sm text-[#4D544B]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-[#344E41] hover:text-[#588157] transition-colors"
          >
            Sign in &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
