package main

import (
	"chef-kota-backend/middleware"
	"chef-kota-backend/routes"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

// CORS middleware to handle cross-origin requests
func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*") // Adjust this in production to allow specific origins
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")

		// Handle preflight requests
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	router := gin.New()
	router.Use(gin.Logger())
	router.Use(CORS())

	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Welcome to the Chef Kota Backend!",
		})
	})

	routes.AuthRouter(router)

	protected := router.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.POST("/food", routes.AddFoodItem)
		protected.GET("/food", routes.GetFoodItems)
		protected.GET("/food/:id", routes.GetFoodItemByID)
		protected.PUT("/food/:id", routes.UpdateFoodItem)
		protected.DELETE("/food/:id", routes.DeleteFoodItem)
	}

	// Start the server on the specified port
	router.Run(":" + port)
}
