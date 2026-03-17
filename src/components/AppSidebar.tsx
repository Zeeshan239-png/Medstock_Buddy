import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  Package,
  Truck,
  Brain,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/billing", icon: Receipt, label: "Billing" },
  { to: "/inventory", icon: Package, label: "Inventory" },
  { to: "/suppliers", icon: Truck, label: "Suppliers" },
  { to: "/predictions", icon: Brain, label: "AI Insights" },
];

export default function AppSidebar() {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col ${
        expanded ? "w-48" : "w-14"
      }`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-3 border-b border-sidebar-border gap-2">
        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
          M
        </div>
        {expanded && (
          <span className="text-sm font-semibold whitespace-nowrap">MedFlow OS</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 h-10 text-sm font-medium ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary-foreground border-l-2 border-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 border-l-2 border-transparent"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {expanded && <span className="whitespace-nowrap">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Toggle hint */}
      <div className="h-10 flex items-center justify-center border-t border-sidebar-border">
        {expanded ? (
          <ChevronLeft className="w-4 h-4 text-sidebar-foreground/50" />
        ) : (
          <ChevronRight className="w-4 h-4 text-sidebar-foreground/50" />
        )}
      </div>
    </aside>
  );
}
