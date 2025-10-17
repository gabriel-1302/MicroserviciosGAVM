package handlers

import (
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetEvents(c *gin.Context) {
	// URL del servicio de eventos de Python
	eventServiceURL := "http://localhost:8000/api/events/"

	// Crear una nueva petición HTTP
	req, err := http.NewRequest("GET", eventServiceURL, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request to event service"})
		return
	}

	// Reenviar la cabecera de autorización del cliente original
	authHeader := c.GetHeader("Authorization")
	if authHeader != "" {
		req.Header.Set("Authorization", authHeader)
	}

	// Realizar la petición HTTP
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get events from event service"})
		return
	}
	defer resp.Body.Close()

	// Leer la respuesta del servicio de eventos
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read response from event service"})
		return
	}

	// Devolver la respuesta del servicio de eventos tal cual
	c.Data(resp.StatusCode, "application/json", body)
}
