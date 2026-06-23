"use client";

import { useEffect, useState, useMemo } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatRupiah } from "@/lib/format";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderItem {
  menuId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  totalPrice: number;
  paymentStatus: "paid" | "unpaid";
  orderStatus: string;
  createdAt: Timestamp | null;
  items: OrderItem[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const CHART_COLORS = ["#4F46E5", "#818CF8", "#A5B4FC", "#C7D2FE", "#E0E7FF"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay()); // Minggu = hari ke-0
  d.setHours(0, 0, 0, 0);
  return d;
}

function pctChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function formatRupiahShort(val: number): string {
  if (val >= 1_000_000) return `Rp${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `Rp${(val / 1_000).toFixed(0)}K`;
  return `Rp${val}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  pct,
  isLoading,
}: {
  label: string;
  value: string;
  pct: number | null;
  isLoading: boolean;
}) {
  const isPositive = pct !== null && pct >= 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
        {label}
      </p>
      {isLoading ? (
        <div className="h-8 w-32 bg-gray-100 rounded-lg animate-pulse" />
      ) : (
        <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
      )}
      {pct !== null && !isLoading && (
        <p
          className={`text-xs font-semibold ${isPositive ? "text-green-500" : "text-red-500"}`}
        >
          {isPositive ? "+" : ""}
          {pct.toFixed(1)}% from last week
        </p>
      )}
    </div>
  );
}

function ChartCard({
  title,
  children,
  isLoading,
}: {
  title: string;
  children: React.ReactNode;
  isLoading: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="text-sm font-bold text-gray-900 mb-4">{title}</p>
      {isLoading ? (
        <div className="h-52 bg-gray-50 rounded-xl animate-pulse" />
      ) : (
        children
      )}
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function RevenueTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 shadow-lg rounded-xl px-3 py-2 text-xs">
      <p className="font-semibold text-gray-500 mb-1">{label}</p>
      <p className="font-bold text-indigo-600">
        {formatRupiah(payload[0].value)}
      </p>
    </div>
  );
}

function TrafficTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 shadow-lg rounded-xl px-3 py-2 text-xs">
      <p className="font-semibold text-gray-500 mb-1">{label}</p>
      <p className="font-bold text-orange-500">{payload[0].value} pesanan</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StatisticsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch semua paid orders dalam 2 minggu terakhir (untuk perbandingan minggu ini vs lalu)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        const q = query(
          collection(db, "orders"),
          where("paymentStatus", "==", "paid"),
          where("createdAt", ">=", Timestamp.fromDate(twoWeeksAgo)),
        );

        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Order[];

        setOrders(data);
      } catch (err) {
        console.error("Gagal fetch orders:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ── Derived stats ─────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const now = new Date();
    const thisWeekStart = startOfWeek(now);
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const thisWeek = orders.filter((o) => {
      const d = o.createdAt?.toDate();
      return d && d >= thisWeekStart;
    });

    const lastWeek = orders.filter((o) => {
      const d = o.createdAt?.toDate();
      return d && d >= lastWeekStart && d < thisWeekStart;
    });

    const revenue = (list: Order[]) =>
      list.reduce((s, o) => s + o.totalPrice, 0);
    const avgTicket = (list: Order[]) =>
      list.length ? revenue(list) / list.length : 0;

    return {
      thisWeekRevenue: revenue(thisWeek),
      lastWeekRevenue: revenue(lastWeek),
      thisWeekOrders: thisWeek.length,
      lastWeekOrders: lastWeek.length,
      thisWeekAvg: avgTicket(thisWeek),
      lastWeekAvg: avgTicket(lastWeek),
    };
  }, [orders]);

  // ── Daily Revenue (7 hari terakhir) ──────────────────────────────────────

  const dailyRevenueData = useMemo(() => {
    const result: { day: string; revenue: number }[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayStart = startOfDay(d);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const dayOrders = orders.filter((o) => {
        const od = o.createdAt?.toDate();
        return od && od >= dayStart && od < dayEnd;
      });

      result.push({
        day: DAYS[d.getDay()],
        revenue: dayOrders.reduce((s, o) => s + o.totalPrice, 0),
      });
    }

    return result;
  }, [orders]);

  // ── Hourly Traffic (hari ini) ─────────────────────────────────────────────

  const trafficData = useMemo(() => {
    const todayStart = startOfDay(new Date());
    const todayOrders = orders.filter((o) => {
      const d = o.createdAt?.toDate();
      return d && d >= todayStart;
    });

    // Jam operasional: 08.00 – 20.00
    const hours = Array.from({ length: 13 }, (_, i) => i + 8);
    return hours.map((h) => {
      const count = todayOrders.filter((o) => {
        const d = o.createdAt?.toDate();
        return d && d.getHours() === h;
      }).length;
      return {
        time: `${String(h).padStart(2, "0")}:00`,
        orders: count,
      };
    });
  }, [orders]);

  // ── Best Selling Items ────────────────────────────────────────────────────

  const bestSellingData = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now);

    const thisWeekOrders = orders.filter((o) => {
      const d = o.createdAt?.toDate();
      return d && d >= weekStart;
    });

    const itemMap: Record<string, { name: string; qty: number }> = {};

    thisWeekOrders.forEach((order) => {
      order.items?.forEach((item) => {
        if (!itemMap[item.menuId]) {
          itemMap[item.menuId] = { name: item.name, qty: 0 };
        }
        itemMap[item.menuId].qty += item.quantity;
      });
    });

    return Object.values(itemMap)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5)
      .map((item) => ({ name: item.name, value: item.qty }));
  }, [orders]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Statistics Dashboard
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Overview of your F&amp;B performance.
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Weekly Revenue"
          value={formatRupiah(stats.thisWeekRevenue)}
          pct={pctChange(stats.thisWeekRevenue, stats.lastWeekRevenue)}
          isLoading={isLoading}
        />
        <StatCard
          label="Total Orders"
          value={stats.thisWeekOrders.toLocaleString("id-ID")}
          pct={pctChange(stats.thisWeekOrders, stats.lastWeekOrders)}
          isLoading={isLoading}
        />
        <StatCard
          label="Avg. Ticket Size"
          value={formatRupiah(stats.thisWeekAvg)}
          pct={pctChange(stats.thisWeekAvg, stats.lastWeekAvg)}
          isLoading={isLoading}
        />
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily Revenue Bar Chart */}
        <ChartCard title="Daily Revenue" isLoading={isLoading}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={dailyRevenueData}
              barSize={28}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                tickFormatter={formatRupiahShort}
                width={52}
              />
              <Tooltip
                content={<RevenueTooltip />}
                cursor={{ fill: "#F3F4F6" }}
              />
              <Bar dataKey="revenue" fill="#4F46E5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Customer Traffic Line Chart */}
        <ChartCard title="Customer Traffic (Today)" isLoading={isLoading}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={trafficData}
              margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                interval={2}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                width={28}
                allowDecimals={false}
              />
              <Tooltip content={<TrafficTooltip />} />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#F97316"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#F97316", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#F97316" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── Best Selling Items Donut ── */}
      <ChartCard title="Best Selling Items" isLoading={isLoading}>
        {bestSellingData.length === 0 ? (
          <div className="h-52 flex items-center justify-center text-gray-300 text-sm">
            Belum ada data penjualan minggu ini
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={bestSellingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {bestSellingData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span className="text-xs text-gray-500">{value}</span>
                  )}
                />
                <Tooltip
                  formatter={(val: number, name: string) => [
                    `${val} terjual`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartCard>
    </div>
  );
}
