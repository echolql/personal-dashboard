import React from "react"
import { Sparkles, TrendingUp } from "lucide-react"

interface PlaceholderProps {
  title: string
  description: string
}

export default function PlaceholderWidget({ title, description }: PlaceholderProps) {
  const isNews = title.includes("News")
  const Icon = isNews ? Sparkles : TrendingUp
  const colorClass = isNews ? "text-fuchsia-400" : "text-rose-400"
  const glowClass = isNews ? "bg-fuchsia-500/10" : "bg-rose-500/10"

  return (
    <div className="glass-panel p-6 h-full min-h-[400px] flex flex-col relative overflow-hidden group">
      <div className={`absolute inset-0 ${glowClass} opacity-50 blur-3xl group-hover:opacity-100 transition-opacity duration-700`}></div>
      
      <div className={`flex items-center gap-2 ${colorClass} mb-4 relative z-10`}>
        <Icon className="w-5 h-5" />
        <span className="font-medium tracking-wider text-sm uppercase">{title}</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
          <Icon className={`w-8 h-8 ${colorClass} opacity-50`} />
        </div>
        <h3 className="text-xl font-medium text-white">{title}</h3>
        <p className="text-slate-400 max-w-[200px]">{description}</p>
        <button className="mt-4 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all cursor-not-allowed">
          Coming in next phase
        </button>
      </div>
    </div>
  )
}
