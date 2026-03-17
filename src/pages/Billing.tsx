import { useState, useRef, useEffect } from "react";
import { Search, Plus, Minus, Trash2, Printer } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  batch: string;
  price: number;
  qty: number;
  gst: number;
}

const medicineDB = [
  { id: "1", name: "Dolo 650mg", batch: "D2024-401", price: 32, gst: 12, stock: 120 },
  { id: "2", name: "Azithromycin 500mg", batch: "A2024-220", price: 85, gst: 12, stock: 45 },
  { id: "3", name: "Pan 40mg", batch: "P2024-318", price: 48, gst: 12, stock: 200 },
  { id: "4", name: "Crocin Advance", batch: "C2024-155", price: 28, gst: 5, stock: 88 },
  { id: "5", name: "Shelcal 500mg", batch: "S2024-090", price: 145, gst: 12, stock: 60 },
  { id: "6", name: "Amoxicillin 250mg", batch: "AM2024-089", price: 65, gst: 12, stock: 30 },
  { id: "7", name: "Cetirizine 10mg", batch: "CE2024-112", price: 18, gst: 12, stock: 150 },
  { id: "8", name: "Metformin 500mg", batch: "M2024-078", price: 22, gst: 5, stock: 300 },
];

export default function Billing() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<typeof medicineDB>([]);
  const [billingMode, setBillingMode] = useState<"retail" | "wholesale">("retail");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "F9") {
        e.preventDefault();
        handlePrint();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cart]);

  const handleSearch = (value: string) => {
    setSearch(value);
    if (value.length > 0) {
      setResults(
        medicineDB.filter(
          (m) =>
            m.name.toLowerCase().includes(value.toLowerCase()) ||
            m.batch.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setResults([]);
    }
  };

  const addToCart = (med: typeof medicineDB[0]) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === med.id);
      if (existing) {
        return prev.map((c) =>
          c.id === med.id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prev, { id: med.id, name: med.name, batch: med.batch, price: med.price, qty: 1, gst: med.gst }];
    });
    setSearch("");
    setResults([]);
    searchRef.current?.focus();
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const totalGst = cart.reduce(
    (sum, c) => sum + (c.price * c.qty * c.gst) / 100,
    0
  );
  const grandTotal = subtotal + totalGst;

  const handlePrint = () => {
    if (cart.length === 0) return;
    alert(`Invoice generated!\nTotal: ₹${grandTotal.toFixed(2)}\nItems: ${cart.length}`);
    setCart([]);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header Bar */}
      <div className="h-14 border-b border-border bg-card px-4 flex items-center gap-4">
        <h1 className="text-base font-semibold text-foreground">Billing</h1>

        {/* Mode toggle */}
        <div className="flex bg-muted rounded-md p-0.5 gap-0.5">
          <button
            onClick={() => setBillingMode("retail")}
            className={`px-3 py-1 text-xs font-medium rounded ${
              billingMode === "retail"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            }`}
          >
            Retail
          </button>
          <button
            onClick={() => setBillingMode("wholesale")}
            className={`px-3 py-1 text-xs font-medium rounded ${
              billingMode === "wholesale"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            }`}
          >
            Wholesale
          </button>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-lg relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search medicine or scan barcode... (F2)"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 border border-input rounded-md bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {results.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-1 bg-card border border-border rounded-md shadow-sm z-50 max-h-60 overflow-y-auto">
              {results.map((med) => (
                <button
                  key={med.id}
                  onClick={() => addToCart(med)}
                  className="w-full text-left px-3 py-2 hover:bg-accent flex items-center justify-between text-sm border-b border-border last:border-0"
                >
                  <div>
                    <span className="font-medium text-foreground">{med.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">#{med.batch}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-foreground">₹{med.price}</span>
                    <span className="text-xs text-muted-foreground">Stk: {med.stock}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">F2</kbd> Search
          <span className="mx-2">|</span>
          <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">F9</kbd> Print
        </div>
      </div>

      {/* Split Layout: 70/30 */}
      <div className="flex-1 flex overflow-hidden">
        {/* Cart List — 70% */}
        <div className="flex-[7] border-r border-border overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Search and add medicines to start billing
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card border-b border-border">
                <tr>
                  <th className="text-left px-4 py-2.5 text-muted-foreground font-medium">#</th>
                  <th className="text-left px-4 py-2.5 text-muted-foreground font-medium">Medicine</th>
                  <th className="text-left px-4 py-2.5 text-muted-foreground font-medium">Batch</th>
                  <th className="text-right px-4 py-2.5 text-muted-foreground font-medium">Price</th>
                  <th className="text-center px-4 py-2.5 text-muted-foreground font-medium">Qty</th>
                  <th className="text-right px-4 py-2.5 text-muted-foreground font-medium">GST%</th>
                  <th className="text-right px-4 py-2.5 text-muted-foreground font-medium">Total</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, i) => (
                  <tr key={item.id} className="border-b border-border">
                    <td className="px-4 py-2.5 text-muted-foreground">{i + 1}</td>
                    <td className="px-4 py-2.5 font-medium text-foreground">{item.name}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{item.batch}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-foreground">₹{item.price}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center rounded border border-border hover:bg-accent"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-mono font-medium text-foreground">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center rounded border border-border hover:bg-accent"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">{item.gst}%</td>
                    <td className="px-4 py-2.5 text-right font-mono font-medium text-foreground">
                      ₹{(item.price * item.qty).toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Summary Panel — 30% */}
        <div className="flex-[3] bg-card flex flex-col">
          <div className="flex-1 p-4">
            <h2 className="text-sm font-semibold text-foreground mb-4">Invoice Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Items</span>
                <span className="font-mono text-foreground">{cart.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono text-foreground">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">GST</span>
                <span className="font-mono text-foreground">₹{totalGst.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-semibold text-foreground">Grand Total</span>
                <span className="text-2xl font-bold font-mono text-foreground">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Print CTA */}
          <div className="p-4 border-t border-border">
            <button
              onClick={handlePrint}
              disabled={cart.length === 0}
              className="w-full h-12 bg-primary text-primary-foreground rounded-md font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Printer className="w-4 h-4" />
              Print Invoice (F9)
            </button>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              GST Invoice • {billingMode === "retail" ? "Retail" : "Wholesale"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
