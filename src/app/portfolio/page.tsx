import { getAllPositions } from "@/actions/portfolioActions";
import { PortfolioTable } from "@/components/portfolio/PortfolioTable";

export default async function PortfolioPage() {
  const positions = await getAllPositions();
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Portfolio</h2>
      <PortfolioTable positions={positions} />
    </div>
  );
}
