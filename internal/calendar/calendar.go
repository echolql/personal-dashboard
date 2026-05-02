package calendar

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"golang.org/x/oauth2"
	"google.golang.org/api/calendar/v3"
	"google.golang.org/api/option"
	"mydashboard/internal/auth"
)

type Event struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Time        string `json:"time"`
	Location    string `json:"location"`
	Description string `json:"description"`
	Color       string `json:"color"`
}

var colors = []string{"bg-emerald-500", "bg-purple-500", "bg-blue-500", "bg-rose-500", "bg-amber-500"}

func GetEventsHandler(w http.ResponseWriter, r *http.Request) {
	session, _ := auth.Store.Get(r, "auth-session")
	tokenStr, ok := session.Values["oauth_token"].(string)
	if !ok || tokenStr == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var token oauth2.Token
	if err := json.Unmarshal([]byte(tokenStr), &token); err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	client := auth.OAuthConfig.Client(context.Background(), &token)
	srv, err := calendar.NewService(context.Background(), option.WithHTTPClient(client))
	if err != nil {
		http.Error(w, "Unable to create calendar client", http.StatusInternalServerError)
		return
	}

	now := time.Now()
	startOfDay := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	endOfDay := startOfDay.Add(24 * time.Hour)

	events, err := srv.Events.List("primary").
		ShowDeleted(false).
		SingleEvents(true).
		TimeMin(startOfDay.Format(time.RFC3339)).
		TimeMax(endOfDay.Format(time.RFC3339)).
		MaxResults(10).
		OrderBy("startTime").Do()
	if err != nil {
		http.Error(w, "Unable to retrieve events", http.StatusInternalServerError)
		return
	}

	var response []Event
	for i, item := range events.Items {
		startTime := item.Start.DateTime
		if startTime == "" {
			startTime = item.Start.Date
		} else {
			parsed, _ := time.Parse(time.RFC3339, startTime)
			startTime = parsed.Format("3:04 PM")
			if item.End != nil && item.End.DateTime != "" {
				parsedEnd, _ := time.Parse(time.RFC3339, item.End.DateTime)
				startTime += " - " + parsedEnd.Format("3:04 PM")
			}
		}

		loc := item.Location
		if loc == "" {
			loc = "No Location"
		}

		response = append(response, Event{
			ID:          item.Id,
			Title:       item.Summary,
			Time:        startTime,
			Location:    loc,
			Description: item.Description,
			Color:       colors[i%len(colors)],
		})
	}

	if len(response) == 0 {
		response = []Event{} // Return empty array instead of null
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
