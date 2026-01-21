"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import {
    ChevronLeft,
    ChevronRight,
    Download,
    Calendar as CalendarIcon,
    Eye,
    Plus,
    Bell,
    X,
    Clock,
    CheckCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type TripEvent = {
    id: number
    booking_id: number
    customer_name: string
    package_title: string
    travel_date: string
    duration: number
    status: string
    booking_code: string
}

type Reminder = {
    id: number
    title: string
    description: string | null
    reminder_date: string
    reminder_time: string | null
    type: string
    priority: string
    booking_id: number | null
    completed: boolean
}

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [events, setEvents] = useState<TripEvent[]>([])
    const [reminders, setReminders] = useState<Reminder[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showReminderModal, setShowReminderModal] = useState(false)
    const [showReminderDetails, setShowReminderDetails] = useState(false)
    const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null)
    const [isEditMode, setIsEditMode] = useState(false)
    const [selectedDate, setSelectedDate] = useState<string>("")
    const [reminderForm, setReminderForm] = useState({
        title: "",
        description: "",
        reminder_time: "09:00",
        type: "GENERAL",
        priority: "MEDIUM"
    })

    useEffect(() => {
        fetchTripEvents()
        fetchReminders()
    }, [currentDate])

    const fetchTripEvents = async () => {
        try {
            const { data, error } = await supabase
                .from("booking_items")
                .select(`
                    id,
                    booking_id,
                    title,
                    travel_date,
                    booking:bookings(
                        id,
                        booking_code,
                        status,
                        customer:customers(full_name)
                    )
                `)
                .not('travel_date', 'is', null)
                .order('travel_date', { ascending: true })

            if (error) throw error

            const formatted: TripEvent[] = (data || []).map((item: any) => ({
                id: item.id,
                booking_id: item.booking?.id || 0,
                customer_name: item.booking?.customer?.full_name || 'N/A',
                package_title: item.title,
                travel_date: item.travel_date,
                duration: 5,
                status: item.booking?.status || 'UNKNOWN',
                booking_code: item.booking?.booking_code || ''
            }))

            setEvents(formatted)
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchReminders = async () => {
        try {
            const { data, error } = await supabase
                .from("reminders")
                .select("*")
                .order('reminder_date', { ascending: true })

            if (error) throw error
            setReminders((data as any) || [])
        } catch (e) {
            console.error(e)
        }
    }

    const handleCreateReminder = async () => {
        if (!reminderForm.title || !selectedDate) {
            toast.error("Completa el título y fecha")
            return
        }

        try {
            if (isEditMode && selectedReminder) {
                // Update existing reminder
                const { error } = await supabase
                    .from("reminders")
                    .update({
                        title: reminderForm.title,
                        description: reminderForm.description || null,
                        reminder_date: selectedDate,
                        reminder_time: reminderForm.reminder_time || null,
                        type: reminderForm.type,
                        priority: reminderForm.priority
                    })
                    .eq('id', selectedReminder.id)

                if (error) throw error
                toast.success("Recordatorio actualizado")
            } else {
                // Create new reminder
                const { error } = await supabase
                    .from("reminders")
                    .insert({
                        title: reminderForm.title,
                        description: reminderForm.description || null,
                        reminder_date: selectedDate,
                        reminder_time: reminderForm.reminder_time || null,
                        type: reminderForm.type,
                        priority: reminderForm.priority,
                        completed: false
                    })

                if (error) throw error
                toast.success("Recordatorio creado")
            }

            setShowReminderModal(false)
            setIsEditMode(false)
            setSelectedReminder(null)
            setReminderForm({
                title: "",
                description: "",
                reminder_time: "09:00",
                type: "GENERAL",
                priority: "MEDIUM"
            })
            fetchReminders()
        } catch (e) {
            console.error(e)
            toast.error(isEditMode ? "Error al actualizar recordatorio" : "Error al crear recordatorio")
        }
    }

    const handleDeleteReminder = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este recordatorio?")) return

        try {
            const { error } = await supabase
                .from("reminders")
                .delete()
                .eq('id', id)

            if (error) throw error
            toast.success("Recordatorio eliminado")
            setShowReminderDetails(false)
            setSelectedReminder(null)
            fetchReminders()
        } catch (e) {
            console.error(e)
            toast.error("Error al eliminar recordatorio")
        }
    }

    const openReminderDetails = (reminder: Reminder) => {
        setSelectedReminder(reminder)
        setShowReminderDetails(true)
    }

    const openEditReminder = (reminder: Reminder) => {
        setSelectedReminder(reminder)
        setSelectedDate(reminder.reminder_date)
        setReminderForm({
            title: reminder.title,
            description: reminder.description || "",
            reminder_time: reminder.reminder_time || "09:00",
            type: reminder.type,
            priority: reminder.priority
        })
        setIsEditMode(true)
        setShowReminderDetails(false)
        setShowReminderModal(true)
    }

    const toggleReminderComplete = async (id: number, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from("reminders")
                .update({ completed: !currentStatus })
                .eq('id', id)

            if (error) throw error
            fetchReminders()
        } catch (e) {
            console.error(e)
        }
    }

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = firstDay.getDay()

        return { daysInMonth, startingDayOfWeek, year, month }
    }

    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)

    const getEventsForDay = (day: number) => {
        const targetDate = new Date(year, month, day).toISOString().split('T')[0]
        return events.filter(e => e.travel_date?.startsWith(targetDate))
    }

    const getRemindersForDay = (day: number) => {
        const targetDate = new Date(year, month, day).toISOString().split('T')[0]
        return reminders.filter(r => r.reminder_date === targetDate)
    }

    const previousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1))
    }

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1))
    }

    const exportToGoogleCalendar = () => {
        // Export Trips
        const tripEvents = events.map(event => {
            const startDate = new Date(event.travel_date)
            const endDate = new Date(startDate)
            endDate.setDate(endDate.getDate() + event.duration)

            const formatDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

            return `BEGIN:VEVENT
UID:trip-${event.id}-${event.booking_id}@travelagency.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:✈️ Viaje: ${event.package_title}
DESCRIPTION:Cliente: ${event.customer_name}\\nReserva: ${event.booking_code}\\nEstado: ${event.status}
LOCATION:${event.package_title}
STATUS:${event.status === 'CONFIRMED' ? 'CONFIRMED' : 'TENTATIVE'}
BEGIN:VALARM
TRIGGER:-P7D
ACTION:DISPLAY
DESCRIPTION:Recordatorio: Viaje en 7 días
END:VALARM
END:VEVENT`
        })

        // Export Reminders
        const reminderEvents = reminders.map(reminder => {
            const reminderDate = new Date(reminder.reminder_date)

            // If has time, set specific time, otherwise all-day event
            if (reminder.reminder_time) {
                const [hours, minutes] = reminder.reminder_time.split(':')
                reminderDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)
            }

            const formatDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
            const formatAllDayDate = (d: Date) => {
                const year = d.getFullYear()
                const month = String(d.getMonth() + 1).padStart(2, '0')
                const day = String(d.getDate()).padStart(2, '0')
                return `${year}${month}${day}`
            }

            const priorityEmoji = reminder.priority === 'HIGH' ? '🔴' :
                reminder.priority === 'MEDIUM' ? '🟡' : '🟢'

            if (reminder.reminder_time) {
                // Timed event
                const endDate = new Date(reminderDate)
                endDate.setHours(endDate.getHours() + 1) // 1 hour duration

                return `BEGIN:VEVENT
UID:reminder-${reminder.id}@travelagency.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(reminderDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${priorityEmoji} ${reminder.title}
DESCRIPTION:${reminder.description || ''}${reminder.description ? '\\n\\n' : ''}Prioridad: ${reminder.priority}
BEGIN:VALARM
TRIGGER:-PT30M
ACTION:DISPLAY
DESCRIPTION:Recordatorio: ${reminder.title}
END:VALARM
END:VEVENT`
            } else {
                // All-day event
                const nextDay = new Date(reminderDate)
                nextDay.setDate(nextDay.getDate() + 1)

                return `BEGIN:VEVENT
UID:reminder-${reminder.id}@travelagency.com
DTSTAMP:${formatDate(new Date())}
DTSTART;VALUE=DATE:${formatAllDayDate(reminderDate)}
DTEND;VALUE=DATE:${formatAllDayDate(nextDay)}
SUMMARY:${priorityEmoji} ${reminder.title}
DESCRIPTION:${reminder.description || ''}${reminder.description ? '\\n\\n' : ''}Prioridad: ${reminder.priority}
BEGIN:VALARM
TRIGGER:-PT0M
ACTION:DISPLAY
DESCRIPTION:Recordatorio: ${reminder.title}
END:VALARM
END:VEVENT`
            }
        })

        const allEvents = [...tripEvents, ...reminderEvents].join('\n')

        const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Travel Agency//Booking Calendar//ES
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Viajes y Recordatorios
X-WR-TIMEZONE:America/Mexico_City
${allEvents}
END:VCALENDAR`

        const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `calendario-viajes-${year}-${month + 1}.ics`
        link.click()
        URL.revokeObjectURL(url)

        toast.success(`Exportados ${events.length} viajes y ${reminders.length} recordatorios`)
    }

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ]

    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Calendario de Viajes</h1>
                    <p className="text-muted-foreground">Vista de viajes programados y recordatorios</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setSelectedDate(new Date().toISOString().split('T')[0])
                            setShowReminderModal(true)
                        }}
                        className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
                    >
                        <Bell className="w-4 h-4" />
                        Nuevo Recordatorio
                    </button>
                    <button
                        onClick={exportToGoogleCalendar}
                        className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={events.length === 0 && reminders.length === 0}
                    >
                        <Download className="w-4 h-4" />
                        Exportar a Google Calendar
                    </button>
                    <Link href="/admin/sales">
                        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
                            Volver a Ventas
                        </button>
                    </Link>
                </div>
            </div>

            {/* Calendar Navigation */}
            <div className="bg-white border rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">{monthNames[month]} {year}</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={previousMonth}
                            className="p-2 border rounded-lg hover:bg-muted transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={nextMonth}
                            className="p-2 border rounded-lg hover:bg-muted transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                    {/* Day headers */}
                    {dayNames.map(day => (
                        <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
                            {day}
                        </div>
                    ))}

                    {/* Empty cells before month starts */}
                    {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                        <div key={`empty-${i}`} className="min-h-[100px] border border-dashed rounded-lg bg-muted/20" />
                    ))}

                    {/* Calendar days */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1
                        const dayEvents = getEventsForDay(day)
                        const dayReminders = getRemindersForDay(day)
                        const isToday = new Date().getDate() === day &&
                            new Date().getMonth() === month &&
                            new Date().getFullYear() === year

                        return (
                            <div
                                key={day}
                                className={cn(
                                    "min-h-[120px] border rounded-lg p-2 transition-colors relative",
                                    isToday && "border-primary border-2 bg-primary/5",
                                    (dayEvents.length > 0 || dayReminders.length > 0) ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-muted/50"
                                )}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <div className="text-sm font-semibold">{day}</div>
                                    <button
                                        onClick={() => {
                                            setSelectedDate(new Date(year, month, day).toISOString().split('T')[0])
                                            setShowReminderModal(true)
                                        }}
                                        className="p-1 hover:bg-white rounded opacity-0 hover:opacity-100 transition-opacity"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    {/* Trips */}
                                    {dayEvents.slice(0, 1).map(event => (
                                        <Link
                                            key={event.id}
                                            href={`/admin/sales/bookings/${event.booking_id}`}
                                        >
                                            <div
                                                className={cn(
                                                    "text-xs p-1 rounded cursor-pointer hover:opacity-80",
                                                    event.status === 'CONFIRMED' ? "bg-green-100 text-green-800" :
                                                        event.status === 'PENDING' ? "bg-yellow-100 text-yellow-800" :
                                                            "bg-gray-100 text-gray-800"
                                                )}
                                            >
                                                <div className="font-medium truncate">✈️ {event.customer_name}</div>
                                                <div className="truncate opacity-75">{event.package_title}</div>
                                            </div>
                                        </Link>
                                    ))}
                                    {/* Reminders */}
                                    {dayReminders.slice(0, 1).map(reminder => (
                                        <div
                                            key={reminder.id}
                                            onClick={() => openReminderDetails(reminder)}
                                            className={cn(
                                                "text-xs p-1 rounded cursor-pointer hover:opacity-80",
                                                reminder.completed ? "bg-gray-100 text-gray-600 line-through" :
                                                    reminder.priority === 'HIGH' ? "bg-red-100 text-red-800" :
                                                        reminder.priority === 'MEDIUM' ? "bg-orange-100 text-orange-800" :
                                                            "bg-blue-100 text-blue-800"
                                            )}
                                        >
                                            <div className="font-medium truncate">
                                                {reminder.completed ? <CheckCircle className="w-3 h-3 inline mr-1" /> : <Bell className="w-3 h-3 inline mr-1" />}
                                                {reminder.title}
                                            </div>
                                        </div>
                                    ))}
                                    {(dayEvents.length + dayReminders.length) > 2 && (
                                        <div className="text-xs text-muted-foreground text-center">
                                            +{(dayEvents.length + dayReminders.length) - 2} más
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Upcoming Reminders */}
            <div className="bg-white border rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4">Próximos Recordatorios</h3>
                {reminders.filter(r => !r.completed && new Date(r.reminder_date) >= new Date()).slice(0, 5).length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No hay recordatorios pendientes</p>
                ) : (
                    <div className="space-y-2">
                        {reminders.filter(r => !r.completed && new Date(r.reminder_date) >= new Date()).slice(0, 5).map(reminder => (
                            <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <Bell className={cn(
                                        "w-5 h-5",
                                        reminder.priority === 'HIGH' ? "text-red-500" :
                                            reminder.priority === 'MEDIUM' ? "text-orange-500" :
                                                "text-blue-500"
                                    )} />
                                    <div>
                                        <div className="font-medium">{reminder.title}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {new Date(reminder.reminder_date).toLocaleDateString('es-ES', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                            {reminder.reminder_time && ` - ${reminder.reminder_time}`}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleReminderComplete(reminder.id, reminder.completed)}
                                    className="p-2 hover:bg-muted rounded-lg"
                                >
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Reminder Details Modal */}
            {showReminderDetails && selectedReminder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg">Detalles del Recordatorio</h3>
                            <button onClick={() => setShowReminderDetails(false)}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Priority Badge */}
                            <div>
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-sm font-medium",
                                    selectedReminder.priority === 'HIGH' ? "bg-red-100 text-red-800" :
                                        selectedReminder.priority === 'MEDIUM' ? "bg-orange-100 text-orange-800" :
                                            "bg-blue-100 text-blue-800"
                                )}>
                                    {selectedReminder.priority === 'HIGH' ? '🔴 Alta' :
                                        selectedReminder.priority === 'MEDIUM' ? '🟡 Media' :
                                            '🟢 Baja'}
                                </span>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Título</label>
                                <p className="text-lg font-semibold">{selectedReminder.title}</p>
                            </div>

                            {/* Description */}
                            {selectedReminder.description && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Notas</label>
                                    <p className="text-gray-700 whitespace-pre-wrap">{selectedReminder.description}</p>
                                </div>
                            )}

                            {/* Date & Time */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Fecha</label>
                                    <p className="font-medium">
                                        {new Date(selectedReminder.reminder_date).toLocaleDateString('es-ES', {
                                            weekday: 'short',
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                {selectedReminder.reminder_time && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Hora</label>
                                        <p className="font-medium flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {selectedReminder.reminder_time}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Estado</label>
                                <p className="font-medium">
                                    {selectedReminder.completed ? '✅ Completado' : '⏳ Pendiente'}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4 border-t">
                                <button
                                    onClick={() => toggleReminderComplete(selectedReminder.id, selectedReminder.completed)}
                                    className="flex-1 py-2 border rounded-lg hover:bg-muted font-medium"
                                >
                                    {selectedReminder.completed ? 'Marcar Pendiente' : 'Marcar Completado'}
                                </button>
                                <button
                                    onClick={() => openEditReminder(selectedReminder)}
                                    className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDeleteReminder(selectedReminder.id)}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reminder Modal */}
            {showReminderModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-lg">{isEditMode ? 'Editar Recordatorio' : 'Nuevo Recordatorio'}</h3>
                            <button onClick={() => {
                                setShowReminderModal(false)
                                setIsEditMode(false)
                                setSelectedReminder(null)
                            }}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium block mb-1">Título *</label>
                                <input
                                    type="text"
                                    value={reminderForm.title}
                                    onChange={(e) => setReminderForm({ ...reminderForm, title: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Ej: Llamar a cliente"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium block mb-1">Descripción</label>
                                <textarea
                                    value={reminderForm.description}
                                    onChange={(e) => setReminderForm({ ...reminderForm, description: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    rows={3}
                                    placeholder="Detalles adicionales..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm font-medium block mb-1">Fecha *</label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium block mb-1">Hora</label>
                                    <input
                                        type="time"
                                        value={reminderForm.reminder_time}
                                        onChange={(e) => setReminderForm({ ...reminderForm, reminder_time: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium block mb-1">Prioridad</label>
                                <select
                                    value={reminderForm.priority}
                                    onChange={(e) => setReminderForm({ ...reminderForm, priority: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="LOW">🟢 Baja</option>
                                    <option value="MEDIUM">🟡 Media</option>
                                    <option value="HIGH">🔴 Alta</option>
                                </select>
                            </div>

                            <button
                                onClick={handleCreateReminder}
                                className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                            >
                                {isEditMode ? 'Actualizar Recordatorio' : 'Crear Recordatorio'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
