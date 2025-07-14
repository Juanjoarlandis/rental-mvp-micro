import stripe
from core.config import settings

stripe.api_key = settings.secret_key
