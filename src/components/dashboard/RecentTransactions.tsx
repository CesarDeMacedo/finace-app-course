import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Transaction } from "@/generated/prisma/client";

interface Props {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-muted-foreground text-sm">No transactions yet.</p>
        ) : (
          <ul className="space-y-3">
            {transactions.map((t) => (
              <li key={t.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge
                    variant={t.type === "INCOME" ? "default" : "destructive"}
                    className="shrink-0"
                  >
                    {t.type}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">{t.category}</p>
                    {t.description && (
                      <p className="text-xs text-muted-foreground">
                        {t.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      t.type === "INCOME" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {t.type === "INCOME" ? "+" : "-"}${t.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(t.date), "MMM d, yyyy")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
