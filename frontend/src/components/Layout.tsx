import React from "react"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* Dynamic Background Mesh or Gradient overlay can go here */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      
      <main className="relative z-10 min-h-screen flex items-center justify-center pt-10 pb-20">
        {children}
      </main>
    </div>
  )
}
