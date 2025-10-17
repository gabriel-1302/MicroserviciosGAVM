package main

import (
	"compra-entradas/auth"
	"compra-entradas/database"
	"compra-entradas/handlers"
	"compra-entradas/models"
	"compra-entradas/rabbitmq"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Conectar a la base de datos
	database.ConnectDatabase()
	// Migrar el schema
	database.DB.AutoMigrate(&models.Compra{})

	// Conectar a RabbitMQ
	rabbitmq.ConnectRabbitMQ()
	defer rabbitmq.CloseRabbitMQ()

	r := gin.Default()

	// Configurar CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // Permitir todos los orígenes
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Rutas de la API
	api := r.Group("/api")
	api.Use(auth.AuthMiddleware()) // Aplicar el middleware de autenticación a todo el grupo /api
	{
		// Endpoints de compras
		api.GET("/events", handlers.GetEvents)
		api.POST("/comprar", handlers.CreateCompra)
		api.POST("/pagar/:id", handlers.PagarCompra)

		// Endpoint solo para administradores
		api.GET("/compras", auth.AdminOnly(), handlers.GetAllCompras)
	}

	r.Run(":3002") // El servicio correrá en el puerto 3002
}
