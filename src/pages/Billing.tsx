import { supabase } from "@/integrations/supabase/client";
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

export default function Billing() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [billingMode, setBillingMode] = useState<"retail" | "wholesale">("retail");
  const searchRef = useRef<HTMLInputElement>(null);

  // 🔍 SEARCH FROM SUPABASE
  const handleSearch = async (value: string) => {
    setSearch(value);

    if (!value) {
      setResults([]);
      return;
    }

    const { data, error } = await supabase
      .from("medicines")
      .select("*")
      .ilike("name", `%${value}%`);

    if (error) {
      console.error(error);
      return;
    }

    setResults(data || []);
  };

  // ➕ ADD TO CART
  const addToCart = (med: any) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === med.id.toString());
      if (existing) {
        return prev.map((c) =>
          c.id === med.id.toString() ? { ...c, qty: c.qty + 1 } : c
        );
      }

      return [
        ...prev,
        {
          id: med.id.toString(),
          name: med.name,
          batch: med.batch || "N/A",
          price: med.selling_price,
          qty: 1,
          gst: 12,
        },
      ];
    });

    setSearch("");
    setResults([]);
    searchRef.current?.focus();
  };

  // 🔄 UPDATE QTY
  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    );
  };

  // ❌ REMOVE ITEM
  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  // 💰 CALCULATIONS
  const subtotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const totalGst = cart.reduce(
    (sum, c) => sum + (c.price * c.qty * c.gst) / 100,
    0
  );
  const grandTotal = subtotal + totalGst;

  // 🧾 SAVE SALE TO SUPABASE
  const createSale = async () => {
    if (cart.length === 0) return;

    const { data: sale, error } = await supabase
      .from("sales")
      .insert([{ total: grandTotal }])
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    for (let item of cart) {
      await supabase.from("sale_items").insert([
        {
          sale_id: sale.id,
          medicine_id: parseInt(item.id),
          quantity: item.qty,
          price: item.price,
        },
      ]);

      await supabase.rpc("decrease_stock", {
        med_id: parseInt(item.id),
        qty: item.qty,
      });
    }

    alert("Sale completed ✅");
    setCart([]);
  };

  // ⌨️ SHORTCUTS
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "F9") {
        e.preventDefault();
        createSale();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cart]);

  return (
    <div className="h-screen flex flex-col">
      <div className="h-14 border-b px-4 flex items-center gap-4">
        <h1 className="text-base font-semibold">Billing</h1>

        <div className="flex bg-muted rounded-md p-0.5">
          <button onClick={() => setBillingMode("retail")}>Retail</button>
          <button onClick={() => setBillingMode("wholesale")}>Wholesale</button>
        </div>

        <div className="flex-1 max-w-lg relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
          <input
            ref={searchRef}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search medicine..."
            className="w-full h-9 pl-9 border rounded-md"
          />

          {results.length > 0 && (
            <div className="absolute w-full bg-white border mt-1 max-h-60 overflow-y-auto">
              {results.map((med) => (
                <button
                  key={med.id}
                  onClick={() => addToCart(med)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100"
                >
                  {med.name} ₹{med.selling_price}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="flex-[7] overflow-y-auto">
          {cart.map((item, i) => (
            <div key={item.id} className="flex justify-between p-2 border-b">
              <span>{item.name}</span>
              <span>₹{item.price}</span>
              <button onClick={() => updateQty(item.id, -1)}>
                <Minus />
              </button>
              <span>{item.qty}</span>
              <button onClick={() => updateQty(item.id, 1)}>
                <Plus />
              </button>
              <button onClick={() => removeItem(item.id)}>
                <Trash2 />
              </button>
            </div>
          ))}
        </div>

        <div className="flex-[3] p-4 border-l">
          <h2>Summary</h2>
          <p>Items: {cart.length}</p>
          <p>Total: ₹{grandTotal.toFixed(2)}</p>

          <button
            onClick={createSale}
            className="w-full h-12 bg-blue-500 text-white mt-4"
          >
            <Printer /> Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
