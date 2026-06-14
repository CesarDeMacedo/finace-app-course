import { getAllTransactions } from "@/actions/transactionActions";
import { TransactionTable } from "@/components/transactions/TransactionTable";

export default async function TransactionsPage() {
  const transactions = await getAllTransactions();
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Transactions</h2>
      <TransactionTable transactions={transactions} />
    </div>
  );
}
