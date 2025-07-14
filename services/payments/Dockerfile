FROM python:3.12-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential libffi-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV PYTHONPATH=/app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia contenidos de app/ directo a /app/ (main.py en /app/main.py)
COPY app/ .

COPY .env .

EXPOSE 8000
# FIX: Cambia a "main:app" (no app.main, ya que no hay subdir app/)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]