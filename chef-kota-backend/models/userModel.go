package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Username  string             `json:"username" bson:"username" validate:"required,min=2,max=100"`
	FirstName string             `json:"first_name" bson:"first_name" validate:"required,min=2,max=100"`
	LastName  string             `json:"last_name" bson:"last_name" validate:"required,min=2,max=100"`
	Email     string             `json:"email" bson:"email" validate:"required,email"`
	Password  string             `json:"-" bson:"password" validate:"required,min=6"`
	Role      string             `json:"role" bson:"role" validate:"required,eq=admin|eq=user"`
	Token     string             `json:"token,omitempty" bson:"token,omitempty"`
	CreatedAt time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt time.Time          `json:"updated_at" bson:"updated_at"`
	UserID    string             `json:"user_id" bson:"user_id"`
}
