import React, { useState, useEffect } from "react"
import { Clock, Calendar as CalendarIcon } from "lucide-react"

export default function DateTimeWidget({ isFrameless }: { isFrameless?: boolean }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  if (isFrameless) {
    return (
      <div className="flex flex-col items-end text-right">
        <div className="text-2xl font-bold text-white tracking-tight drop-shadow-md">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-xs font-medium text-slate-400 drop-shadow-md mt-1 tracking-wide">
          {time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
        </div>
      </div>
    )
  }

  return (
    <div className="glass-panel p-6 flex flex-col gap-2 relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
      
      <div className="flex items-center gap-2 text-blue-400 mb-1">
        <Clock className="w-5 h-5" />
        <span className="font-medium tracking-tight text-sm">Local Time</span>
      </div>
      
      <h2 className="text-5xl font-light tracking-tighter text-white">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </h2>
      
      <div className="flex items-center gap-2 text-slate-300 mt-2">
        <CalendarIcon className="w-4 h-4 text-blue-400/70" />
        <p className="font-medium text-lg">
          {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </div>
  )
}
