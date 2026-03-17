import { TrendingUp, AlertTriangle, Package, Brain } from "lucide-react";

const predictions = [
  { name: "Dolo 650mg", avgDaily: 8.2, currentStock: 120, daysLeft: 14, suggestion: "Reorder 200 units", risk: "medium" as const },
  { name: "Azithromycin 500mg", avgDaily: 6.1, currentStock: 45, daysLeft: 7, suggestion: "URGENT: Reorder 150 units", risk: "high" as const },
  { name: "Pan 40mg", avgDaily: 5.4, currentStock: 200, daysLeft: 37, suggestion: "Stock sufficient", risk: "low" as const },
  { name: "Crocin Advance", avgDaily: 4.7, currentStock: 88, daysLeft: 18, suggestion: "Reorder 100 units by next week", risk: "medium" as const },
  { name: "Paracetamol Syrup", avgDaily: 3.2, currentStock: 12, daysLeft: 3, suggestion: "CRITICAL: Reorder 50 bottles immediately", risk: "high" as const },
  { name: "Cetirizine 10mg", avgDaily: 2.8, currentStock: 150, daysLeft: 53, suggestion: "Stock sufficient", risk: "low" as const },
];

const deadStock = [
  { name: "Vitamin E 400mg", lastSold: "2026-01-12", qty: 45 },
  { name: "Diclofenac Gel 50g", lastSold: "2025-12-28", qty: 22 },
];

export default function Predictions() {
  return (
    <div className="p-6 max-w-6xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Brain className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">AI Insights</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Predictions based on 30-day moving average of sales data
        </p>
      </div>

      {/* Restock Predictions */}
      <div className="bg-card border border-border rounded-lg mb-6">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Stock-Out Risk & Restock Suggestions</h2>
        </div>
        <table className="w-full text-sm table-zebra">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-2.5 text-muted-foreground font-medium">Medicine</th>
              <th className="text-right px-4 py-2.5 text-muted-foreground font-medium">Avg/Day</th>
              <th className="text-right px-4 py-2.5 text-muted-foreground font-medium">Stock</th>
              <th className="text-right px-4 py-2.5 text-muted-foreground font-medium">Days Left</th>
              <th className="text-left px-4 py-2.5 text-muted-foreground font-medium">Suggestion</th>
              <th className="text-center px-4 py-2.5 text-muted-foreground font-medium">Risk</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((p) => (
              <tr key={p.name} className="border-b border-border last:border-0">
                <td className="px-4 py-2.5 font-medium text-foreground">{p.name}</td>
                <td className="px-4 py-2.5 text-right font-mono text-foreground">{p.avgDaily}</td>
                <td className="px-4 py-2.5 text-right font-mono text-foreground">{p.currentStock}</td>
                <td className={`px-4 py-2.5 text-right font-mono font-medium ${p.daysLeft <= 7 ? "text-destructive" : p.daysLeft <= 14 ? "text-warning" : "text-foreground"}`}>
                  {p.daysLeft}
                </td>
                <td className="px-4 py-2.5 text-foreground text-xs">{p.suggestion}</td>
                <td className="px-4 py-2.5 text-center">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                      p.risk === "high"
                        ? "bg-destructive/10 text-destructive"
                        : p.risk === "medium"
                        ? "bg-warning/10 text-warning"
                        : "bg-success/10 text-success"
                    }`}
                  >
                    {p.risk.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dead Stock */}
      <div className="bg-card border border-border rounded-lg">
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <Package className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Dead Stock (No sales in 60+ days)</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-4 py-2.5 text-muted-foreground font-medium">Medicine</th>
              <th className="text-left px-4 py-2.5 text-muted-foreground font-medium">Last Sold</th>
              <th className="text-right px-4 py-2.5 text-muted-foreground font-medium">Qty Remaining</th>
            </tr>
          </thead>
          <tbody>
            {deadStock.map((d) => (
              <tr key={d.name} className="border-b border-border last:border-0">
                <td className="px-4 py-2.5 font-medium text-foreground">{d.name}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{d.lastSold}</td>
                <td className="px-4 py-2.5 text-right font-mono text-foreground">{d.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
