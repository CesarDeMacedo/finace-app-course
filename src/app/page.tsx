import { getCurrentMonthTransactions } from "@/actions/transactionActions";
import { getAllPositions } from "@/actions/portfolioActions";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { ExpensePieChart } from "@/components/dashboard/ExpensePieChart";

export default async function DashboardPage() {
  const [transactions, positions] = await Promise.all([
    getCurrentMonthTransactions(),
    getAllPositions(),
  ]);

  const income = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  const expensesByCategory = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + t.amount;
      return acc;
    }, {});

  const pieData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <SummaryCards income={income} expenses={expenses} positions={positions} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions transactions={transactions.slice(0, 5)} />
        <ExpensePieChart data={pieData} />
      </div>
    </div>
  );
}
