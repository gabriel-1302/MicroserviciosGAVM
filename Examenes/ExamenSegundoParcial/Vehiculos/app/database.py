import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DATABASE = os.getenv("MONGO_DATABASE")

client = MongoClient(MONGO_URI)
db = client[MONGO_DATABASE]

def get_vehiculos_collection():
    return db.vehiculos
