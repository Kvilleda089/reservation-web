"use client";

import { useEffect, useState } from "react";
import { AgendaResponse } from "../types/agenda.types";
import { getAgenda } from "../services/agenda.service";
import { getApiErrorMessage } from "@/src/lib/errors/api-error";
import { AgendaResource } from "./agenda-resource";
import { AgendaHeader } from "./agenda-header";
import { PageLoading } from "@/src/components/loading/page-loading";



const RESOURCE_ORDER = [
  "CANCHA_1",
  "CANCHA_2",
  "SALON",
] as const;

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};


const parseDate = (date: string): Date => {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day);
};

export function AgendaView() {

    const [ selectedDate, setSelectedDate] = useState(
        formatDate(new Date()),
    );

    const [ agenda, setAgenda ] = useState<AgendaResponse | null>(null)
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);

    useEffect(()=>{
        const loadAgenda = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getAgenda(selectedDate);
                setAgenda(data);
            } catch (error) {
                console.error(`Error al obtener la agenda: `, getApiErrorMessage(error));
                setError("No fue posible cargar la agenda");
                setAgenda(null);
            }finally {
                setLoading(false);
            }
        };
        loadAgenda();
    }, [selectedDate])


     const handlePreviousDay = () => {
    const date = parseDate(selectedDate);

    date.setDate(date.getDate() - 1);

    setSelectedDate(formatDate(date));
  };

  const handleNextDay = () => {
    const date = parseDate(selectedDate);

    date.setDate(date.getDate() + 1);

    setSelectedDate(formatDate(date));
  };

  const handleToday = () => {
    setSelectedDate(formatDate(new Date()));
  };

  const resources = RESOURCE_ORDER.map((resource) => {
    return agenda?.resources.find(
      (item) => item.resource === resource,
    ) ?? {
      resource,
      reservations: [],
    };
  });

   return (
    <section className="space-y-6">
      <AgendaHeader
        selectedDate={selectedDate}
        onPreviousDay={handlePreviousDay}
        onNextDay={handleNextDay}
        onToday={handleToday}
      />

      {loading && (
        <div className="rounded-lg border p-6 text-center">
           <PageLoading/>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border p-6 text-center">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-6">
          {resources.map((resource) => (
            <AgendaResource
              key={resource.resource}
              resource={resource.resource}
              reservations={resource.reservations}
            />
          ))}
        </div>
      )}
    </section>
  );


}