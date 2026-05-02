package stocks

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
	"sync"
)

type Quote struct {
	CurrentPrice float64 `json:"c"`
	Change       float64 `json:"d"`
	PercentChange float64 `json:"dp"`
}

type StockData struct {
	Symbol        string  `json:"symbol"`
	CurrentPrice  float64 `json:"currentPrice"`
	Change        float64 `json:"change"`
	PercentChange float64 `json:"percentChange"`
}

func GetStocksHandler(w http.ResponseWriter, r *http.Request) {
	apiKey := os.Getenv("FINNHUB_API_KEY")
	if apiKey == "" || apiKey == "your_finnhub_api_key_here" {
		http.Error(w, "FINNHUB_API_KEY not configured", http.StatusInternalServerError)
		return
	}

	symbolsQuery := r.URL.Query().Get("symbols")
	if symbolsQuery == "" {
		symbolsQuery = "AAPL,MSFT,GOOG" // default
	}

	symbols := strings.Split(symbolsQuery, ",")
	var results []StockData
	var mu sync.Mutex
	var wg sync.WaitGroup

	for _, s := range symbols {
		s = strings.TrimSpace(strings.ToUpper(s))
		if s == "" {
			continue
		}

		wg.Add(1)
		go func(symbol string) {
			defer wg.Done()
			apiURL := fmt.Sprintf("https://finnhub.io/api/v1/quote?symbol=%s&token=%s", symbol, apiKey)
			resp, err := http.Get(apiURL)
			if err != nil || resp.StatusCode != http.StatusOK {
				return
			}
			defer resp.Body.Close()

			var quote Quote
			if err := json.NewDecoder(resp.Body).Decode(&quote); err == nil {
				// Finnhub returns c=0 if symbol is invalid
				if quote.CurrentPrice == 0 && quote.Change == 0 {
					return
				}
				mu.Lock()
				results = append(results, StockData{
					Symbol:        symbol,
					CurrentPrice:  quote.CurrentPrice,
					Change:        quote.Change,
					PercentChange: quote.PercentChange,
				})
				mu.Unlock()
			}
		}(s)
	}

	wg.Wait()

	// Return empty array instead of null if no results
	if len(results) == 0 {
		results = []StockData{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}
