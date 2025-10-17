package handlers

import (
	"compra-entradas/database"
	"compra-entradas/models"
	"compra-entradas/rabbitmq"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	amqp "github.com/rabbitmq/amqp091-go"
)

type CompraInput struct {
	EventID  uint `json:"event_id" binding:"required"`
	Quantity uint `json:"quantity" binding:"required"`
}

func CreateCompra(c *gin.Context) {
	var input CompraInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Extraer userID del contexto (puesto por el middleware de autenticación)
	userID := c.MustGet("userID").(float64)

	compra := models.Compra{
		EventID:  input.EventID,
		UserID:   uint(userID),
		Quantity: input.Quantity,
		Status:   "pendiente",
	}

	if err := database.DB.Create(&compra).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create purchase"})
		return
	}

	c.JSON(http.StatusCreated, compra)
}

func PagarCompra(c *gin.Context) {
	compraIDStr := c.Param("id")
	compraID, err := strconv.ParseUint(compraIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid purchase ID"})
		return
	}

	var compra models.Compra
	if err := database.DB.First(&compra, compraID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Purchase not found"})
		return
	}

	// Aquí se podría integrar una pasarela de pago real.
	// Por ahora, simplemente marcamos la compra como pagada.
	compra.Status = "pagada"

	if err := database.DB.Save(&compra).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update purchase"})
		return
	}

	// Publicar mensaje a RabbitMQ
	messageBody, _ := json.Marshal(map[string]string{
		"user_id":    strconv.Itoa(int(compra.UserID)),
		"event_id":   strconv.Itoa(int(compra.EventID)),
		"compra_id":  strconv.Itoa(int(compra.ID)),
		"status":     compra.Status,
		"message":    fmt.Sprintf("Pago de compra %d para el usuario %d", compra.ID, compra.UserID), // Corrected fmt.Sprintf usage
	})

	msg := amqp.Publishing{
		ContentType: "application/json",
		Body:        messageBody,
	}

	err = rabbitmq.Channel.Publish(
		"",                   // exchange
		"email_notificacion", // routing key
		false,                // mandatory
		false,                // immediate
		msg,
	)
	if err != nil {
		// Log the error but don't fail the HTTP request
		fmt.Printf("Failed to publish message to RabbitMQ: %v\n", err)
	}

	c.JSON(http.StatusOK, compra)
}

func GetAllCompras(c *gin.Context) {
    var compras []models.Compra
    if err := database.DB.Find(&compras).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve purchases"})
        return
    }

    c.JSON(http.StatusOK, compras)
}
