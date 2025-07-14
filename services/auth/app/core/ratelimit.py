from slowapi import Limiter
from slowapi.util import get_remote_address

# instancia única que compartirán todos los routers
# MODIFIED: Auditado - límites más estrictos para prevenir abuso
limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])  # Límite global por IP