import api_reservation from "@/src/lib/axios/axios";
import {
    StatisticsPeriod,
    StatisticsResponse,
} from "../types/statistics.type";

export async function getStatisticsByPeriod(
    period: StatisticsPeriod,
): Promise<StatisticsResponse> {

    const response = await api_reservation.get<StatisticsResponse>(
        "/statistics",
        {
            params: {
                period,
            },
        },
    );

    return response.data;
}