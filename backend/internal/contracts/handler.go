package contracts

import (
	"github.com/gofiber/fiber/v2"
	"github.com/pelita/backend/internal/auth"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) RegisterRoutes(router fiber.Router) {
	group := router.Group("/contracts")
	group.Post("/extract", h.ExtractContract)
	group.Post("/audit", h.AuditContract)
}

func (h *Handler) ExtractContract(c *fiber.Ctx) error {
	var req ExtractContractRequest
	_ = c.BodyParser(&req)

	res, err := h.service.ExtractParameters(c.Context(), req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data":   res,
	})
}

func (h *Handler) AuditContract(c *fiber.Ctx) error {
	userID, ok := c.Locals(auth.CtxUserIDKey).(string)
	if !ok || userID == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"status":  "error",
			"message": "Unauthorized user session",
		})
	}

	var req AuditContractRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Invalid request payload",
		})
	}

	res, err := h.service.AuditContract(c.Context(), userID, req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"status": "success",
		"data":   res,
	})
}
