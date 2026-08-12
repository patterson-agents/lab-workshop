#!/usr/bin/env bash
# audit-decimals.sh — find float money violations.
# Usage: audit-decimals.sh [--dir <path>] [--json]
# Exit codes: 0 = clean, 1 = violations found, 2 = bad usage.
set -euo pipefail

DIR="src"
FORMAT="text"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dir)  DIR="$2"; shift 2 ;;
    --json) FORMAT="json"; shift ;;
    --help) echo "Find float money violations. Flags: --dir <path>, --json."; exit 0 ;;
    *) echo "error: unknown flag $1 (try --help)" >&2; exit 2 ;;
  esac
done

MATCHES=$(grep -rn --include='*.ts' -E 'price.*: *(number|float)|parseFloat\(.*(price|total|amount)' "$DIR" || true)

if [[ -z "$MATCHES" ]]; then
  [[ "$FORMAT" == "json" ]] && echo '{"violations":[]}' || echo "clean: no float money found in $DIR"
  exit 0
fi

if [[ "$FORMAT" == "json" ]]; then
  echo "$MATCHES" | awk -F: '{printf "{\"file\":\"%s\",\"line\":%s}\n", $1, $2}'
else
  echo "$MATCHES"
fi
exit 1
