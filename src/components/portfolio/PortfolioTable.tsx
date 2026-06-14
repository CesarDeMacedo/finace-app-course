"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus, RefreshCw } from "lucide-react";
import { deletePosition } from "@/actions/portfolioActions";
import { getStockQuotes } from "@/actions/stockActions";
import { PositionModal } from "./PositionModal";
import type { Position } from "@/generated/prisma/client";

interface Props {
  positions: Position[];
}

export function PortfolioTable({ positions }: Props) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Position | null>(null);
  const [isPending, startTransition] = useTransition();
  const [quotes, setQuotes] = useState<Record<string, number | null>>({});
  const [loadingQuotes, setLoadingQuotes] = useState(true);

  const fetchQuotes = () => {
    if (positions.length === 0) {
      setLoadingQuotes(false);
      return;
    }
    setLoadingQuotes(true);
    getStockQuotes(positions.map((p) => p.ticker)).then((q) => {
      setQuotes(q);
      setLoadingQuotes(false);
    });
  };

  useEffect(() => {
    fetchQuotes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positions]);

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deletePosition(id);
    });
  };

  const totalValue = positions.reduce((sum, p) => {
    const price = quotes[p.ticker] ?? 0;
    return sum + price * p.shares;
  }, 0);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-muted-foreground">
          {!loadingQuotes && positions.length > 0 && (
            <span>
              Total:{" "}
              <span className="font-semibold text-foreground">
                ${totalValue.toFixed(2)}
              </span>
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchQuotes} disabled={loadingQuotes}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loadingQuotes ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add Position
          </Button>
        </div>
      </div>

      {positions.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-12">
          No positions yet. Click &quot;Add Position&quot; to track a stock.
        </p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticker</TableHead>
                <TableHead className="text-right">Shares</TableHead>
                <TableHead className="text-right">Latest Price</TableHead>
                <TableHead className="text-right">Position Value</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((p) => {
                const price = quotes[p.ticker];
                const value =
                  price != null ? price * p.shares : null;
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono font-semibold">
                      {p.ticker}
                    </TableCell>
                    <TableCell className="text-right">{p.shares}</TableCell>
                    <TableCell className="text-right">
                      {loadingQuotes ? (
                        <div className="h-4 w-16 bg-muted animate-pulse rounded ml-auto" />
                      ) : price != null ? (
                        `$${price.toFixed(2)}`
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {loadingQuotes ? (
                        <div className="h-4 w-20 bg-muted animate-pulse rounded ml-auto" />
                      ) : value != null ? (
                        `$${value.toFixed(2)}`
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => { setEditing(p); setOpen(true); }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          disabled={isPending}
                          onClick={() => handleDelete(p.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <PositionModal
        open={open}
        onClose={() => setOpen(false)}
        position={editing}
      />
    </>
  );
}
