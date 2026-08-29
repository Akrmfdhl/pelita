package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"

	"github.com/pelita/backend/internal/auth"
	"github.com/pelita/backend/internal/config"
	"github.com/pelita/backend/internal/contracts"
	"github.com/pelita/backend/internal/evidence"
	"github.com/pelita/backend/internal/literacy"
	"github.com/pelita/backend/internal/llm"
	"github.com/pelita/backend/internal/reporting"
	"github.com/pelita/backend/internal/rules"
	"github.com/pelita/backend/internal/security"
)

func main() {
	cfg := config.Load()

	encryptor, err := security.NewEncryptor(cfg.AppEncryptionKey)
	if err != nil {
		log.Fatalf("[ERROR] Failed to initialize security encryptor: %v", err)
	}

	ruleEngine := rules.NewRuleEngine()
	tokenVerifier := auth.NewMockTokenVerifier()
	llmClient := llm.NewClient(cfg.GeminiAPIKey, cfg.GroqAPIKey)

	contractsService := contracts.NewService(ruleEngine, llmClient)
	contractsHandler := contracts.NewHandler(contractsService)

	evidenceService := evidence.NewService(ruleEngine, encryptor)
	evidenceHandler := evidence.NewHandler(evidenceService)

	reportingService := reporting.NewService(llmClient)
	reportingHandler := reporting.NewHandler(reportingService)

	literacyService := literacy.NewService()
	literacyHandler := literacy.NewHandler(literacyService)

	app := fiber.New(fiber.Config{
		AppName: "Pelita Core API v1",
	})

	app.Use(recover.New())
	app.Use(logger.New(logger.Config{
		Format: "[INFO] ${time} | ${status} | ${latency} | ${method} ${path}\n",
	}))
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	app.Get("/healthz", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status": "healthy",
			"app":    "pelita-api",
		})
	})

	app.Get("/readyz", func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status":   "ready",
			"database": "connected",
			"storage":  "connected",
		})
	})

	apiV1 := app.Group("/api/v1")
	authMiddleware := auth.NewAuthMiddleware(tokenVerifier)

	protected := apiV1.Group("", authMiddleware)
	contractsHandler.RegisterRoutes(protected)
	evidenceHandler.RegisterRoutes(protected)
	reportingHandler.RegisterRoutes(protected)
	literacyHandler.RegisterRoutes(protected)

	log.Printf("[INFO] Pelita API Server starting on port %s...", cfg.AppPort)
	if err := app.Listen(":" + cfg.AppPort); err != nil {
		log.Fatalf("[ERROR] Failed to start API server: %v", err)
	}
}
