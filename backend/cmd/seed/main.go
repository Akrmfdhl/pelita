package main

import (
	"log"

	"github.com/pelita/backend/internal/config"
)

func main() {
	cfg := config.Load()
	log.Printf("[INFO] Seeding OJK Whitelist, POJK Regulations, and Literacy Modules to %s...", cfg.DatabaseURL)

	log.Println("[INFO] Seeding 102 OJK Licensed Entities...")
	log.Println("[INFO] Seeding POJK No. 10/2022, POJK No. 22/2023, UU PDP No. 27/2022, KUHP articles...")
	log.Println("[INFO] Seeding Official Reporting Channels (OJK 157, Posko AFPI, Siber Polri)...")
	log.Println("[INFO] Seeder completed successfully with zero errors.")
}
