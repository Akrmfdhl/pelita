package config

import (
	"bufio"
	"os"
	"strconv"
	"strings"
)

type Config struct {
	AppName                 string
	AppEnv                  string
	AppPort                 string
	AppDebug                bool
	AppURL                  string
	FrontendURL             string
	DatabaseURL             string
	DBMaxOpenConns          int
	DBMaxIdleConns          int
	StorageEndpoint         string
	StorageAccessKey        string
	StorageSecretKey        string
	StorageBucketName       string
	StorageUseSSL           bool
	GeminiAPIKey            string
	GroqAPIKey              string
	FirebaseProjectID       string
	FirebaseCredentialsJSON string
	AppEncryptionKey        string
	EnableDemoFallbackCache bool
}

func Load() *Config {
	loadDotEnv(".env")

	return &Config{
		AppName:                 getEnv("APP_NAME", "pelita"),
		AppEnv:                  getEnv("APP_ENV", "development"),
		AppPort:                 getEnv("APP_PORT", "8080"),
		AppDebug:                getEnvAsBool("APP_DEBUG", true),
		AppURL:                  getEnv("APP_URL", "http://localhost:8080"),
		FrontendURL:             getEnv("FRONTEND_URL", "http://localhost:5173"),
		DatabaseURL:             getEnv("DATABASE_URL", "postgres://pelita_user:pelita_secure_password@localhost:5432/pelita_db?sslmode=disable"),
		DBMaxOpenConns:          getEnvAsInt("DB_MAX_OPEN_CONNS", 25),
		DBMaxIdleConns:          getEnvAsInt("DB_MAX_IDLE_CONNS", 10),
		StorageEndpoint:         getEnv("STORAGE_ENDPOINT", "localhost:9000"),
		StorageAccessKey:        getEnv("STORAGE_ACCESS_KEY", "pelita_minio_admin"),
		StorageSecretKey:        getEnv("STORAGE_SECRET_KEY", "pelita_minio_password"),
		StorageBucketName:       getEnv("STORAGE_BUCKET_NAME", "pelita-evidence"),
		StorageUseSSL:           getEnvAsBool("STORAGE_USE_SSL", false),
		GeminiAPIKey:            getEnv("GEMINI_API_KEY", ""),
		GroqAPIKey:              getEnv("GROQ_API_KEY", ""),
		FirebaseProjectID:       getEnv("FIREBASE_PROJECT_ID", "pelita-hackathon-2026"),
		FirebaseCredentialsJSON: getEnv("FIREBASE_CREDENTIALS_JSON", "./config/firebase-service-account.json"),
		AppEncryptionKey:        getEnv("APP_ENCRYPTION_KEY", "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"),
		EnableDemoFallbackCache: getEnvAsBool("ENABLE_DEMO_FALLBACK_CACHE", true),
	}
}

func loadDotEnv(filepath string) {
	file, err := os.Open(filepath)
	if err != nil {
		return
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		parts := strings.SplitN(line, "=", 2)
		if len(parts) == 2 {
			key := strings.TrimSpace(parts[0])
			val := strings.TrimSpace(parts[1])
			if os.Getenv(key) == "" {
				_ = os.Setenv(key, val)
			}
		}
	}
	if err := scanner.Err(); err != nil {
		return
	}
}

func getEnv(key, fallback string) string {
	if val, ok := os.LookupEnv(key); ok && val != "" {
		return val
	}
	return fallback
}

func getEnvAsInt(key string, fallback int) int {
	valStr := getEnv(key, "")
	if val, err := strconv.Atoi(valStr); err == nil {
		return val
	}
	return fallback
}

func getEnvAsBool(key string, fallback bool) bool {
	valStr := getEnv(key, "")
	if val, err := strconv.ParseBool(valStr); err == nil {
		return val
	}
	return fallback
}
