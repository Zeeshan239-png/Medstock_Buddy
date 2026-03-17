export default function Suppliers() {
  const suppliers = [
    { id: "1", name: "MedPharma Distributors", contact: "Rajesh Kumar", phone: "9876543210", pending: 24500, lastOrder: "2026-03-10" },
    { id: "2", name: "HealthLine Supplies", contact: "Anita Sharma", phone: "9123456780", pending: 0, lastOrder: "2026-03-15" },
    { id: "3", name: "CureAll Traders", contact: "Vikram Singh", phone: "9988776655", pending: 12800, lastOrder: "2026-03-08" },
    { id: "4", name: "GenericMeds India", contact: "Priya Patel", phone: "9654321098", pending: 8200, lastOrder: "2026-03-12" },
  ];

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Suppliers</h1>
          <p className="text-sm text-muted-foreground">{suppliers.length} suppliers</p>
        </div>
        <button className="h-9 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90">
          + Add Supplier
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm table-zebra">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-2.5 text-muted-foreground font-medium">Supplier</th>
              <th className="text-left px-4 py-2.5 text-muted-foreground font-medium">Contact</th>
              <th className="text-left px-4 py-2.5 text-muted-foreground font-medium">Phone</th>
              <th className="text-right px-4 py-2.5 text-muted-foreground font-medium">Pending ₹</th>
              <th className="text-left px-4 py-2.5 text-muted-foreground font-medium">Last Order</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0">
                <td className="px-4 py-2.5 font-medium text-foreground">{s.name}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{s.contact}</td>
                <td className="px-4 py-2.5 font-mono text-foreground">{s.phone}</td>
                <td className={`px-4 py-2.5 text-right font-mono ${s.pending > 0 ? "text-destructive font-medium" : "text-success"}`}>
                  {s.pending > 0 ? `₹${s.pending.toLocaleString()}` : "Cleared"}
                </td>
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{s.lastOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
