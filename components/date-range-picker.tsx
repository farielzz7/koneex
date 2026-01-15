"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

interface DateRangePickerProps {
  onRangeSelect?: (start: Date | undefined, end: Date | undefined) => void
}

export function DateRangePicker({ onRangeSelect }: DateRangePickerProps) {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [isSelectingEnd, setIsSelectingEnd] = useState(false)

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return

    if (!startDate || (startDate && endDate)) {
      // Iniciando nueva selección
      setStartDate(date)
      setEndDate(undefined)
      setIsSelectingEnd(true)
      onRangeSelect?.(date, undefined)
    } else if (isSelectingEnd && startDate) {
      // Seleccionando fecha final
      if (date < startDate) {
        // Si la fecha final es anterior, intercambiar
        setEndDate(startDate)
        setStartDate(date)
        onRangeSelect?.(date, startDate)
      } else {
        setEndDate(date)
        onRangeSelect?.(startDate, date)
      }
      setIsSelectingEnd(false)
    }
  }

  const formatDateRange = () => {
    if (!startDate) return "¿Cuándo viajas?"

    const startFormatted = startDate.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
    })

    if (!endDate) {
      return `${startFormatted} - ¿Hasta cuándo?`
    }

    const endFormatted = endDate.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
    })

    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const nights = days - 1

    return `${startFormatted} - ${endFormatted} (${days}d / ${nights}n)`
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal border-2 hover:border-primary transition-colors bg-white"
        >
          <Calendar className="mr-2 h-5 w-5 text-primary" />
          <span className={startDate && endDate ? "text-foreground font-semibold" : "text-muted-foreground"}>
            {formatDateRange()}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10">
          <p className="text-sm font-semibold mb-1">
            {!startDate
              ? "Selecciona fecha de salida"
              : !endDate
                ? "Selecciona fecha de regreso"
                : "Fechas seleccionadas"}
          </p>
          {startDate && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>
                Salida: {startDate.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </div>
          )}
          {endDate && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <span>
                Regreso: {endDate.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
              </span>
              <span className="font-bold text-primary">
                ({Math.ceil((endDate.getTime() - startDate!.getTime()) / (1000 * 60 * 60 * 24)) + 1} días /{" "}
                {Math.ceil((endDate.getTime() - startDate!.getTime()) / (1000 * 60 * 60 * 24))} noches)
              </span>
            </div>
          )}
        </div>
        <CalendarComponent
          mode="single"
          selected={isSelectingEnd ? endDate : startDate}
          onSelect={handleDateSelect}
          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          initialFocus
          className="rounded-md"
        />
        {startDate && !endDate && (
          <div className="p-3 border-t bg-primary/5 text-xs text-center font-medium text-primary">
            Ahora selecciona tu fecha de regreso
          </div>
        )}
        {startDate && endDate && (
          <div className="p-3 border-t bg-accent/5 flex items-center justify-between">
            <span className="text-xs font-medium">Duración del viaje</span>
            <span className="text-sm font-bold text-accent">
              {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1} días
            </span>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
