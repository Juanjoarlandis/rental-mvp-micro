#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

# ───────── Endpoints ────────────────────────────────────────────────────
AUTH=http://localhost:8001/api/auth
UPLD=http://localhost:8004/api/upload

USER=alice
MAIL=alice@example.com
PASS=secret

# ───────── Imagen a subir ───────────────────────────────────────────────
# 1º argumento o, si no, intenta localizar una cualquiera en el repo
if [[ $# -ge 1 ]]; then
  IMG_PATH=$1
else
  # busca la primera .png|.jpg dentro de backend/uploads/ (dummy data del monolito)
  IMG_PATH=$(find ../../backend/uploads -type f -regex '.*\.\(png\|jpe?g\)$' | head -n 1 || true)
  [[ -z $IMG_PATH ]] && { echo "❌ No se encontró ninguna imagen de ejemplo. Pasa la ruta como argumento."; exit 1; }
fi
echo "Usando imagen: $IMG_PATH"

j() { jq -C .; }                      # pretty-json helper
auth() { curl -s "$@" "${HDR[@]}"; }  # wrapper con token

# ───── 1) signup (ignora error si existe) ───────────────────────────────
echo "──── 1) signup ────"
curl -s -X POST $AUTH/signup \
     -H 'Content-Type: application/json' \
     -d "{\"username\":\"$USER\",\"email\":\"$MAIL\",\"password\":\"$PASS\"}" \
  | j || echo "(ya existe)"

# ───── 2) login ────────────────────────────────────────────────────────
echo "──── 2) login ─────"
TOKEN=$(curl -s -X POST $AUTH/token \
              -H 'Content-Type: application/x-www-form-urlencoded' \
              -d "username=$USER&password=$PASS" | jq -r .access_token)
HDR=(-H "Authorization: Bearer $TOKEN")
echo "JWT: $TOKEN"

# ───── 3) upload ───────────────────────────────────────────────────────
echo "──── 3) subir imagen ─────"
RESP=$(curl -s "${HDR[@]}" -F "file=@${IMG_PATH}" "$UPLD/")
echo "$RESP" | j
URL=$(echo "$RESP" | jq -r .url)

# ───── 4) HEAD de la URL pública ───────────────────────────────────────
echo "──── 4) HEAD $URL ─────"
curl -I "$URL" | sed 's/^/   /'
echo -e "\n✔️  Debe ser 200 OK y content-type image/*"
