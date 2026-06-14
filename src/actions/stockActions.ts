"use server";

import yahooFinance from "yahoo-finance2";

export async function getStockQuotes(
  tickers: string[]
): Promise<Record<string, number | null>> {
  const results: Record<string, number | null> = {};
  await Promise.allSettled(
    tickers.map(async (ticker) => {
      try {
        const quote = await yahooFinance.quote(ticker, {
          fields: ["regularMarketPrice"],
        });
        results[ticker] = (quote as { regularMarketPrice?: number }).regularMarketPrice ?? null;
      } catch {
        results[ticker] = null;
      }
    })
  );
  return results;
}
