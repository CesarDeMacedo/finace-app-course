"use client";

import { useState, useTransition, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { upsertPosition } from "@/actions/portfolioActions";
import type { Position } from "@/generated/prisma/client";

interface Props {
  open: boolean;
  onClose: () => void;
  position: Position | null;
}

export function PositionModal({ open, onClose, position }: Props) {
  const isEdit = !!position;
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ticker, setTicker] = useState(position?.ticker ?? "");
  const [shares, setShares] = useState(position?.shares.toString() ?? "");

  useEffect(() => {
    if (open) {
      setTicker(position?.ticker ?? "");
      setShares(position?.shares.toString() ?? "");
      setErrors({});
    }
  }, [open, position]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedShares = parseFloat(shares);
    const errs: Record<string, string> = {};
    if (!ticker.trim()) errs.ticker = "Ticker symbol is required";
    if (isNaN(parsedShares) || parsedShares <= 0)
      errs.shares = "Shares must be a positive number";
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    startTransition(async () => {
      await upsertPosition(ticker.trim().toUpperCase(), parsedShares);
      onClose();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Position" : "Add Position"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label>Ticker Symbol</Label>
            <Input
              placeholder="e.g. AAPL"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              disabled={isEdit}
            />
            {errors.ticker && (
              <p className="text-xs text-red-500">{errors.ticker}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Shares Owned</Label>
            <Input
              type="number"
              step="0.0001"
              min="0.0001"
              placeholder="0"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
            />
            {errors.shares && (
              <p className="text-xs text-red-500">{errors.shares}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : isEdit ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
