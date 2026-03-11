"use client";
// ============================================================
// app/admin/orders/page.tsx — Orders (API-connected)
// ============================================================
import { useState, useEffect } from "react";
import { formatPrice, STATUS_COLORS } from "@/lib/utils";
import { ChevronDown, Package, Loader } from "lucide-react";

const STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
] as const;
type OrderStatus = (typeof STATUSES)[number];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const handleStatusUpdate = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o)),
      );
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="p-6 xl:p-8">
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-champagne">
          Sales
        </p>
        <h1 className="font-display text-4xl font-light mt-1">Orders</h1>
      </div>

      <div className="flex gap-1.5 flex-wrap mb-6">
        {(["all", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-all ${filter === s ? "bg-obsidian text-ivory border-obsidian" : "border-sand text-slate hover:border-charcoal"}`}
          >
            {s === "all"
              ? `All (${orders.length})`
              : `${s} (${orders.filter((o) => o.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-slate">
          <Loader size={18} className="animate-spin" />
          <span className="font-mono text-xs tracking-widest">
            Loading orders…
          </span>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const isExpanded = expanded === order.id;
            const items = (order.items as Record<string, unknown>[]) || [];
            return (
              <div key={order.id as string} className="admin-card">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setExpanded(isExpanded ? null : (order.id as string))
                  }
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-sand/20 flex items-center justify-center">
                      <Package size={16} className="text-slate" />
                    </div>
                    <div>
                      <p className="font-body text-sm font-medium">
                        {order.customerName as string}
                      </p>
                      <p className="font-mono text-[10px] text-slate tracking-wider">
                        {(order.id as string).slice(-10).toUpperCase()} ·{" "}
                        {new Date(
                          order.createdAt as string,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`status-badge hidden sm:inline-flex ${STATUS_COLORS[order.status as keyof typeof STATUS_COLORS]}`}
                    >
                      {order.status as string}
                    </span>
                    <p className="font-display text-lg">
                      {formatPrice(order.total as number)}
                    </p>
                    <ChevronDown
                      size={16}
                      className={`text-slate transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-5 pt-5 border-t border-[#EDE8DF] animate-fade-in">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <p className="font-mono text-[10px] tracking-widest uppercase text-slate mb-3">
                          Items
                        </p>
                        <div className="space-y-2">
                          {items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="flex-1">
                                <p className="font-body text-sm">
                                  {item.outfitName as string}
                                </p>
                                <p className="font-mono text-[10px] text-slate">
                                  Size {item.size as string} ×{" "}
                                  {item.quantity as number}
                                </p>
                              </div>
                              <p className="font-body text-sm">
                                {formatPrice(
                                  (item.price as number) *
                                    (item.quantity as number),
                                )}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-sand/30">
                          <p className="font-mono text-[10px] tracking-widest uppercase text-slate mb-1">
                            Payment Method
                          </p>
                          <p className="font-body text-sm">
                            {order.paymentMethod as string}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="font-mono text-[10px] tracking-widest uppercase text-slate mb-2">
                            Customer
                          </p>
                          <p className="font-body text-sm">
                            {order.customerName as string}
                          </p>
                          <p className="font-body text-sm text-slate">
                            {order.customerEmail as string}
                          </p>
                          <p className="font-body text-sm text-slate">
                            {order.customerPhone as string}
                          </p>
                          <p className="font-body text-xs text-slate mt-1">
                            {order.shippingAddress as string}
                          </p>
                          {order.notes ? (
                            <p className="font-body text-xs text-slate italic mt-1">
                              {String(order.notes)}
                            </p>
                          ) : null}
                        </div>
                        <div>
                          <p className="font-mono text-[10px] tracking-widest uppercase text-slate mb-2">
                            Update Status
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {STATUSES.map((s) => (
                              <button
                                key={s}
                                disabled={updating === order.id}
                                onClick={() =>
                                  handleStatusUpdate(order.id as string, s)
                                }
                                className={`font-mono text-[10px] tracking-wider uppercase px-2 py-1 border transition-all ${order.status === s ? "bg-obsidian text-ivory border-obsidian" : "border-sand text-slate hover:border-charcoal"}`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="admin-card text-center py-12">
              <p className="font-display text-2xl text-slate mb-2">
                No orders yet
              </p>
              <p className="font-body text-sm text-slate">
                Orders placed by customers will appear here.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
