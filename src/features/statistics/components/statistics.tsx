"use client";

import { useEffect, useState } from "react";

import {
    CalendarDays,
    TrendingUp,
} from "lucide-react";

import { LineChart } from "./ui/line-chart";
import { BarChart } from "./ui/bar-chart";
import { PieChart } from "./ui/pie-chart";

import {
    StatisticsPeriod,
    StatisticsResponse,
} from "../types/statistics.type";

import { getStatisticsByPeriod } from "../services/statics.service";
import { QuetzalIcon } from "./ui/quetzal-icon";

export default function Statistics() {
    const [period, setPeriod] =
        useState<StatisticsPeriod>("month");

    const [statistics, setStatistics] =
        useState<StatisticsResponse | null>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        const loadStatistics = async () => {
            try {
                setLoading(true);

                const data =
                    await getStatisticsByPeriod(period);

                setStatistics(data);
            } finally {
                setLoading(false);
            }
        };

        loadStatistics();
    }, [period]);

    if (loading || !statistics) {
        return (
            <main className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">
                        Estadísticas
                    </h1>

                    <p className="text-sm text-gray-500">
                        Consulta el rendimiento de tus reservaciones.
                    </p>
                </div>

                <div className="flex items-center justify-center py-20">
                    <p className="text-sm text-gray-500">
                        Cargando estadísticas...
                    </p>
                </div>
            </main>
        );
    }

    const reservationsByResource = [
        {
            resource: "Cancha 1",
            reservations:
                statistics.reservationsByResource.CANCHA_1,
        },
        {
            resource: "Cancha 2",
            reservations:
                statistics.reservationsByResource.CANCHA_2,
        },
        {
            resource: "Salón",
            reservations:
                statistics.reservationsByResource.SALON,
        },
    ];

    const reservationsByStatus = [
        {
            name: "Confirmadas",
            value:
                statistics.summary.confirmedReservations,
        },
        {
            name: "Pendientes",
            value:
                statistics.summary.pendingReservations,
        },
        {
            name: "Canceladas",
            value:
                statistics.summary.cancelledReservations,
        },
        {
            name: "Finalizadas",
            value: statistics.summary.finalizedReservations,
        },
    ];

    return (
        <main className="space-y-6">

            {/* Header */}

            <div>
                <h1 className="text-2xl font-bold">
                    Estadísticas
                </h1>

                <p className="text-sm text-gray-500">
                    Consulta el rendimiento de tus reservaciones.
                </p>
            </div>

            {/* Period */}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h2 className="text-lg font-semibold">
                        Resumen
                    </h2>

                    <p className="text-sm text-gray-500">
                        Información correspondiente a este período.
                    </p>
                </div>

                <select
                    className="rounded-md border px-3 py-2 text-sm outline-none"
                    value={period}
                    onChange={(event) =>
                        setPeriod(
                            event.target.value as StatisticsPeriod,
                        )
                    }
                >
                    <option value="week">
                        Esta semana
                    </option>

                    <option value="month">
                        Este mes
                    </option>

                    <option value="year">
                        Este año
                    </option>
                </select>
            </div>

            {/* Statistics cards */}

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <StatisticCard
                    title="Reservaciones"
                    value={statistics.summary.totalReservations.toString()}
                    description="Durante el período"
                    icon={<CalendarDays size={22} />}
                />

                <StatisticCard
                    title="Reservaciones confirmadas"
                    value={statistics.summary.confirmedReservations.toString()}
                    description="Durante el período"
                    icon={<CalendarDays size={22} />}
                />

                <StatisticCard
                    title="Ingresos"
                    value={`Q${statistics.summary.totalRevenue.toLocaleString("es-GT")}`}
                    description="Total de reservaciones"
                    icon={<QuetzalIcon />}
                />

                <StatisticCard
                    title="Anticipos"
                    value={`Q${statistics.summary.totalDeposits.toLocaleString("es-GT")}`}
                    description="Anticipos registrados"
                    icon={<TrendingUp size={22} />}
                />

            </section>

            {/* Reservations by period */}

            <section className="rounded-lg border bg-white p-5">

                <div className="mb-5">
                    <h2 className="font-semibold">
                        Reservaciones durante el período
                    </h2>

                    <p className="text-sm text-gray-500">
                        Cantidad de reservaciones durante el período seleccionado.
                    </p>
                </div>

               <LineChart
                    data={statistics.reservationsTimeline}
                    xKey="label"
                    dataKey="reservations"
                />

            </section>

            {/* Resource and status charts */}

            <section className="grid gap-6 lg:grid-cols-2">

                <div className="rounded-lg border bg-white p-5">

                    <div className="mb-5">
                        <h2 className="font-semibold">
                            Reservaciones por recurso
                        </h2>

                        <p className="text-sm text-gray-500">
                            Distribución de reservaciones por recurso.
                        </p>
                    </div>

                    <BarChart
                        data={reservationsByResource}
                        xKey="resource"
                        dataKey="reservations"
                    />

                </div>

                <div className="rounded-lg border bg-white p-5">

                    <div className="mb-5">
                        <h2 className="font-semibold">
                            Estado de reservaciones
                        </h2>

                        <p className="text-sm text-gray-500">
                            Distribución según el estado actual.
                        </p>
                    </div>

                    <PieChart
                        data={reservationsByStatus}
                    />

                </div>

            </section>

        </main>
    );
}

function StatisticCard({
    title,
    value,
    description,
    icon,
}: {
    title: string;
    value: string;
    description: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-lg border bg-white p-5">

            <div className="flex items-center justify-between">

                <p className="text-sm text-gray-500">
                    {title}
                </p>

                <div className="rounded-md bg-gray-100 p-2">
                    {icon}
                </div>

            </div>

            <p className="mt-4 text-2xl font-bold">
                {value}
            </p>

            <p className="mt-1 text-xs text-gray-500">
                {description}
            </p>

        </div>
    );
}

