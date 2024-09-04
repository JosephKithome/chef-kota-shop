package routes

import (
	"chef-kota-backend/database"
	"chef-kota-backend/models"
	"context"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var DB *mongo.Client
var foodCollection *mongo.Collection

// Initialize function to set up the MongoDB connection
func init() {
	// Establish a connection to the MongoDB database
	DB = database.ConnectDB() // Ensure that ConnectDB correctly connects and returns the client

	// Check if DB is nil to avoid nil pointer dereference
	if DB != nil {
		// Assign the 'food_items' collection to the global variable
		foodCollection = DB.Database("kota_shop").Collection("food_items")
		log.Println("Connected to MongoDB and initialized food collection.")
	} else {
		log.Fatal("Failed to initialize MongoDB connection.")
	}
}

// AddFoodItem handles adding a new food item
func AddFoodItem(c *gin.Context) {
	var foodItem models.FoodItem

	// Bind JSON input to the FoodItem struct
	if err := c.ShouldBindJSON(&foodItem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if the food item name already exists in the collection
	var existingItem models.FoodItem
	err := foodCollection.FindOne(context.TODO(), bson.M{"name": foodItem.Name}).Decode(&existingItem)
	if err == nil {
		// If no error, it means the item with the same name already exists
		c.JSON(http.StatusConflict, gin.H{"error": "Food item with this name already exists"})
		return
	} else if err != mongo.ErrNoDocuments {
		// Handle errors other than "no documents found"
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error checking for existing food item"})
		return
	}

	// Set metadata fields for the new food item
	foodItem.ID = primitive.NewObjectID()
	foodItem.CreatedAt = time.Now()
	foodItem.UpdatedAt = time.Now()

	// Insert the new food item into the collection
	_, err = foodCollection.InsertOne(context.TODO(), foodItem)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error adding food item"})
		return
	}

	// Respond with the newly created food item
	c.JSON(http.StatusCreated, foodItem)
}

// GetFoodItems handles retrieving all food items

func GetFoodItems(c *gin.Context) {
	cursor, err := foodCollection.Find(context.TODO(), bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching food items"})
		return
	}

	var foodItems []models.FoodItem
	if err := cursor.All(context.TODO(), &foodItems); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error reading food items"})
		return
	}

	c.JSON(http.StatusOK, foodItems)
}

func GetFoodItemByID(c *gin.Context) {

	idParam := c.Param("id")

	id, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	filter := bson.M{"_id": id}

	var foodItem models.FoodItem
	err = foodCollection.FindOne(context.TODO(), filter).Decode(&foodItem)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "Food item not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching food item"})
		}
		return
	}

	// Return the food item as JSON
	c.JSON(http.StatusOK, foodItem)
}

func UpdateFoodItem(c *gin.Context) {
	id := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var foodItem models.FoodItem
	if err := c.ShouldBindJSON(&foodItem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	foodItem.UpdatedAt = time.Now()

	// Update the food item in the database
	updateResult, err := foodCollection.UpdateOne(
		context.TODO(),
		bson.M{"_id": objID},
		bson.M{"$set": foodItem},
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating food item"})
		return
	}

	if updateResult.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Food item not found"})
		return
	}

	// Retrieve the updated food item
	var updatedFoodItem models.FoodItem
	err = foodCollection.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&updatedFoodItem)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error retrieving updated food item"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Food item updated successfully", "foodItem": updatedFoodItem})
}

// DeleteFoodItem handles deleting a specific food item
func DeleteFoodItem(c *gin.Context) {
	id := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	// Check if the food item exists in the collection
	var existingItem models.FoodItem
	err = foodCollection.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&existingItem)
	if err == mongo.ErrNoDocuments {
		// If no documents found, return a not found error
		c.JSON(http.StatusNotFound, gin.H{"error": "Food item not found"})
		return
	} else if err != nil {
		// Handle other errors
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error checking for existing food item"})
		return
	}

	// Proceed to delete the food item
	_, err = foodCollection.DeleteOne(context.TODO(), bson.M{"_id": objID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error deleting food item"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Food item deleted successfully"})
}

func FoodRouter(router *gin.Engine) {
	// Register route
	router.POST("/food", AddFoodItem)          // Directly pass the handler function
	router.GET("/food", GetFoodItems)          // Use the correct handler for GET requests
	router.PUT("/food/:id", UpdateFoodItem)    // Correct handler for updating food items
	router.DELETE("/food/:id", DeleteFoodItem) // Correct handler for deleting food items
}
