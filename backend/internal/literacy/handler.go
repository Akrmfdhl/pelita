package literacy

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
	group := router.Group("/literacy")
	group.Get("/modules", h.ListModules)
	group.Get("/quizzes", h.ListQuizzes)
	group.Post("/quiz/submit", h.SubmitQuizAnswer)
}

func (h *Handler) ListModules(c *fiber.Ctx) error {
	res, err := h.service.ListModules(c.Context())
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

func (h *Handler) ListQuizzes(c *fiber.Ctx) error {
	res, err := h.service.ListQuizzes(c.Context())
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

func (h *Handler) SubmitQuizAnswer(c *fiber.Ctx) error {
	userID, ok := c.Locals(auth.CtxUserIDKey).(string)
	if !ok || userID == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"status":  "error",
			"message": "Unauthorized user session",
		})
	}

	var req SubmitQuizAnswerRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"status":  "error",
			"message": "Invalid request payload",
		})
	}

	res, err := h.service.SubmitQuizAnswer(c.Context(), userID, req)
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
