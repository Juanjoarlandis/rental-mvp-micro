#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

AUTH=http://localhost:8001/api/auth
CAT=http://localhost:8002/api
REN=http://localhost:8003/api/rentals

USER=alice
MAIL=alice@example.com
PASS=secret

j() { jq -C .; }          # pretty-json coloreado
auth() { curl -s "$@" "${HDR[@]}"; }

echo "──── 1) signup ────"
curl -s -X POST $AUTH/signup \
     -H 'Content-Type: application/json' \
     -d "{\"username\":\"$USER\",\"email\":\"$MAIL\",\"password\":\"$PASS\"}" \
  | j || echo "(ya existe)"

echo "──── 2) login ─────"
TOKEN=$(curl -s -X POST $AUTH/token \
              -H 'Content-Type: application/x-www-form-urlencoded' \
              -d "username=$USER&password=$PASS" | jq -r .access_token)
HDR=(-H "Authorization: Bearer $TOKEN")
echo "JWT: $TOKEN"

echo "──── 3) category & item (en catalog) ─────"
CID=$(curl -s $CAT/categories/ | jq '.[] | select(.name=="Herramientas") | .id')
if [[ -z $CID ]]; then
  CID=$(auth -X POST $CAT/categories/ -H 'Content-Type: application/json' \
        -d '{"name":"Herramientas"}' | jq -r .id)
fi
ITEM=$(auth -X POST $CAT/items/ -H 'Content-Type: application/json' -d @- <<EOF
{
  "name":"Taladro Bosch",
  "description":"800 W",
  "price_per_h":4.5,
  "categories":[$CID],
  "image_urls":["https://picsum.photos/seed/taladro/800/600"]
}
EOF
)
IID=$(echo "$ITEM" | jq -r .id)
echo "item_id = $IID"

echo "──── 4) crear alquiler ─────"
RENT=$(auth -X POST $REN/ -H 'Content-Type: application/json' -d @- <<EOF
{
  "item_id": $IID,
  "start_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "end_at":   "$(date -u -d '+2 hour' +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF
) && echo "$RENT" | j
RID=$(echo "$RENT" | jq -r .id)

echo "──── 5) mis alquileres ─────"
auth $REN/me | j

echo "──── 6) devolución ─────"
auth -X POST $REN/$RID/return | j
