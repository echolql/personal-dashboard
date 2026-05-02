import React, { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Settings, Plus, X, RefreshCw } from "lucide-react"

interface StockData {
  symbol: string
  currentPrice: number
  change: number
  percentChange: number
}

const DEFAULT_SYMBOLS = ["AAPL", "MSFT", "GOOG", "TSLA"]

export default function StockWidget() {
  const [symbols, setSymbols] = useState<string[]>(() => {
    const saved = localStorage.getItem("dashboard_stocks")
    return saved ? JSON.parse(saved) : DEFAULT_SYMBOLS
  })
  
  const [stocks, setStocks] = useState<StockData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [newSymbol, setNewSymbol] = useState("")

  const fetchStocks = () => {
    if (symbols.length === 0) {
      setStocks([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(false)
    fetch(`/api/stocks?symbols=${symbols.join(",")}`)
      .then(res => {
        if (!res.ok) throw new Error("API Error")
        return res.json()
      })
      .then(data => {
        setStocks(data || [])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError(true)
        setLoading(false)
      })
  }

  // Fetch stocks when symbols change or on mount
  useEffect(() => {
    fetchStocks()
    // Refresh every 60 seconds
    const interval = setInterval(fetchStocks, 60000)
    return () => clearInterval(interval)
  }, [symbols])

  const handleAddSymbol = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanSymbol = newSymbol.trim().toUpperCase()
    if (cleanSymbol && !symbols.includes(cleanSymbol)) {
      const updated = [...symbols, cleanSymbol]
      setSymbols(updated)
      localStorage.setItem("dashboard_stocks", JSON.stringify(updated))
    }
    setNewSymbol("")
  }

  const handleRemoveSymbol = (sym: string) => {
    const updated = symbols.filter(s => s !== sym)
    setSymbols(updated)
    localStorage.setItem("dashboard_stocks", JSON.stringify(updated))
  }

  return (
    <div className="glass-panel p-6 h-full flex flex-col relative overflow-hidden group">
      <div className="absolute top-0 -right-4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-all duration-700"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2 text-blue-400">
          <TrendingUp className="w-5 h-5" />
          <h2 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">
            Markets
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {loading && <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />}
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Edit Mode */}
      {isEditing && (
        <div className="mb-4 p-4 rounded-xl bg-black/20 border border-white/5 relative z-10 animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-medium text-slate-300">Manage Symbols</span>
          </div>
          <form onSubmit={handleAddSymbol} className="flex gap-2 mb-3">
            <input 
              type="text" 
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              placeholder="e.g. NVDA" 
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
            />
            <button 
              type="submit"
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 p-1.5 rounded-lg transition-colors border border-amber-500/30"
            >
              <Plus className="w-5 h-5" />
            </button>
          </form>
          <div className="flex flex-wrap gap-2">
            {symbols.map(sym => (
              <span key={sym} className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md text-xs text-slate-200">
                {sym}
                <button onClick={() => handleRemoveSymbol(sym)} className="hover:text-rose-400 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 flex flex-col gap-3 relative z-10 overflow-y-auto pr-2 custom-scrollbar">
        {error ? (
           <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
             <p className="text-rose-400 text-sm font-medium">API Error</p>
             <p className="text-slate-400 text-xs max-w-[200px]">Check your Finnhub API key in the .env file.</p>
           </div>
        ) : symbols.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm text-center px-4">
            No stocks tracked. Click the settings icon to add some!
          </div>
        ) : loading && stocks.length === 0 ? (
          <div className="flex-1 flex flex-col gap-3">
             {[1, 2, 3, 4, 5].map(i => (
               <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-white/5">
                 <div className="flex flex-col gap-2">
                   <div className="h-4 w-16 skeleton"></div>
                 </div>
                 <div className="flex flex-col items-end gap-2">
                   <div className="h-4 w-12 skeleton"></div>
                   <div className="h-2 w-16 skeleton"></div>
                 </div>
               </div>
             ))}
          </div>
        ) : (
          stocks.map((stock) => {
            const isPositive = stock.change >= 0
            return (
              <div 
                key={stock.symbol} 
                className="group/stock flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-white text-base tracking-wide">{stock.symbol}</span>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className="text-white font-medium">
                    ${stock.currentPrice.toFixed(2)}
                  </span>
                  <div className={`flex items-center gap-1 text-xs font-medium mt-0.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span>{isPositive ? '+' : ''}{stock.change.toFixed(2)}</span>
                    <span className="opacity-70">({isPositive ? '+' : ''}{stock.percentChange.toFixed(2)}%)</span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
