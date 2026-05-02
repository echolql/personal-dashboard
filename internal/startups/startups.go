package startups

import (
	"encoding/json"
	"net/http"
	_ "embed"
	"log"
)

type Startup struct {
	ID           string   `json:"id"`
	Name         string   `json:"name"`
	City         string   `json:"city"`
	Founders     string   `json:"founders"`
	Founded      string   `json:"founded"`
	FundingPhase string   `json:"fundingPhase"`
	Description  string   `json:"description"`
	NewsLink     string   `json:"newsLink"`
	Website      string   `json:"website"`
	LogoInitial  string   `json:"logoInitial"`
	Color        string   `json:"color"`
}

//go:embed startups_data.json
var startupsJSON []byte

var curatedStartups []Startup

func init() {
	if err := json.Unmarshal(startupsJSON, &curatedStartups); err != nil {
		log.Fatalf("Failed to load startups database: %v", err)
	}
}

func GetStartupsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(curatedStartups)
}
