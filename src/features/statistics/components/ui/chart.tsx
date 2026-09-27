"use client";

import { ResponsiveContainer } from "recharts";

interface ChartProps {
  children: React.ReactNode;
  height?: number;
}

export function Chart({ children, height = 300 }: ChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}
