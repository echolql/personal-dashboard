import React, { useState, useEffect } from "react"
import { Calendar as CalendarIcon, MapPin, Clock } from "lucide-react"

interface Event {
  id: string
  title: string
  time: string
  location: string
  description?: string
  color: string
}

export default function CalendarWidget({ isFrameless }: { isFrameless?: boolean }) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [needsAuth, setNeedsAuth] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch("/api/calendar/events")
      .then(res => {
        if (res.status === 401) {
          setNeedsAuth(true)
          setLoading(false)
          throw new Error("Unauthorized")
        }
        if (!res.ok) {
          throw new Error("Backend error")
        }
        return res.json()
      })
      .then(data => {
        setEvents(data || [])
        setLoading(false)
      })
      .catch(err => {
        if (err.message !== "Unauthorized") {
          console.error(err)
          setError(true)
        }
        setLoading(false)
      })
  }, [])

  const Content = (
    <div className="flex-1 flex flex-col relative z-10 w-full">
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 animate-pulse">
          Loading events...
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
          <p className="text-rose-400 text-sm font-medium">Backend Offline</p>
          <p className="text-slate-400 text-xs max-w-[200px]">Run the backend server to enable calendar sync.</p>
        </div>
      ) : needsAuth ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-slate-300 text-sm max-w-[200px]">Connect your Google Calendar to see upcoming events.</p>
          <a 
            href="/api/auth/google/login"
            className="px-6 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-all font-medium text-sm"
          >
            Connect Google Calendar
          </a>
        </div>
      ) : events.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">
          No upcoming events found.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {events.map(event => (
            <div key={event.id} className="group/item flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
              <div className={`w-1 h-auto rounded-full ${event.color}`}></div>
              <div className="flex-1">
                <h3 className="text-white font-medium mb-1 group-hover/item:text-emerald-300 transition-colors line-clamp-1">
                  {event.title}
                </h3>
                <div className="flex flex-col gap-1.5 mt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {event.time}
                  </div>
                  {event.location && event.location !== "No Location" && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  )}
                  {event.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {event.description.replace(/<[^>]+>/g, '')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  if (isFrameless) {
    return (
      <div className="w-80">
        <div className="flex items-center gap-2 text-emerald-400 mb-4 drop-shadow-md pl-2">
          <CalendarIcon className="w-7 h-7" />
          <span className="text-2xl font-bold tracking-tight text-white">Agenda</span>
        </div>
        {Content}
      </div>
    )
  }

  return (
    <div className="glass-panel p-6 relative overflow-hidden group flex-1 flex flex-col">
      <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700"></div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2 text-emerald-400">
          <CalendarIcon className="w-5 h-5" />
          <span className="font-medium tracking-tight text-sm">Agenda</span>
        </div>
        <span className="text-xs px-2 py-1 bg-white/5 rounded-full border border-white/10 text-slate-300">
          Google Calendar
        </span>
      </div>

      {Content}
    </div>
  )
}
