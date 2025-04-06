'use client'

import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format } from 'date-fns/format'
import { parse } from 'date-fns/parse'
import { startOfWeek } from 'date-fns/startOfWeek'
import { getDay } from 'date-fns/getDay'
import { enUS } from 'date-fns/locale/en-US'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useState } from 'react'

const locales = { 'en-US': enUS }
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales })

type CalendarEvent = {
    id?: string
    title: string
    start: Date
    end: Date
    priority: 'High' | 'Medium' | 'Low'
}

const CalendarPage = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([])
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
    const [title, setTitle] = useState('')
    const [date, setDate] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [priority, setPriority] = useState('Medium')
    const [sortOption, setSortOption] = useState('date')

    const handleAddEvent = async () => {
        if (!title || !date || !startTime || !endTime) {
            alert('Please fill in all fields!')
            return
        }

        const start = new Date(`${date}T${startTime}`)
        const end = new Date(`${date}T${endTime}`)

        if (start >= end) {
            alert('End time must be after start time')
            return
        }

        try {
            const res = await fetch('/api/studysession', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ location: title, eventTime: start })
            })

            const data = await res.json()

            const newEvent: CalendarEvent = {
                id: data.id, // ✅ use ID from backend if it's returned
                title: data.location, // ✅ your backend uses `location` not `title`
                start: new Date(data.eventTime),
                end: new Date(new Date(data.eventTime).getTime() + 60 * 60 * 1000),
                priority,
            }
            setEvents([...events, newEvent])



            setEvents([...events, newEvent])

            // ✅ Clear form & deselect
            setTitle('')
            setDate('')
            setStartTime('')
            setEndTime('')
            setPriority('Medium')
            setSelectedEvent(null)

        } catch (error) {
            console.error('Error creating event:', error)
            alert('Failed to create event')
        }
    }



    const handleDeleteEvent = async () => {
        if (!selectedEvent || !selectedEvent.id) {
            alert('No event selected to delete.')
            return
        }

        try {
            const res = await fetch(`/api/studysession/${selectedEvent.id}`, {
                method: 'DELETE',
            })

            if (!res.ok) {
                throw new Error('Failed to delete on server')
            }

            // Remove from UI
            setEvents(events.filter((e) => e.id !== selectedEvent.id))

            // Reset form
            setTitle('')
            setDate('')
            setStartTime('')
            setEndTime('')
            setPriority('Medium')
            setSelectedEvent(null)

        } catch (error) {
            console.error('Delete error:', error)
            alert('Failed to delete the event')
        }
    }




    const handleUpdateEvent = async () => {
        if (!selectedEvent || !selectedEvent.id) {
            alert("No event selected for update.")
            return
        }

        const updatedStart = new Date(`${date}T${startTime}`)
        const updatedEnd = new Date(`${date}T${endTime}`)

        try {
            const res = await fetch(`/api/studysession/${selectedEvent.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    location: title,
                    eventTime: updatedStart,
                }),
            })

            const updatedSession: CalendarEvent = await res.json()

            const updatedEvent = {
                id: updatedSession.id,
                title: updatedSession.location,
                start: new Date(updatedSession.eventTime),
                end: new Date(updatedEnd),
                priority,
            }

            const updatedList = events.map((e) =>
                e.id === selectedEvent.id ? updatedEvent : e
            )

            setEvents(updatedList)
            setSelectedEvent(null)
            setTitle('')
            setDate('')
            setStartTime('')
            setEndTime('')
            setPriority('Medium')
        } catch (error) {
            console.error("Failed to update event", error)
        }
    }


    const sortedEvents = [...events].sort((a, b) => {
        if (sortOption === 'priority') {
            const levels = { High: 0, Medium: 1, Low: 2 }
            return levels[a.priority] - levels[b.priority]
        } else {
            return new Date(a.start) - new Date(b.start)
        }
    })

    return (
        <div className="flex">
            {/* To-Do List Panel */}
            <div className="w-1/4 p-4 bg-gray-100 h-screen overflow-y-auto border-r">
                <h2 className="text-lg font-semibold mb-4">📋 Event List</h2>
                <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="mb-4 p-1 border rounded text-sm w-full"
                >
                    <option value="date">Sort by Date</option>
                    <option value="priority">Sort by Priority</option>
                </select>
                {sortedEvents.map((event, index) => (
                    <div key={index} className="bg-white shadow rounded p-3 mb-3 border-l-4 border-purple-400">
                        <div className="font-semibold text-sm">{event.title}</div>
                        <div className="text-xs text-gray-500">
                            {event.start.toLocaleString()} - {event.end.toLocaleTimeString()}
                        </div>
                        <span className={`text-xs px-2 py-1 mt-1 inline-block rounded-full 
              ${event.priority === 'High' ? 'bg-red-200 text-red-800' :
                            event.priority === 'Medium' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}
                        >
              {event.priority}
            </span>
                    </div>
                ))}
            </div>

            {/* Main Calendar Panel */}
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">📅 Weekly Calendar</h1>

                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                    <input type="text" placeholder="Event Title" className="border p-2 rounded" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <input type="date" className="border p-2 rounded" value={date} onChange={(e) => setDate(e.target.value)} />
                    <input type="time" className="border p-2 rounded" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                    <input type="time" className="border p-2 rounded" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                    <select className="border p-2 rounded" value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>

                <div className="flex space-x-4 mb-6">
                    <button onClick={handleAddEvent} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
                        Add Event
                    </button>
                    <button onClick={handleDeleteEvent} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-200">
                        Delete Event
                    </button>
                    <button onClick={handleUpdateEvent} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-200">
                        Update Event
                    </button>
                </div>

                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '80vh' }}
                    views={['week']}
                    defaultView="week"
                    onSelectEvent={(event) => {
                        setSelectedEvent(event)
                        setTitle(event.title)
                        setDate(event.start.toISOString().slice(0, 10))
                        setStartTime(event.start.toTimeString().slice(0, 5))
                        setEndTime(event.end.toTimeString().slice(0, 5))
                        setPriority(event.priority)
                    }}
                />
            </div>
        </div>
    )
}

export default CalendarPage;