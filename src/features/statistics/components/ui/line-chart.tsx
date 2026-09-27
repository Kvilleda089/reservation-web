
import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface LineChartProps<T extends Record<string, string | number>> {
    data: T[];
    xKey: keyof T;
    dataKey: keyof T;
}

export function LineChart<T extends Record<string, string | number>>({
    data,
    xKey,
    dataKey,
}: LineChartProps<T>) {
    return (
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={xKey as string} />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey={dataKey as string}
                        strokeWidth={2}
                    />
                </RechartsLineChart>
            </ResponsiveContainer>
        </div>
    );
}

