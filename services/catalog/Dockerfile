FROM python:3.12-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends libffi-dev build-essential libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV PYTHONPATH=/app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# código + alembic + env
COPY app/         ./app
COPY alembic.ini  .
COPY migrations/  ./migrations
COPY .env         .

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
