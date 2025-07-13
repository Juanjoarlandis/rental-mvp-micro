"""
Ejemplo de *cron worker* (Celery, RQ, etc.) que captura pagos
una vez confirmado que el ítem se ha devuelto.
"""
from sqlalchemy.orm import Session
import stripe, time
from app.models.database import SessionLocal
from app import crud
from app.core.config import settings

def run_forever():
    while True:
        with SessionLocal() as db:          # type: Session
            pending = db.query(crud.get_by_pi.__annotations__["return"]).filter_by(
                captured=False, refunded=False
            )
            for p in pending:
                # Aquí llamarías al API del microservicio rentals para ver si returned = true
                # demo: asumimos que sí tras 2 h
                try:
                    stripe.PaymentIntent.capture(p.stripe_pi)
                    crud.capture(db, p)
                except Exception as e:  # noqa: BLE001
                    print("No se pudo capturar:", e)

        time.sleep(600)  # cada 10 min

if __name__ == "__main__":
    run_forever()
