package news

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"sync"
	"time"
)



type cacheEntry struct {
	Data      []byte
	Timestamp time.Time
}

var (
	cache      sync.Map
	cacheTTL   = 30 * time.Minute
)

func GetNewsHandler(w http.ResponseWriter, r *http.Request) {
	category := r.URL.Query().Get("category")
	if category == "" {
		category = "technology" // default
	}

	// 1. Check Cache
	if val, ok := cache.Load(category); ok {
		entry := val.(cacheEntry)
		if time.Since(entry.Timestamp) < cacheTTL {
			w.Header().Set("Content-Type", "application/json")
			w.Write(entry.Data)
			return
		}
	}

	// 2. Fetch from API
	apiKey := os.Getenv("NEWS_API_KEY")
	if apiKey == "" || apiKey == "your_gnews_api_key" {
		http.Error(w, "NEWS_API_KEY not configured", http.StatusInternalServerError)
		return
	}

	// Determine search query based on category
	var query string
	switch category {
	case "tech":
		query = "technology OR AI"
	case "politics":
		query = "politics OR government"
	case "entertainment":
		query = "entertainment OR movies OR music"
	default:
		query = category
	}
	// Calculate date 29 days ago to stay within the free tier's 30-day limit
	fromTime := time.Now().Add(-29 * 24 * time.Hour).Format("2006-01-02T15:04:05Z")

	// Note: GNews Free Tier restricts max to 10 articles per request
	// We paginate manually to fetch 20 articles total (page 1 and page 2).
	baseURL := fmt.Sprintf("https://gnews.io/api/v4/search?q=%s&lang=en&max=10&sortby=relevance&from=%s&apikey=%s", url.QueryEscape(query), url.QueryEscape(fromTime), apiKey)
	
	var allArticles []interface{}

	for page := 1; page <= 2; page++ {
		pageURL := fmt.Sprintf("%s&page=%d", baseURL, page)
		resp, err := http.Get(pageURL)
		if err != nil || resp.StatusCode != http.StatusOK {
			continue // Skip failed pages silently
		}

		var result map[string]interface{}
		if err := json.NewDecoder(resp.Body).Decode(&result); err == nil {
			if articles, ok := result["articles"].([]interface{}); ok {
				allArticles = append(allArticles, articles...)
			}
		}
		resp.Body.Close()
	}

	finalResponse := map[string]interface{}{
		"totalArticles": len(allArticles),
		"articles":      allArticles,
	}

	body, err := json.Marshal(finalResponse)
	if err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}

	// 3. Store in Cache
	cache.Store(category, cacheEntry{
		Data:      body,
		Timestamp: time.Now(),
	})

	// 4. Return
	w.Header().Set("Content-Type", "application/json")
	w.Write(body)
}
