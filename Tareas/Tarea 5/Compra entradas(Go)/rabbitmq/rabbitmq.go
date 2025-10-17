package rabbitmq

import (
	"log"

	amqp "github.com/rabbitmq/amqp091-go"
)

var Channel *amqp.Channel

func ConnectRabbitMQ() {
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		log.Fatalf("Failed to connect to RabbitMQ: %v", err)
	}

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Failed to open a channel: %v", err)
	}
	Channel = ch

	// Declarar la cola
	_, err = Channel.QueueDeclare(
		"email_notificacion", // name
		true,                 // durable
		false,                // delete when unused
		false,                // exclusive
		false,                // no-wait
		nil,                  // arguments
	)
	if err != nil {
		log.Fatalf("Failed to declare a queue: %v", err)
	}

	log.Println("Successfully connected to RabbitMQ and declared queue.")
}

func CloseRabbitMQ() {
	if Channel != nil {
		Channel.Close()
	}
}
