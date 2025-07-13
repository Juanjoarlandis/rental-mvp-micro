from fastapi import APIRouter
from .payments import router as payments_router

router = APIRouter()
router.include_router(payments_router, prefix="/payments", tags=["payments"])

# NOTA: el webhook *no* lleva prefix /api, se monta tal cual en payments.py
