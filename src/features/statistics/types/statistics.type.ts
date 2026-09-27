
export type StatisticsPeriod = "week" | "month" | "year";

export interface StatisticsRange {
    startDate: string;
    endDate: string;
}

export interface StatisticsSummary {
    totalReservations: number;
    confirmedReservations: number;
    pendingReservations: number;
    cancelledReservations: number;
    finalizedReservations: number;
    totalRevenue: number;
    totalDeposits: number;
}

export interface StatisticsByResource {
    CANCHA_1: number;
    CANCHA_2: number;
    SALON: number;
}

export interface StatisticsTimeline {
    [key: string]: string | number;
    label: string;
    reservations: number;
}

export interface StatisticsResponse {
    period: StatisticsPeriod;
    range: StatisticsRange;
    summary: StatisticsSummary;
    reservationsByResource: StatisticsByResource;
    reservationsTimeline: StatisticsTimeline[];
}

