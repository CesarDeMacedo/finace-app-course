"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCurrentMonthTransactions() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return prisma.transaction.findMany({
    where: { date: { gte: start, lte: end } },
    orderBy: { date: "desc" },
  });
}

export async function getAllTransactions() {
  return prisma.transaction.findMany({ orderBy: { date: "desc" } });
}

export async function createTransaction(data: {
  type: string;
  amount: number;
  category: string;
  description?: string;
  date: Date;
  isRecurring: boolean;
}) {
  await prisma.transaction.create({ data });
  revalidatePath("/");
  revalidatePath("/transactions");
}

export async function updateTransaction(
  id: string,
  data: Partial<{
    type: string;
    amount: number;
    category: string;
    description: string;
    date: Date;
    isRecurring: boolean;
  }>
) {
  await prisma.transaction.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/transactions");
}

export async function deleteTransaction(id: string) {
  await prisma.transaction.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/transactions");
}
