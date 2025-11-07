import grpc
from concurrent import futures
import os
from bson import ObjectId


from app import vehiculo_pb2
from app import vehiculo_pb2_grpc


from app.database import get_vehiculos_collection


collection = get_vehiculos_collection()


class VehiculoService(vehiculo_pb2_grpc.VehiculoServiceServicer):
    
    # Implementar el método 'VerificarDisponibilidad'
    def VerificarDisponibilidad(self, request, context):
        vehiculo_id = request.vehiculo_id
        
        print(f"gRPC: Solicitud de disponibilidad recibida para el vehículo ID: {vehiculo_id}")

        
        if not ObjectId.is_valid(vehiculo_id):
            print(f"gRPC: ID inválido: {vehiculo_id}")
            # Devolver que no está disponible si el ID no es válido
            return vehiculo_pb2.DisponibilidadResponse(disponible=False)

        
        vehiculo = collection.find_one({"_id": ObjectId(vehiculo_id)})

        
        if vehiculo and vehiculo.get("estado") == "disponible":
            print(f"gRPC: Vehículo {vehiculo_id} está disponible.")
            return vehiculo_pb2.DisponibilidadResponse(disponible=True)
        else:
            print(f"gRPC: Vehículo {vehiculo_id} no encontrado o no disponible.")
            return vehiculo_pb2.DisponibilidadResponse(disponible=False)

def serve():
    
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    
    # Añadir nuestro servicio al servidor
    vehiculo_pb2_grpc.add_VehiculoServiceServicer_to_server(VehiculoService(), server)
    
    
    grpc_port = os.getenv("GRPC_PORT", "50051")
    server.add_insecure_port(f'[::]:{grpc_port}')
    
    print(f"Servidor gRPC iniciado y escuchando en el puerto {grpc_port}...")
    server.start()
    server.wait_for_termination()
