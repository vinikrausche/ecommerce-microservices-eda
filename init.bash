#!/usr/bin/env bash
set -euo pipefail

ENVIRONMENT="${1:-dev}"
WATCH_MODE="${2:-auto}"

case "$ENVIRONMENT" in
  dev|prod)
    ;;
  *)
    echo "Uso: ./init.bash [dev|prod]"
    exit 1
    ;;
esac

case "$WATCH_MODE" in
  auto|watch|no-watch)
    ;;
  *)
    echo "Uso: ./init.bash [dev|prod] [auto|watch|no-watch]"
    exit 1
    ;;
esac

COMPOSE_FILE="docker-compose.${ENVIRONMENT}.yaml"

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "Arquivo nao encontrado: $COMPOSE_FILE"
  exit 1
fi

WATCH_FLAG=""
if [[ "$ENVIRONMENT" == "dev" ]]; then
  if [[ "$WATCH_MODE" == "watch" ]]; then
    WATCH_FLAG="--watch"
  elif [[ "$WATCH_MODE" == "auto" ]]; then
    if docker compose up --help 2>/dev/null | grep -q -- '--watch'; then
      WATCH_FLAG="--watch"
    fi
  fi
fi

echo "Subindo ambiente: $ENVIRONMENT (watch: ${WATCH_FLAG:---disabled})"

docker compose -f "$COMPOSE_FILE" up --build $WATCH_FLAG
