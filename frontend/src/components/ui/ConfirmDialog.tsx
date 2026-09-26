"use client";

import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex items-start gap-3.5">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
            variant === "danger"
              ? "bg-[#BC4749]/10 text-[#BC4749] border border-[#BC4749]/30"
              : "bg-[#588157]/10 text-[#344E41] border border-[#588157]/30"
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-bold text-[#20251F]">{title}</h3>
          <p className="text-xs sm:text-sm text-[#4D544B] leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2.5 pt-4 border-t border-[#D8D8C8]">
        <Button
          variant="secondary"
          size="sm"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
        <Button
          variant={variant === "danger" ? "danger" : "primary"}
          size="sm"
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
