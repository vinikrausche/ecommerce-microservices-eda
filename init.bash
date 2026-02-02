#!/usr/bin/env bash
set -euo pipefail

ENVIRONMENT="${1:-dev}"

case "$ENVIRONMENT" in
  dev|prod)
    ;;
  *)
    echo "Uso: ./init.bash [dev|prod]"
    exit 1
    ;;
esac

COMPOSE_FILE="docker-compose.${ENVIRONMENT}.yaml"

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "Arquivo nao encontrado: $COMPOSE_FILE"
  exit 1
fi

echo "Subindo ambiente: $ENVIRONMENT"

docker compose -f "$COMPOSE_FILE" up --build
