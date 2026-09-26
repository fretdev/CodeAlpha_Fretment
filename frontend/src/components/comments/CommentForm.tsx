"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Send } from "lucide-react";

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
}

export function CommentForm({ onSubmit }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      setError(null);
      await onSubmit(content.trim());
      setContent("");
    } catch (err: any) {
      setError(err.message || "Failed to post comment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <Textarea
        placeholder="Add a comment or development update..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        maxLength={2000}
        error={error || undefined}
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          size="sm"
          isLoading={loading}
          disabled={!content.trim()}
          rightIcon={<Send className="w-3.5 h-3.5" />}
        >
          Post Comment
        </Button>
      </div>
    </form>
  );
}
