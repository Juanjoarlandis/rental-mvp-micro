#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

AUTH=http://localhost:8001/api/auth
CAT=http://localhost:8002/api
USERNAME=demo; EMAIL=demo@example.com; PASSWORD=demo

j() { jq -C .; }            # pretty-json coloreado
auth() { curl -s "$@" "${AUTHZ[@]}"; }

echo "────────── 1) SIGN-UP ──────────"
curl -s -X POST "$AUTH/signup" \
     -H 'Content-Type: application/json' \
     -d "{\"username\":\"$USERNAME\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
  | j || echo "(usuario ya existe)"

echo "────────── 2) LOGIN ────────────"
TOKEN=$(curl -s -X POST "$AUTH/token" \
              -H 'Content-Type: application/x-www-form-urlencoded' \
              -d "username=$USERNAME&password=$PASSWORD" \
        | jq -r .access_token)
AUTHZ=(-H "Authorization: Bearer $TOKEN")
echo "JWT => $TOKEN"

echo "────────── 3) /me ──────────────"
# Detecta cuál de los dos paths expone el servicio
for ME in "$AUTH/me" "$AUTH/users/me"; do
  CODE=$(curl -s -o /dev/null -w '%{http_code}' "$ME" "${AUTHZ[@]}")
  [[ $CODE == 200 ]] && { curl -s "$ME" "${AUTHZ[@]}" | j; break; }
done

echo "────────── 4) CATEGORIES ───────"
declare -A CIDs
for NAME in "Herramientas" "Decoración"; do
  # ¿existe ya?
  CID=$(curl -s "$CAT/categories/" | jq ".[] | select(.name==\"$NAME\") | .id")
  if [[ -z $CID ]]; then
     CID=$(curl -s -X POST "$CAT/categories/" "${AUTHZ[@]}" \
                 -H 'Content-Type: application/json' \
                 -d "{\"name\":\"$NAME\"}" | jq -r .id)
  fi
  CIDs[$NAME]=$CID
  echo "• $NAME id=${CID}"
done

echo "────────── 5) ITEMS CRUD ───────"
DATA='{
  "name":"Taladro Bosch",
  "description":"800 W",
  "price_per_h":4.5,
  "image_urls":["https://picsum.photos/seed/taladro/800/600"]
}'
# Sólo enviamos categories si tenemos IDs válidos
[[ -n ${CIDs[Herramientas]} ]] && \
  DATA=$(jq --argjson cid ${CIDs[Herramientas]} '. + {categories:[$cid]}' <<<"$DATA")

ITEM=$(curl -s -X POST "$CAT/items/" "${AUTHZ[@]}" \
            -H 'Content-Type: application/json' \
            -d "$DATA")
echo "$ITEM" | j
IID=$(echo "$ITEM" | jq -r .id)

echo "── GET públicos /items?available=true"
curl -s "$CAT/items?available=true" | j

echo "── GET privados  /items/me"
auth "$CAT/items/me" | j

echo "── PATCH /items/$IID (añade Decoración, cambia precio)"
PATCH=$(jq --argjson cid ${CIDs[Decoración]} '{price_per_h:5.0,categories:[$cid]}' <<<"{}")
auth -X PATCH "$CAT/items/$IID" \
     -H 'Content-Type: application/json' \
     -d "$PATCH" | j

echo "── DELETE /items/$IID"
auth -X DELETE "$CAT/items/$IID" -w '\n(status %{http_code})\n'

echo "── /items/me debería estar vacío"
auth "$CAT/items/me" | j

echo "────────── 6) UPLOAD ───────────"
if [[ -f sample.jpg ]]; then
  auth -X POST "$CAT/upload/" -F "file=@sample.jpg" | j
else
  echo "(sin sample.jpg; omitiendo)"
fi

echo -e "\n✅  tests completados"
