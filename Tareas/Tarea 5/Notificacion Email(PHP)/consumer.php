<?php
require_once __DIR__ . '/vendor/autoload.php';
use PhpAmqpLib\Connection\AMQPStreamConnection;
use PhpAmqpLib\Message\AMQPMessage;

// Configuración de RabbitMQ
$connection = new AMQPStreamConnection('localhost', 5672, 'guest', 'guest');
$channel = $connection->channel();
$queueName = 'email_notificacion';
$channel->queue_declare($queueName, false, true, false, false);

echo " [*] Esperando mensajes en '$queueName'. Para salir, presione CTRL+C\n";

$callback = function (AMQPMessage $msg) {
    echo "\n" . str_repeat('=', 70) . "\n";
    echo " [📧] SERVICIO DE NOTIFICACIÓN DE CORREO ELECTRÓNICO\n";
    echo str_repeat('=', 70) . "\n";
    
    // Decodificar el mensaje JSON (asumiendo que viene en formato JSON)
    $data = json_decode($msg->body, true);
    
    if ($data && isset($data['usuario_id']) && isset($data['compra_id'])) {
        echo " [✓] Enviando correo de confirmación...\n";
        echo " [→] Usuario ID: {$data['usuario_id']}\n";
        echo " [→] Compra ID: {$data['compra_id']}\n";
        
        if (isset($data['email'])) {
            echo " [→] Destinatario: {$data['email']}\n";
        }
        
        if (isset($data['monto'])) {
            echo " [→] Monto: \${$data['monto']}\n";
        }
        
        // Simulación de envío
        echo " [⏳] Procesando envío de correo...\n";
        sleep(1); // Simula el tiempo de envío
        echo " [✓] ¡Correo enviado exitosamente!\n";
    } else {
        // Si el mensaje no es JSON o no tiene la estructura esperada
        echo " [✓] Enviando correo de confirmación...\n";
        echo " [→] Mensaje recibido: {$msg->body}\n";
        echo " [⏳] Procesando envío de correo...\n";
        sleep(1);
        echo " [✓] ¡Correo enviado exitosamente!\n";
    }
    
    echo str_repeat('=', 70) . "\n\n";
    
    // Acknowledge the message
    $msg->ack();
};

$channel->basic_consume($queueName, '', false, false, false, false, $callback);

while ($channel->is_consuming()) {
    $channel->wait();
}

$channel->close();
$connection->close();
?>