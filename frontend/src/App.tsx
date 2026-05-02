import Layout from "./components/Layout"
import DateTimeWidget from "./components/widgets/DateTimeWidget"
import WeatherWidget from "./components/widgets/WeatherWidget"
import CalendarWidget from "./components/widgets/CalendarWidget"
import QuoteWidget from "./components/widgets/QuoteWidget"
import PlaceholderWidget from "./components/widgets/PlaceholderWidget"
import NewsWidget from "./components/widgets/NewsWidget"
import StockWidget from "./components/widgets/StockWidget"
import StartupsWidget from "./components/widgets/StartupsWidget"

function App() {
  return (
    <Layout>
      <div className="flex flex-col gap-10 w-full max-w-[1600px] mx-auto p-8 min-h-[800px]">
        
        {/* Header Row: Frameless Widgets & Middle Quote */}
        <div className="flex gap-8 w-full items-stretch">
          {/* Top Left: Agenda */}
          <div className="w-80 shrink-0 animate-reveal-up" style={{ animationDelay: "100ms" }}>
            <CalendarWidget isFrameless={true} />
          </div>
          
          {/* Top Middle: Quote Widget */}
          <div className="flex-1 flex flex-col min-h-[250px] animate-reveal-up" style={{ animationDelay: "200ms" }}>
             <QuoteWidget />
          </div>

          {/* Top Right: Time & Weather */}
          <div className="w-80 shrink-0 flex flex-col items-end gap-2 bg-black/10 p-4 rounded-3xl border border-white/5 backdrop-blur-md h-fit animate-reveal-up" style={{ animationDelay: "300ms" }}>
            <DateTimeWidget isFrameless={true} />
            <div className="w-full h-px bg-white/10 my-1"></div>
            <WeatherWidget isFrameless={true} />
          </div>
        </div>

        {/* Main Content Grid: 12 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-[600px]">
          {/* Far Left: News (col-span-3) */}
          <div className="lg:col-span-3 flex flex-col animate-reveal-up" style={{ animationDelay: "400ms" }}>
            <NewsWidget />
          </div>

          {/* Center: Startups (col-span-7) */}
          <div className="lg:col-span-7 flex flex-col animate-reveal-up" style={{ animationDelay: "500ms" }}>
            <StartupsWidget />
          </div>

          {/* Far Right: Markets (col-span-2) */}
          <div className="lg:col-span-2 flex flex-col animate-reveal-up" style={{ animationDelay: "600ms" }}>
            <StockWidget />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default App
