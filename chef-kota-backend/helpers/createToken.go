package helpers

import (
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"os"
	"time"
)

func CreateJWTToken(username string) (string, error) {

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		return "", fmt.Errorf("JWT secret not set in environment variables")
	}

	// Define token claims.
	claims := jwt.MapClaims{
		"authorized": true,
		"username":   username,
		"exp":        time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token using the secret key.
	return token.SignedString([]byte(jwtSecret))
}
