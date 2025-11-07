from fastapi import APIRouter, Body, HTTPException, status, Depends
from typing import List
from .database import get_vehiculos_collection
from .models import Vehiculo, VehiculoBase
from .auth import get_current_user
from bson import ObjectId

router = APIRouter()
collection = get_vehiculos_collection()

@router.post("/", response_description="Añadir nuevo vehículo", response_model=Vehiculo, status_code=status.HTTP_201_CREATED)
def crear_vehiculo(vehiculo: VehiculoBase = Body(...), current_user: dict = Depends(get_current_user)):
    vehiculo_dict = vehiculo.dict()
    result = collection.insert_one(vehiculo_dict)
    nuevo_vehiculo = collection.find_one({"_id": result.inserted_id})
    return nuevo_vehiculo

@router.get("/", response_description="Listar todos los vehículos", response_model=List[Vehiculo])
def listar_vehiculos(current_user: dict = Depends(get_current_user)):
    vehiculos = list(collection.find())
    return vehiculos

@router.get("/{id}", response_description="Obtener un vehículo por ID", response_model=Vehiculo)
def obtener_vehiculo(id: str, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail=f"ID de vehículo inválido: {id}")
    
    vehiculo = collection.find_one({"_id": ObjectId(id)})
    if vehiculo is not None:
        return vehiculo
    
    raise HTTPException(status_code=404, detail=f"Vehículo con ID {id} no encontrado")

@router.put("/{id}", response_description="Actualizar un vehículo", response_model=Vehiculo)
def actualizar_vehiculo(id: str, vehiculo: VehiculoBase = Body(...), current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail=f"ID de vehículo inválido: {id}")

    vehiculo_dict = vehiculo.dict()
    
    result = collection.update_one({"_id": ObjectId(id)}, {"$set": vehiculo_dict})

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail=f"Vehículo con ID {id} no encontrado")

    vehiculo_actualizado = collection.find_one({"_id": ObjectId(id)})
    return vehiculo_actualizado

@router.delete("/{id}", response_description="Eliminar un vehículo")
def eliminar_vehiculo(id: str, current_user: dict = Depends(get_current_user)):
    if not ObjectId.is_valid(id):
        raise HTTPException(status_code=400, detail=f"ID de vehículo inválido: {id}")
        
    result = collection.delete_one({"_id": ObjectId(id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"Vehículo con ID {id} no encontrado")

    return {"status": "success", "message": f"Vehículo con ID {id} eliminado"}
