package models

import "gorm.io/gorm"

type Compra struct {
	gorm.Model
	EventID  uint   `json:"event_id"`
	UserID   uint   `json:"user_id"`
	Quantity uint   `json:"quantity"`
	Status   string `json:"status"` // por ejemplo: "pendiente", "pagada"
}
