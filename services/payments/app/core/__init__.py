import stripe
from app.core.config import settings

stripe.api_key = settings.secret_key
