### ───────────────────────── build stage ─────────────────────────
FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Herramientas y headers para compilar wheels (psycopg2, bcrypt, etc.)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    build-essential \
    libffi-dev \
    libpq-dev \          
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


### ───────────────────────── runtime stage ───────────────────────
#  Contenedor final ► sin root  +  sólo dependencias runtime
FROM python:3.12-slim

# 1️⃣  libpq5 *runtime* – lo mínimo para que psycopg2 funcione
RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq5 \
    && rm -rf /var/lib/apt/lists/*

# 2️⃣  Copiamos todo lo instalado por pip en el stage base
COPY --from=base /usr/local /usr/local

WORKDIR /app
ENV PYTHONPATH=/app

# 3️⃣  Creamos un usuario no-root y lo usamos
RUN adduser --disabled-password --gecos '' appuser
USER appuser

# 4️⃣  Código y configuración
COPY --chown=appuser:appuser app/          ./app
COPY --chown=appuser:appuser migrations/   ./migrations
COPY --chown=appuser:appuser alembic.ini   .
COPY --chown=appuser:appuser .env          .

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
