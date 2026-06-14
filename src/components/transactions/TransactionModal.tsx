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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createTransaction, updateTransaction } from "@/actions/transactionActions";
import type { Transaction } from "@/generated/prisma/client";

const EXPENSE_CATEGORIES = [
  "Housing",
  "Food",
  "Subscriptions",
  "Utilities",
  "Transportation",
  "Entertainment",
  "Healthcare",
  "Misc",
];

const INCOME_CATEGORIES = ["Salary", "Freelance", "Investment", "Gift", "Other"];

interface Props {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export function TransactionModal({ open, onClose, transaction }: Props) {
  const isEdit = !!transaction;
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [type, setType] = useState<string>(transaction?.type ?? "EXPENSE");
  const [category, setCategory] = useState<string>(transaction?.category ?? "");
  const [amount, setAmount] = useState<string>(transaction ? String(transaction.amount) : "");
  const [description, setDescription] = useState<string>(transaction?.description ?? "");
  const [date, setDate] = useState(
    transaction
      ? new Date(transaction.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [isRecurring, setIsRecurring] = useState(
    transaction?.isRecurring ?? false
  );

  useEffect(() => {
    if (open) {
      setType(transaction?.type ?? "EXPENSE");
      setCategory(transaction?.category ?? "");
      setAmount(transaction?.amount.toString() ?? "");
      setDescription(transaction?.description ?? "");
      setDate(
        transaction
          ? new Date(transaction.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0]
      );
      setIsRecurring(transaction?.isRecurring ?? false);
      setErrors({});
    }
  }, [open, transaction]);

  const categories = type === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    const errs: Record<string, string> = {};
    if (!type) errs.type = "Type is required";
    if (!category) errs.category = "Category is required";
    if (isNaN(parsedAmount) || parsedAmount <= 0)
      errs.amount = "Amount must be a positive number";
    if (!date) errs.date = "Date is required";
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    const data = {
      type,
      amount: parsedAmount,
      category,
      description: description || undefined,
      date: new Date(date),
      isRecurring,
    };

    startTransition(async () => {
      if (isEdit) {
        await updateTransaction(transaction.id, data);
      } else {
        await createTransaction(data);
      }
      onClose();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Transaction" : "Add Transaction"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => { setType(v ?? "EXPENSE"); setCategory(""); }}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INCOME">Income</SelectItem>
                <SelectItem value="EXPENSE">Expense</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-xs text-red-500">{errors.type}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-red-500">{errors.category}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Amount ($)</Label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {errors.amount && (
              <p className="text-xs text-red-500">{errors.amount}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {errors.date && (
              <p className="text-xs text-red-500">{errors.date}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Description (optional)</Label>
            <Input
              placeholder="e.g. Monthly rent"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="recurring"
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="recurring">Recurring</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
