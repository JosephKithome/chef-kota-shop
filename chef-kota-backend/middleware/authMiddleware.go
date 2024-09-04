package middleware

import (
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

// AuthMiddleware validates the Authorization header and checks the JWT token against a secret key.
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Retrieve the Authorization header.
		authHeader := c.GetHeader("Authorization")

		// Validate the presence and format of the Authorization header.
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing or invalid Authorization header"})
			c.Abort()
			return
		}

		// Extract the JWT token from the Authorization header.
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		// Validate the token against the secret key.
		claims, err := validateToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token", "details": err.Error()})
			c.Abort()
			return
		}

		// Optional: Set claims in the context for later use in handlers.
		c.Set("claims", claims)

		// Proceed to the next handler if the token is valid.
		c.Next()
	}
}

// validateToken parses and validates the JWT token using the secret key.
func validateToken(tokenString string) (jwt.MapClaims, error) {
	// Parse the JWT token.
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Ensure the signing method is HMAC (HS256).
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}

		// Return the secret key for validation.
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil {
		return nil, err
	}

	// Assert the token's claims as a map.
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return nil, jwt.ErrSignatureInvalid
	}

	// Check expiration and other claims.
	if exp, ok := claims["exp"].(float64); ok {
		if time.Unix(int64(exp), 0).Before(time.Now()) {
			return nil, jwt.NewValidationError("token has expired", jwt.ValidationErrorExpired)
		}
	}

	return claims, nil
}
