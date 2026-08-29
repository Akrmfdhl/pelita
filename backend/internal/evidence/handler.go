package evidence

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
	group := router.Group("/evidence")
	group.Get("/cases", h.ListCases)
	group.Post("/cases", h.CreateCase)
	group.Post("/cases/:id/items", h.AddEvidenceItem)
}

func (h *Handler) ListCases(c *fiber.Ctx) error {
	userID, ok := c.Locals(auth.CtxUserIDKey).(string)
	if !ok || userID == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"status":  "error",
			"message": "Unauthorized user session",
		})
	}

	res, err := h.service.ListCases(c.Context(), userID)
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

func (h *Handler) CreateCase(c *fiber.Ctx) error {
	userID, ok := c.Locals(auth.CtxUserIDKey).(string)
	if !ok || userID == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"status":  "error",
			"message": "Unauthorized user session",
		})
	}

	var req CreateCaseRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Invalid request payload",
		})
	}

	res, err := h.service.CreateCase(c.Context(), userID, req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status": "success",
		"data":   res,
	})
}

func (h *Handler) AddEvidenceItem(c *fiber.Ctx) error {
	userID, ok := c.Locals(auth.CtxUserIDKey).(string)
	if !ok || userID == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"status":  "error",
			"message": "Unauthorized user session",
		})
	}

	caseID := c.Params("id")
	if caseID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Case ID required",
		})
	}

	var req AddEvidenceItemRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Invalid request payload",
		})
	}

	res, err := h.service.AddEvidenceItem(c.Context(), userID, caseID, req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"status": "success",
		"data":   res,
	})
}
