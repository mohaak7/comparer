"use client";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

type PricePoint = {
    date: string;
    price: number;
    store: string;
};

interface PriceChartProps {
    data: PricePoint[];
}

// Group data by store for multi-line chart
function groupByStore(data: PricePoint[]) {
    const stores = [...new Set(data.map((d) => d.store))];
    const dateMap = new Map<string, Record<string, number>>();

    for (const point of data) {
        const dateKey = new Date(point.date).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
        });
        if (!dateMap.has(dateKey)) {
            dateMap.set(dateKey, {});
        }
        dateMap.get(dateKey)![point.store] = point.price;
    }

    const chartData = Array.from(dateMap.entries()).map(([fecha, prices]) => ({
        fecha,
        ...prices,
    }));

    return { chartData, stores };
}

const COLORS = [
    "#2563eb",             // blue-600 (primary)
    "#16a34a",             // green-600
    "#ea580c",             // orange-600
    "#9333ea",             // purple-600
    "#dc2626",             // red-600
];

export function PriceChart({ data }: PriceChartProps) {
    if (data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center rounded-lg bg-muted/50 border border-dashed text-muted-foreground">
                <p className="text-sm">No hay datos de precios disponibles todavía</p>
            </div>
        );
    }

    const { chartData, stores } = groupByStore(data);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                    dataKey="fecha"
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                />
                <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v: number) => `${v}€`}
                    className="text-muted-foreground"
                />
                <Tooltip
                    formatter={(value) => [`${Number(value).toFixed(2)}€`, "Precio"]}
                    labelFormatter={(label) => `Fecha: ${label}`}
                    contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid hsl(var(--border))",
                        backgroundColor: "hsl(var(--card))",
                        color: "hsl(var(--card-foreground))",
                    }}
                />
                <Legend />
                {stores.map((store, i) => (
                    <Line
                        key={store}
                        type="monotone"
                        dataKey={store}
                        stroke={COLORS[i % COLORS.length]}
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                        name={store}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
}
