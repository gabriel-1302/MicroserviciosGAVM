import os
from fastapi import FastAPI
from dotenv import load_dotenv
from app.routes import router as vehiculos_router
import threading
from grpc_server import serve as grpc_serve

# Cargar variables de entorno
load_dotenv()

# Crear la aplicación FastAPI
app = FastAPI()

# Iniciar el servidor gRPC en un hilo separado
@app.on_event("startup")
def startup_event():
    grpc_thread = threading.Thread(target=grpc_serve)
    grpc_thread.daemon = True
    grpc_thread.start()

# Ruta raíz de prueba
@app.get("/")
def read_root():
    return {"message": "Servicio de Vehículos (FastAPI y gRPC) funcionando."}


app.include_router(vehiculos_router, tags=["Vehiculos"], prefix="/api/vehiculos")


