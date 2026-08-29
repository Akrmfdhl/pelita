package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/pelita/backend/internal/config"
)

func main() {
	cfg := config.Load()
	log.Printf("[INFO] Pelita Asynchronous Processing Worker started in %s mode...", cfg.AppEnv)

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			// Process pending background multimodal OCR & embedding indexing jobs
		case <-stop:
			log.Println("[INFO] Worker shutting down gracefully...")
			return
		}
	}
}
