from pydantic import BaseModel, Field
from bson import ObjectId
from enum import Enum
from typing import Any
from pydantic_core import core_schema

# Para manejar el tipo ObjectId de MongoDB en Pydantic V2
class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, source: Any, handler
    ) -> core_schema.CoreSchema:
        return core_schema.union_schema(
            [
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema(
                    [
                        core_schema.str_schema(),
                        core_schema.no_info_plain_validator_function(cls.validate),
                    ]
                ),
            ],
            serialization=core_schema.plain_serializer_function_ser_schema(str),
        )

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

# Enums para valores permitidos
class TipoVehiculo(str, Enum):
    camion = "camion"
    furgon = "furgon"
    moto = "moto"

class EstadoVehiculo(str, Enum):
    disponible = "disponible"
    en_ruta = "en ruta"
    mantenimiento = "mantenimiento"

# Modelo Base para la creación (sin el ID)
class VehiculoBase(BaseModel):
    placa: str
    tipo: TipoVehiculo
    capacidad: int = Field(..., gt=0) # Capacidad debe ser mayor a 0
    estado: EstadoVehiculo

# Modelo para la respuesta (incluye el ID)
class Vehiculo(VehiculoBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
