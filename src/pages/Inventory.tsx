import { useState } from "react";
import { Search, AlertTriangle, ArrowUpDown } from "lucide-react";

interface Medicine {
  id: string;
  name: string;
  batch: string;
  expiry: string;
  purchasePrice: number;
  sellingPrice: number;
  retailQty: number;
  wholesaleQty: number;
  category: string;
}

const inventoryData: Medicine[] = [
  { id: "1", name: "Dolo 650mg", batch: "D2024-401", expiry: "2026-08-15", purchasePrice: 22, sellingPrice: 32, retailQty: 80, wholesaleQty: 40, category: "Analgesic" },
  { id: "2", name: "Azithromycin 500mg", batch: "A2024-220", expiry: "2026-05-20", purchasePrice: 55, sellingPrice: 85, retailQty: 30, wholesaleQty: 15, category: "Antibiotic" },
  { id: "3", name: "Pan 40mg", batch: "P2024-318", expiry: "2027-01-10", purchasePrice: 28, sellingPrice: 48, retailQty: 150, wholesaleQty: 50, category: "Antacid" },
  { id: "4", name: "Crocin Advance", batch: "C2024-155", expiry: "2026-06-30", purchasePrice: 18, sellingPrice: 28, retailQty: 58, wholesaleQty: 30, category: "Analgesic" },
  { id: "5", name: "Shelcal 500mg", batch: "S2024-090", expiry: "2026-12-01", purchasePrice: 95, sellingPrice: 145, retailQty: 40, wholesaleQty: 20, category: "Supplement" },
  { id: "6", name: "Amoxicillin 250mg", batch: "AM2024-089", expiry: "2026-04-01", purchasePrice: 40, sellingPrice: 65, retailQty: 20, wholesaleQty: 10, category: "Antibiotic" },
  { id: "7", name: "Cetirizine 10mg", batch: "CE2024-112", expiry: "2026-04-14", purchasePrice: 10, sellingPrice: 18, retailQty: 100, wholesaleQty: 50, category: "Antihistamine" },
  { id: "8", name: "Metformin 500mg", batch: "M2024-078", expiry: "2027-06-15", purchasePrice: 12, sellingPrice: 22, retailQty: 200, wholesaleQty: 100, category: "Antidiabetic" },
  { id: "9", name: "Omeprazole 20mg", batch: "O2024-201", expiry: "2026-09-20", purchasePrice: 18, sellingPrice: 30, retailQty: 90, wholesaleQty: 40, category: "Antacid" },
  { id: "10", name: "Paracetamol Syrup", batch: "PS2024-045", expiry: "2026-07-10", purchasePrice: 35, sellingPrice: 55, retailQty: 8, wholesaleQty: 4, category: "Analgesic" },
];

function getExpiryStatus(expiry: string): "expired" | "critical" | "warning" | "ok" {
  const d = new Date(expiry);
  const now = new Date();
  const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  if (diff < 0) return "expired";
  if (diff < 30) return "critical";
  if (diff < 90) return "warning";
  return "ok";
}

function getStockStatus(qty: number): "low" | "ok" {
  return qty < 25 ? "low" : "ok";
}

export default function Inventory() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "low-stock" | "expiring">("all");

  const filtered = inventoryData
    .filter((m) => {
      if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.batch.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (filter === "low-stock" && m.retailQty + m.wholesaleQty >= 50) return false;
      if (filter === "expiring" && getExpiryStatus(m.expiry) === "ok") return false;
      return true;
    });

  return (
    <div className="p-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Inventory</h1>
          <p className="text-sm text-muted-foreground">{inventoryData.length} medicines tracked</p>
        </div>
        <button className="h-9 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90">
          + Add Medicine
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or batch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 border border-input rounded-md bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="flex bg-muted rounded-md p-0.5 gap-0.5">
          {(["all", "low-stock", "expiring"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs font-medium rounded capitalize ${
                filter === f
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              {f === "low-stock" ? "Low Stock" : f === "expiring" ? "Expiring" : "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm table-zebra">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-2.5 text-muted-foreground font-medium">Medicine</th>
              <th className="text-left px-4 py-2.5 text-muted-foreground font-medium">Batch</th>
              <th className="text-left px-4 py-2.5 text-muted-foreground font-medium">Expiry</th>
              <th className="text-right px-4 py-2.5 text-muted-foreground font-medium">Purchase ₹</th>
              <th className="text-right px-4 py-2.5 text-muted-foreground font-medium">Selling ₹</th>
              <th className="text-right px-4 py-2.5 text-muted-foreground font-medium">Retail</th>
              <th className="text-right px-4 py-2.5 text-muted-foreground font-medium">Wholesale</th>
              <th className="text-center px-4 py-2.5 text-muted-foreground font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((med) => {
              const expiryStatus = getExpiryStatus(med.expiry);
              const stockStatus = getStockStatus(med.retailQty);
              return (
                <tr key={med.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-2.5">
                    <div className="font-medium text-foreground">{med.name}</div>
                    <div className="text-xs text-muted-foreground">{med.category}</div>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{med.batch}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`font-mono text-xs ${
                        expiryStatus === "expired"
                          ? "text-destructive font-semibold"
                          : expiryStatus === "critical"
                          ? "text-destructive"
                          : expiryStatus === "warning"
                          ? "text-warning"
                          : "text-foreground"
                      }`}
                    >
                      {med.expiry}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-foreground">₹{med.purchasePrice}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-foreground">₹{med.sellingPrice}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-foreground">{med.retailQty}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-foreground">{med.wholesaleQty}</td>
                  <td className="px-4 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {stockStatus === "low" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-destructive/10 text-destructive">
                          <AlertTriangle className="w-3 h-3" /> LOW
                        </span>
                      )}
                      {expiryStatus === "critical" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-destructive/10 text-destructive">
                          EXPIRING
                        </span>
                      )}
                      {stockStatus === "ok" && expiryStatus === "ok" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-success/10 text-success">
                          OK
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">
            No medicines match your search
          </div>
        )}
      </div>
    </div>
  );
}
