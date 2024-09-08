package routes

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"

	"chef-kota-backend/database"
	"chef-kota-backend/models"
)

func AuthRouter(router *gin.Engine) {
	router.POST("/register", func(c *gin.Context) {
		Register(c.Writer, c.Request)
	})

	// Login route
	router.POST("/login", func(c *gin.Context) {
		Login(c.Writer, c.Request)
	})
}

var userCollection *mongo.Collection

func init() {
	// Establish a connection to the MongoDB database
	DB = database.ConnectDB() // Ensure that ConnectDB correctly connects and returns the client

	// Check if DB is nil to avoid nil pointer dereference
	if DB != nil {
		// Assign the 'users' collection to the global variable
		userCollection = DB.Database("kota_shop").Collection("users")
		log.Println("Connected to MongoDB and initialized user collection.")
	} else {
		log.Fatal("Failed to initialize MongoDB connection.")
	}
}

// Register handles the registration of a new user
func Register(w http.ResponseWriter, r *http.Request) {
	var user models.User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	// Hash the user's password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}
	user.Password = string(hashedPassword)

	// Check if the user already exists
	filter := bson.M{"username": user.Username}
	count, err := userCollection.CountDocuments(context.TODO(), filter)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	if count > 0 {
		http.Error(w, "User already exists", http.StatusBadRequest)
		return
	}

	// Insert the new user into the database
	_, err = userCollection.InsertOne(context.TODO(), user)
	if err != nil {
		http.Error(w, "Error creating user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode("User registered successfully")
}

// Login handles user login
func Login(w http.ResponseWriter, r *http.Request) {
	var loginDetails models.User
	err := json.NewDecoder(r.Body).Decode(&loginDetails)
	if err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	var foundUser models.User
	filter := bson.M{"username": loginDetails.Username}
	err = userCollection.FindOne(context.TODO(), filter).Decode(&foundUser)
	if err != nil {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	// Compare the hashed password with the one provided by the user
	err = bcrypt.CompareHashAndPassword([]byte(foundUser.Password), []byte(loginDetails.Password))
	if err != nil {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	// Create a JWT token for the authenticated user
	token, err := createJWTToken(foundUser.Username)
	if err != nil {
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"token": token})
}

// createJWTToken generates a JWT token for the given username
func createJWTToken(username string) (string, error) {
	claims := jwt.MapClaims{}
	claims["authorized"] = true
	claims["username"] = username

	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()

	// Create the JWT token with claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
}
