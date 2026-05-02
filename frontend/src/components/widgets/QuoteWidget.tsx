import React, { useState, useEffect } from "react"
import { Quote } from "lucide-react"

const QUOTES = [
  "The only way to do great work is to love what you do. — Steve Jobs",
  "Life is what happens when you're busy making other plans. — John Lennon",
  "The future belongs to those who believe in the beauty of their dreams. — Eleanor Roosevelt",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. — Winston Churchill",
  "In the middle of difficulty lies opportunity. — Albert Einstein",
  "The best way to predict the future is to create it. — Peter Drucker",
  "It does not matter how slowly you go as long as you do not stop. — Confucius",
  "Believe you can and you're halfway there. — Theodore Roosevelt"
]

export default function QuoteWidget() {
  const [quote, setQuote] = useState("")

  useEffect(() => {
    // Pick a random quote on mount
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)]
    setQuote(randomQuote)
  }, [])

  return (
    <div className="flex items-center justify-center gap-8 relative group h-full px-4">
      {/* Decorative gradient blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-amber-500/10 transition-colors duration-700"></div>

      {/* Coffee Image */}
      <div className="relative z-10 shrink-0">
        <img 
          src="/mexican_coffee.png" 
          alt="Mexican Coffee" 
          className="w-48 h-48 object-contain rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-105" 
          style={{ mixBlendMode: 'screen' }}
        />
      </div>

      {/* Quote Container */}
      <div className="relative z-10 flex-1 max-w-lg">
        <Quote className="w-8 h-8 text-amber-500/50 mb-3" />
        <p className="text-xl md:text-2xl font-serif text-slate-200 leading-relaxed italic drop-shadow-sm">
          "{quote.split(' — ')[0]}"
        </p>
        <p className="text-sm text-amber-400/90 font-medium mt-4 tracking-wide">
          — {quote.split(' — ')[1]}
        </p>
      </div>
    </div>
  )
}
