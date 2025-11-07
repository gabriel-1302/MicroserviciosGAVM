const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');


const PROTO_PATH = path.join(__dirname, '../protos/vehiculo.proto');


const GRPC_SERVER_ADDRESS = process.env.GRPC_VEHICULOS_SERVICE_ADDRESS || 'localhost:50051';


const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});


const vehiculoProto = grpc.loadPackageDefinition(packageDefinition).vehiculo;

// Crear el cliente gRPC
const client = new vehiculoProto.VehiculoService(GRPC_SERVER_ADDRESS, grpc.credentials.createInsecure());

// Envolver la llamada gRPC en una promesa para un uso más fácil con async/await
function verificarDisponibilidadVehiculo(vehiculo_id) {
    return new Promise((resolve, reject) => {
        client.VerificarDisponibilidad({ vehiculo_id: vehiculo_id }, (error, response) => {
            if (error) {
                console.error('Error en la llamada gRPC:', error);
                // En caso de error (ej. el servicio no responde), asumimos que no está disponible
                return reject(new Error('Error al contactar el servicio de vehículos.'));
            }
            // Devolvemos el valor booleano de la respuesta
            resolve(response.disponible);
        });
    });
}

module.exports = { verificarDisponibilidadVehiculo };
