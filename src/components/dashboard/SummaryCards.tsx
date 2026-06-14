"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStockQuotes } from "@/actions/stockActions";
import type { Position } from "@/generated/prisma/client";

interface Props {
  income: number;
  expenses: number;
  positions: Position[];
}

export function SummaryCards({ income, expenses, positions }: Props) {
  const [portfolioValue, setPortfolioValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (positions.length === 0) {
      setPortfolioValue(0);
      setLoading(false);
      return;
    }
    getStockQuotes(positions.map((p) => p.ticker)).then((quotes) => {
      const total = positions.reduce((sum, p) => {
        const price = quotes[p.ticker] ?? 0;
        return sum + price * p.shares;
      }, 0);
      setPortfolioValue(total);
      setLoading(false);
    });
  }, [positions]);

  const netCashflow = income - expenses;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Monthly Income
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">
            ${income.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Monthly Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-500">
            ${expenses.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Net Cashflow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={`text-2xl font-bold ${
              netCashflow >= 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {netCashflow >= 0 ? "+" : ""}${netCashflow.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Portfolio Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-8 w-28 bg-muted animate-pulse rounded" />
          ) : (
            <p className="text-2xl font-bold">
              ${portfolioValue?.toFixed(2) ?? "N/A"}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
