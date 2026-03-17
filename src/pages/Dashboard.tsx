import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Package,
  Receipt,
  IndianRupee,
  Clock,
} from "lucide-react";

const summaryCards = [
  { label: "Today's Sales", value: "₹24,850", change: "+12%", up: true, icon: IndianRupee },
  { label: "Invoices", value: "34", change: "+5", up: true, icon: Receipt },
  { label: "Low Stock Items", value: "7", change: "", up: false, icon: Package },
  { label: "Expiring Soon", value: "12", change: "<30 days", up: false, icon: Clock },
];

const fastMoving = [
  { name: "Dolo 650mg", sold: 248, stock: 120 },
  { name: "Azithromycin 500mg", sold: 186, stock: 45 },
  { name: "Pan 40mg", sold: 164, stock: 200 },
  { name: "Crocin Advance", sold: 142, stock: 88 },
  { name: "Shelcal 500mg", sold: 98, stock: 60 },
];

const alerts = [
  { type: "expiry" as const, message: "Amoxicillin 250mg (Batch #B2024-089) expires in 15 days", severity: "high" as const },
  { type: "stock" as const, message: "Azithromycin 500mg — only 45 units left (threshold: 50)", severity: "high" as const },
  { type: "expiry" as const, message: "Cetirizine 10mg (Batch #C2024-112) expires in 28 days", severity: "medium" as const },
  { type: "stock" as const, message: "Paracetamol Syrup — only 12 bottles left", severity: "medium" as const },
];

export default function Dashboard() {
  return (
    <div className="p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Monday, March 17, 2026</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="bg-card border border-border rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <card.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-semibold font-mono text-foreground">
                {card.value}
              </span>
              {card.change && (
                <span
                  className={`text-xs font-medium flex items-center gap-0.5 mb-1 ${
                    card.up ? "text-success" : "text-destructive"
                  }`}
                >
                  {card.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {card.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Fast Moving Medicines */}
        <div className="col-span-2 bg-card border border-border rounded-lg">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Fast-Moving Medicines (Last 30 Days)</h2>
          </div>
          <table className="w-full text-sm table-zebra">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-2 text-muted-foreground font-medium">Medicine</th>
                <th className="text-right px-4 py-2 text-muted-foreground font-medium">Sold</th>
                <th className="text-right px-4 py-2 text-muted-foreground font-medium">In Stock</th>
                <th className="text-right px-4 py-2 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {fastMoving.map((med) => (
                <tr key={med.name} className="border-b border-border last:border-0">
                  <td className="px-4 py-2.5 font-medium text-foreground">{med.name}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-foreground">{med.sold}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-foreground">{med.stock}</td>
                  <td className="px-4 py-2.5 text-right">
                    {med.stock < 50 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-destructive/10 text-destructive">
                        Low
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success/10 text-success">
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Alerts */}
        <div className="bg-card border border-border rounded-lg">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <h2 className="text-sm font-semibold text-foreground">Active Alerts</h2>
          </div>
          <div className="divide-y divide-border">
            {alerts.map((alert, i) => (
              <div key={i} className="px-4 py-3 flex gap-3">
                <div
                  className={`w-1.5 rounded-full flex-shrink-0 ${
                    alert.severity === "high" ? "bg-destructive" : "bg-warning"
                  }`}
                />
                <div>
                  <p className="text-xs text-foreground leading-relaxed">{alert.message}</p>
                  <span className="text-[10px] uppercase font-medium text-muted-foreground mt-1 inline-block">
                    {alert.type === "expiry" ? "EXPIRY" : "STOCK"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
