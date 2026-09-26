"use client";

import React, { useState } from "react";
import { Comment, User } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { timeAgo } from "@/lib/utils";
import { Edit2, Trash2 } from "lucide-react";

interface CommentListProps {
  comments: Comment[];
  currentUser: User | null;
  onUpdateComment: (commentId: number, content: string) => Promise<void>;
  onDeleteComment: (commentId: number) => Promise<void>;
}

export function CommentList({
  comments,
  currentUser,
  onUpdateComment,
  onDeleteComment,
}: CommentListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const startEditing = (c: Comment) => {
    setEditingId(c.id);
    setEditContent(c.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleSaveEdit = async (commentId: number) => {
    if (!editContent.trim()) return;
    try {
      setSavingId(commentId);
      await onUpdateComment(commentId, editContent.trim());
      setEditingId(null);
    } catch (err: any) {
      alert(err.message || "Failed to update comment");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      setDeletingId(commentId);
      await onDeleteComment(commentId);
    } catch (err: any) {
      alert(err.message || "Failed to delete comment");
    } finally {
      setDeletingId(null);
    }
  };

  if (comments.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-[#596057]">
        No comments yet. Start the conversation below.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => {
        const isAuthor = currentUser?.id === comment.author.id;
        const isEditing = editingId === comment.id;

        return (
          <div
            key={comment.id}
            className="flex items-start gap-3 p-3.5 rounded-md bg-[#FFFCED] border border-[#D8D8C8] group shadow-xs"
          >
            <Avatar
              name={comment.author.username}
              src={comment.author.avatarUrl}
              size="sm"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#20251F]">
                    {comment.author.username}
                  </span>
                  <span className="text-xs text-[#596057]">
                    {timeAgo(comment.createdAt)}
                  </span>
                  {comment.updatedAt &&
                    comment.updatedAt !== comment.createdAt && (
                      <span className="text-xs text-[#596057] italic">
                        (edited)
                      </span>
                    )}
                </div>

                {isAuthor && !isEditing && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEditing(comment)}
                      className="p-1.5 text-[#596057] hover:text-[#20251F] hover:bg-[#FFF8D6] rounded cursor-pointer"
                      title="Edit comment"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      disabled={deletingId === comment.id}
                      className="p-1.5 text-[#596057] hover:text-[#BC4749] hover:bg-[#BC4749]/10 rounded cursor-pointer"
                      title="Delete comment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-2 mt-1.5">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={2}
                    maxLength={2000}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={cancelEditing}
                      disabled={savingId === comment.id}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSaveEdit(comment.id)}
                      isLoading={savingId === comment.id}
                      disabled={!editContent.trim()}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[#20251F] whitespace-pre-wrap leading-relaxed">
                  {comment.content}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
