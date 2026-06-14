"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAllPositions() {
  return prisma.position.findMany({ orderBy: { ticker: "asc" } });
}

export async function upsertPosition(ticker: string, shares: number) {
  await prisma.position.upsert({
    where: { ticker },
    update: { shares },
    create: { ticker: ticker.toUpperCase(), shares },
  });
  revalidatePath("/portfolio");
  revalidatePath("/");
}

export async function deletePosition(id: string) {
  await prisma.position.delete({ where: { id } });
  revalidatePath("/portfolio");
  revalidatePath("/");
}
