from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrReadOnly(BasePermission):
    """
    Permiso personalizado que requiere autenticación para cualquier acceso.
    Permite acceso de solo lectura a usuarios autenticados.
    Permite acceso completo a usuarios administradores.
    """
    def has_permission(self, request, view):
        # Primero, denegar el acceso si el usuario no está autenticado.
        if not request.user or not request.user.is_authenticated:
            return False

        # Si el usuario está autenticado, permitir acceso de solo lectura (GET, HEAD, OPTIONS).
        if request.method in SAFE_METHODS:
            return True

        # Para métodos de escritura (POST, PUT, DELETE), 
        # requerir que el usuario sea un administrador.
        return request.user.role == 'admin'
