"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ChartData = {
  [key: string]: string | number;
};

interface BarChartProps {
  data: ChartData[];
  xKey: string;
  dataKey: string;
  height?: number;
}

const COLORS: Record<string, string> = {
  "Cancha 1": "#3B82F6",
  "Cancha 2": "#10B981",
  Salón: "#F59E0B",
};

export function BarChart({
  data,
  xKey,
  dataKey,
  height = 300,
}: BarChartProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 10,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E5E7EB"
            vertical={false}
          />

          <XAxis
            dataKey={xKey}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 13 }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 13 }}
          />

          <Tooltip
            cursor={{ fill: "#F3F4F6" }}
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            }}
            labelStyle={{
              color: "#374151",
              fontWeight: 600,
            }}
          />

          <Bar
            dataKey={dataKey}
            radius={[6, 6, 0, 0]}
            maxBarSize={50}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[String(entry[xKey])] || "#6366F1"}
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}