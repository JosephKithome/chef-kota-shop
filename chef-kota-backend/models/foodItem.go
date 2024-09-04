package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// FoodItem represents a food item in the Kota shop
type FoodItem struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name        string             `json:"name" validate:"required,min=2,max=100"`
	Description string             `json:"description" validate:"required,min=10,max=300"`
	Price       float64            `json:"price" validate:"required,gt=0"`
	Stock       int                `json:"stock" validate:"required,gt=0"`
	CreatedAt   time.Time          `json:"created_at"`
	UpdatedAt   time.Time          `json:"updated_at"`
}
