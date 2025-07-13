FROM python:3.12-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential libffi-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV PYTHONPATH=/app          

# dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ----------  ¡aquí estaba el problema!  ----------
# copia el *directorio*  app/  ⇒  /app/app/   ✅
COPY app/ ./app
# -----------------------------------------------

COPY .env .

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
