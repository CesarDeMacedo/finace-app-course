"use client";

import { format } from "date-fns";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus } from "lucide-react";
import { deleteTransaction } from "@/actions/transactionActions";
import { TransactionModal } from "./TransactionModal";
import type { Transaction } from "@/generated/prisma/client";

interface Props {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: Props) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteTransaction(id);
    });
  };

  const openAdd = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (t: Transaction) => {
    setEditing(t);
    setOpen(true);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {transactions.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-12">
          No transactions yet. Click &quot;Add Transaction&quot; to get started.
        </p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Recurring</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="text-sm">
                    {format(new Date(t.date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        t.type === "INCOME" ? "default" : "destructive"
                      }
                    >
                      {t.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{t.category}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {t.description ?? "—"}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <span
                      className={
                        t.type === "INCOME" ? "text-green-600" : "text-red-500"
                      }
                    >
                      {t.type === "INCOME" ? "+" : "-"}${t.amount.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {t.isRecurring ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEdit(t)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={isPending}
                        onClick={() => handleDelete(t.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <TransactionModal
        open={open}
        onClose={() => setOpen(false)}
        transaction={editing}
      />
    </>
  );
}
