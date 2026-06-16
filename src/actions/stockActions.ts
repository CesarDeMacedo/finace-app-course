"use server";

import YahooFinance from "yahoo-finance2";

const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

export async function getStockQuotes(
  tickers: string[]
): Promise<Record<string, number | null>> {
  const results: Record<string, number | null> = {};
  await Promise.allSettled(
    tickers.map(async (ticker) => {
      try {
        const quote = await yf.quote(ticker);
        results[ticker] = quote.regularMarketPrice ?? null;
      } catch {
        results[ticker] = null;
      }
    })
  );
  return results;
}
