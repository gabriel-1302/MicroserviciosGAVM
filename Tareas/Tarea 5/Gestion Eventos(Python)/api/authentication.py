import jwt
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
from django.contrib.auth.models import User

class SimpleUser(object):
    def __init__(self, payload):
        self.id = payload.get('id')
        self.role = payload.get('role')
        self.is_authenticated = True

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')

        if not auth_header:
            return None

        try:
            # Espera un formato "Bearer <token>"
            prefix, token = auth_header.split()
            if prefix.lower() != 'bearer':
                raise exceptions.AuthenticationFailed('El encabezado de autorización debe comenzar con Bearer')

            # La clave secreta debe ser la misma que en el servicio de usuarios
            SECRET_KEY = 'your-secret-key'
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])

            # Crea un objeto de usuario simple a partir del payload del token
            user = SimpleUser(payload)
            return (user, token)

        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('El token ha expirado')
        except (jwt.InvalidTokenError, ValueError, TypeError):
            raise exceptions.AuthenticationFailed('Token inválido')
        except Exception as e:
            # Captura cualquier otra excepción para depuración
            print(f"Error de autenticación: {e}")
            raise exceptions.AuthenticationFailed('No se pudo autenticar el token')
