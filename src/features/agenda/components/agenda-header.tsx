"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

interface AgendaHeaderProps {
  selectedDate: string;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
}

export function AgendaHeader({
  selectedDate,
  onPreviousDay,
  onNextDay,
  onToday,
}: AgendaHeaderProps) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">
          Agenda del día
        </h1>

        <p className="text-sm text-muted-foreground">
          Vista por recurso de las reservas confirmadas y
          pendientes para la fecha seleccionada.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Fecha
          </label>

          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(event) =>
                onDateChange(event.target.value)
              }
              className="h-10 rounded-md border bg-background px-3 pr-10 text-sm"
            />

            <CalendarDays
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onPreviousDay}
          className="flex h-10 w-10 items-center justify-center rounded-md border"
          aria-label="Día anterior"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          type="button"
          onClick={onToday}
          className="h-10 rounded-md border px-4 text-sm"
        >
          Hoy
        </button>

        <button
          type="button"
          onClick={onNextDay}
          className="flex h-10 w-10 items-center justify-center rounded-md border"
          aria-label="Día siguiente"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  function onDateChange(date: string) {
    // Esta función será reemplazada por el callback del padre.
  }
}