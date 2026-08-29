package auth

import (
	"context"
	"errors"
	"strings"
)

type TokenVerifier interface {
	VerifyIDToken(ctx context.Context, idToken string) (*TokenPayload, error)
}

type TokenPayload struct {
	UID   string `json:"uid"`
	Email string `json:"email"`
	Name  string `json:"name"`
}

type MockTokenVerifier struct{}

func NewMockTokenVerifier() *MockTokenVerifier {
	return &MockTokenVerifier{}
}

func (m *MockTokenVerifier) VerifyIDToken(ctx context.Context, idToken string) (*TokenPayload, error) {
	if idToken == "" {
		return nil, errors.New("empty id token")
	}
	if strings.HasPrefix(idToken, "mock-token-") {
		uid := strings.TrimPrefix(idToken, "mock-token-")
		return &TokenPayload{
			UID:   uid,
			Email: uid + "@pelita-user.test",
			Name:  "Pelita Test User",
		}, nil
	}
	return &TokenPayload{
		UID:   "demo-user-123",
		Email: "demo@pelita.id",
		Name:  "Demo Pelita User",
	}, nil
}
