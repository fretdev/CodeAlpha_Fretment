"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { api, ApiError } from "@/lib/api";
import { ProjectMemberItem } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { UserPlus, Trash2, Mail } from "lucide-react";

interface MembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  members: ProjectMemberItem[];
  isOwner: boolean;
  onMembersUpdated: () => void;
}

export function MembersModal({
  isOpen,
  onClose,
  projectId,
  members,
  isOwner,
  onMembersUpdated,
}: MembersModalProps) {
  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);

  const [memberToRemove, setMemberToRemove] =
    useState<ProjectMemberItem | null>(null);
  const [removing, setRemoving] = useState(false);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setAdding(true);
      setAddError(null);
      setAddSuccess(null);
      await api.members.add(projectId, { email: email.trim().toLowerCase() });
      setEmail("");
      setAddSuccess("Member successfully invited and added to project.");
      onMembersUpdated();
      setTimeout(() => setAddSuccess(null), 4000);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setAddError(err.message);
      } else {
        setAddError("Failed to add member. Ensure the user exists.");
      }
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;

    try {
      setRemoving(true);
      await api.members.remove(projectId, memberToRemove.user.id);
      setMemberToRemove(null);
      onMembersUpdated();
    } catch (err: any) {
      alert(err.message || "Failed to remove member");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Project Members"
        description="Team members collaborating on this workspace."
        size="lg"
      >
        <div className="space-y-5">
          {isOwner && (
            <div className="p-4 bg-[#FFF8D6] rounded-md border border-[#D8D8C8]">
              <h4 className="text-xs font-bold text-[#4D544B] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-[#588157]" />
                Invite Member by Email
              </h4>
              <form onSubmit={handleAddMember} className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="teammate@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    leftIcon={<Mail className="w-4 h-4" />}
                  />
                </div>
                <Button
                  type="submit"
                  size="sm"
                  variant="accent"
                  isLoading={adding}
                  disabled={!email.trim()}
                  className="shrink-0"
                >
                  Invite
                </Button>
              </form>

              {addError && (
                <p className="mt-2 text-xs font-medium text-[#BC4749]">
                  {addError}
                </p>
              )}
              {addSuccess && (
                <p className="mt-2 text-xs font-medium text-[#588157]">
                  {addSuccess}
                </p>
              )}
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-[#6B7369] uppercase tracking-widest">
                Team Roster ({members.length})
              </h4>
            </div>

            <div className="divide-y divide-[#D8D8C8] border border-[#D8D8C8] rounded-md overflow-hidden bg-[#FFFCED] max-h-72 overflow-y-auto">
              {members.map((m) => {
                const memberIsOwner = m.role === "OWNER";
                return (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-3.5 hover:bg-[#FFF8D6] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar
                        name={m.user.username}
                        src={m.user.avatarUrl}
                        size="md"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-[#20251F] truncate">
                            {m.user.username}
                          </p>
                          <Badge
                            variant={memberIsOwner ? "green" : "slate"}
                            size="sm"
                          >
                            {m.role}
                          </Badge>
                        </div>
                        <p className="text-xs text-[#596057] truncate mt-0.5">
                          {m.user.email || "No email available"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {m.joinedAt && (
                        <span className="text-xs text-[#596057] hidden sm:inline">
                          Joined {formatDate(m.joinedAt)}
                        </span>
                      )}

                      {isOwner && !memberIsOwner && (
                        <button
                          onClick={() => setMemberToRemove(m)}
                          className="p-1.5 text-[#6B7369] hover:text-[#BC4749] hover:bg-[#BC4749]/10 rounded transition-colors cursor-pointer"
                          title="Remove member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-[#D8D8C8]">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!memberToRemove}
        onClose={() => setMemberToRemove(null)}
        onConfirm={handleRemoveMember}
        title="Remove Member"
        message={`Are you sure you want to remove ${
          memberToRemove?.user.username || "this member"
        } from the project? They will lose access to all tasks and discussions.`}
        confirmText="Remove Member"
        variant="danger"
        isLoading={removing}
      />
    </>
  );
}
