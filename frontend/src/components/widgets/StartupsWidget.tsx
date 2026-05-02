import React, { useState, useEffect } from "react"
import { Building2, MapPin, Users, Rocket, Newspaper } from "lucide-react"

interface Startup {
  id: string
  name: string
  city: string
  founders: string
  founded: string
  fundingPhase: string
  description: string
  newsLink: string
  website: string
  logoInitial: string
  color: string
}

export default function StartupsWidget() {
  const [startups, setStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/startups")
      .then(res => res.json())
      .then(data => {
        setStartups(data || [])
        setLoading(false)
      })
      .catch(err => {
        console.error("Failed to fetch startups:", err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="glass-panel p-6 h-full flex flex-col relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all duration-700"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2 text-blue-400">
          <Rocket className="w-5 h-5" />
          <h2 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">
            Seattle Startups
          </h2>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative z-10 overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
             {[1, 2, 3, 4, 5, 6].map(i => (
               <div key={i} className="flex flex-col gap-4 p-4 border border-white/5 rounded-xl h-44">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 skeleton shrink-0"></div>
                   <div className="flex-1 flex flex-col gap-2">
                     <div className="h-4 w-3/4 skeleton"></div>
                     <div className="h-2 w-1/4 skeleton"></div>
                   </div>
                 </div>
                 <div className="h-3 w-full skeleton mt-2"></div>
                 <div className="h-3 w-2/3 skeleton"></div>
                 <div className="mt-auto flex justify-between">
                   <div className="h-6 w-20 skeleton rounded-lg"></div>
                   <div className="h-6 w-20 skeleton rounded-lg"></div>
                 </div>
               </div>
             ))}
          </div>
        ) : startups.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            No startups loaded.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...startups]
              .filter(s => parseInt(s.founded) >= 2015)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((startup) => (
              <div 
                key={startup.id} 
              className="group/startup flex flex-col gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-white/10 transition-all duration-300"
            >
              {/* Top Row: Logo, Name, Location */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">

                  <div>
                    <h3 className="text-white font-bold text-base tracking-wide">{startup.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {startup.city}
                    </div>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-semibold tracking-wider">
                  {startup.fundingPhase}
                </div>
              </div>
              
              {/* Description */}
              <p className="text-sm text-slate-300 leading-relaxed mt-1">
                {startup.description}
              </p>

              {/* Bottom Row: Founders, Founded, News */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-2 pt-3 border-t border-white/10">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Users className="w-3.5 h-3.5" />
                    <span className="font-medium text-slate-300">{startup.founders}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Est. {startup.founded}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {startup.website && (
                    <a 
                      href={startup.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-300 border border-white/10 hover:border-indigo-500/30 rounded-lg text-xs text-slate-300 transition-all group/link"
                    >
                      <span>Website</span>
                    </a>
                  )}
                  <a 
                    href={startup.newsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-300 border border-white/10 hover:border-indigo-500/30 rounded-lg text-xs text-slate-300 transition-all group/link"
                  >
                    <Newspaper className="w-3.5 h-3.5" />
                    <span>News</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  )
}
