package auth

import (
	"strings"

	"github.com/gofiber/fiber/v2"
)

const CtxUserIDKey = "user_id"
const CtxFirebaseUIDKey = "firebase_uid"
const CtxUserEmailKey = "user_email"

func NewAuthMiddleware(verifier TokenVerifier) fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"status":  "error",
				"message": "Authorization header missing",
			})
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"status":  "error",
				"message": "Invalid Authorization header format",
			})
		}

		payload, err := verifier.VerifyIDToken(c.Context(), parts[1])
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"status":  "error",
				"message": "Invalid or expired authorization token",
			})
		}

		c.Locals(CtxFirebaseUIDKey, payload.UID)
		c.Locals(CtxUserEmailKey, payload.Email)
		c.Locals(CtxUserIDKey, payload.UID)

		return c.Next()
	}
}
