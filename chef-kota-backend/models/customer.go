package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Customer struct {
	ID              primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	FirstName       string             `json:"first_name" validate:"required,min=2,max=50"`
	LastName        string             `json:"last_name" validate:"required,min=2,max=50"`
	Email           string             `json:"email" validate:"required,email"`
	Phone           string             `json:"phone" validate:"required,min=10,max=15"`
	Address         string             `json:"address" validate:"required,min=10,max=200"`
	DateOfBirth     time.Time          `json:"date_of_birth"`
	CreatedAt       time.Time          `json:"created_at"`
	UpdatedAt       time.Time          `json:"updated_at"`
	IsEmailVerified bool               `json:"is_email_verified" validate:"required"`
}
