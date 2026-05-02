import React, { useState, useEffect } from "react"
import { Cloud, Droplets, Wind, ThermometerSun } from "lucide-react"

// Free Open-Meteo API for Bellevue, WA
// Free Open-Meteo API for Bellevue, WA with daily highs/lows
const WEATHER_API = "https://api.open-meteo.com/v1/forecast?latitude=47.6101&longitude=-122.2015&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto"

export default function WeatherWidget({ isFrameless }: { isFrameless?: boolean }) {
  const [weather, setWeather] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(WEATHER_API)
      .then(res => res.json())
      .then(data => {
        setWeather(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch weather", err)
        setLoading(false)
      })
  }, [])

  if (isFrameless) {
    if (loading) return null;
    const tempF = Math.round((weather?.current_weather?.temperature * 9/5) + 32)
    const highF = weather?.daily?.temperature_2m_max ? Math.round((weather.daily.temperature_2m_max[0] * 9/5) + 32) : null
    const lowF = weather?.daily?.temperature_2m_min ? Math.round((weather.daily.temperature_2m_min[0] * 9/5) + 32) : null
    
    return (
      <div className="flex flex-col items-end text-right">
        <div className="flex items-center gap-2 drop-shadow-md">
          <Cloud className="w-5 h-5 text-amber-400" />
          <span className="text-2xl font-bold text-white">{tempF}°</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-medium text-slate-300 drop-shadow-md mt-0.5 tracking-wider">
          <span>{highF}° H</span>
          <span className="opacity-40">|</span>
          <span>{lowF}° L</span>
        </div>
        <span className="text-[10px] text-slate-400 opacity-80 mt-1">Bellevue, WA</span>
      </div>
    )
  }

  return (
    <div className="glass-panel p-6 relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-700"></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2 text-amber-400">
          <ThermometerSun className="w-5 h-5" />
          <span className="font-medium tracking-tight text-sm">Weather</span>
        </div>
        <span className="text-xs text-slate-400">Bellevue, WA</span>
      </div>

      {weather ? (
        <div className="flex items-end justify-between relative z-10">
          <div>
            <h2 className="text-5xl font-light text-white mb-2">
              {weather.temperature}°C
            </h2>
            <p className="text-slate-300 capitalize flex items-center gap-2">
              <Wind className="w-4 h-4 text-slate-400" />
              Wind: {weather.windspeed} km/h
            </p>
          </div>
          <Cloud className="w-16 h-16 text-slate-200" strokeWidth={1} />
        </div>
      ) : (
        <div className="h-20 flex items-center justify-center text-slate-400 animate-pulse">
          Loading weather...
        </div>
      )}
    </div>
  )
}
