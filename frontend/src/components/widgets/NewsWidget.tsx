import React, { useState, useEffect } from "react"
import { Sparkles, ExternalLink, RefreshCw } from "lucide-react"

interface Article {
  title: string
  description: string
  url: string
  image: string
  source: {
    name: string
  }
}

interface NewsResponse {
  totalArticles: number
  articles: Article[]
}

const CATEGORIES = [
  { id: "tech", label: "AI & Tech" },
  { id: "politics", label: "Politics" },
  { id: "entertainment", label: "Entertainment" }
]

export default function NewsWidget() {
  const [activeTab, setActiveTab] = useState(CATEGORIES[0].id)
  const [news, setNews] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchNews = (category: string) => {
    setLoading(true)
    setError(false)
    fetch(`/api/news?category=${category}`)
      .then(res => {
        if (!res.ok) throw new Error("API Error")
        return res.json()
      })
      .then((data: NewsResponse) => {
        if (data.articles) {
          setNews(data.articles)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError(true)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchNews(activeTab)
  }, [activeTab])

  return (
    <div className="glass-panel p-6 h-full flex flex-col relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/5 rounded-full blur-3xl group-hover:bg-fuchsia-500/10 transition-all duration-700"></div>
      
      {/* Header & Tabs */}
      <div className="flex flex-col gap-4 mb-6 relative z-10">
        <div className="flex items-center justify-between text-blue-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <h2 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400">
            Latest News
          </h2>
          </div>
          {loading && <RefreshCw className="w-4 h-4 animate-spin text-slate-400" />}
        </div>
        
        <div className="flex gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
                activeTab === cat.id 
                  ? "bg-blue-500/20 border-blue-500/30 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
                  : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col gap-4 relative z-10 overflow-y-auto pr-2 custom-scrollbar">
        {loading && news.length === 0 ? (
          <div className="flex-1 flex flex-col gap-4">
             {[1, 2, 3, 4].map(i => (
               <div key={i} className="flex gap-4 p-3 border border-white/5 rounded-xl">
                 <div className="w-20 h-20 skeleton shrink-0"></div>
                 <div className="flex-1 flex flex-col gap-2 justify-center">
                   <div className="h-4 w-full skeleton"></div>
                   <div className="h-4 w-2/3 skeleton"></div>
                   <div className="h-2 w-1/4 skeleton mt-2"></div>
                 </div>
               </div>
             ))}
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
            <p className="text-rose-400 text-sm font-medium">Unable to fetch news</p>
            <p className="text-slate-400 text-xs max-w-[200px]">Check your GNews API key in the .env file and restart the backend.</p>
            <button 
              onClick={() => fetchNews(activeTab)}
              className="mt-2 px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-xs text-slate-300 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : news.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            No articles found for this category.
          </div>
        ) : (
          news.map((article, idx) => (
            <a 
              key={idx} 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group/article flex gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-fuchsia-500/30 hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-800">
                {article.image && (
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover opacity-80 group-hover/article:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="flex flex-col justify-center flex-1 min-w-0">
                <h3 className="text-sm font-medium text-slate-200 line-clamp-2 leading-snug group-hover/article:text-blue-300 transition-colors">
                  {article.title}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500 tracking-wider">
                  <span className="truncate max-w-[120px]">{article.source.name}</span>
                  <span>•</span>
                  <ExternalLink className="w-3 h-3 group-hover/article:translate-x-0.5 group-hover/article:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  )
}
