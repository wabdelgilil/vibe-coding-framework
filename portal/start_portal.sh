#!/usr/bin/env sh
set -eu

PORTAL_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
PREF_FILE="$PORTAL_DIR/.portal-pref"
MODE=""

if [ "${1:-}" = "--reset" ]; then
  rm -f "$PREF_FILE"
  echo "Saved portal preference cleared."
fi

if [ -f "$PREF_FILE" ]; then
  MODE="$(cat "$PREF_FILE")"
fi

HAS_NODE=0; command -v node >/dev/null 2>&1 && HAS_NODE=1
HAS_PY=0; command -v python3 >/dev/null 2>&1 && HAS_PY=1

if [ -z "$MODE" ]; then
  echo "=== Project Governance Portal - Local Launcher ==="
  if [ "$HAS_NODE" -eq 1 ]; then
    echo "  [1] Live Local Server via Node.js (Recommended, 127.0.0.1)"
    echo "  [2] Direct Browser Mode (No server, select folder in browser)"
    printf "Choose mode [1/2]: "
    read -r CHOICE
    [ "$CHOICE" = "2" ] && MODE="browser" || MODE="node"
  elif [ "$HAS_PY" -eq 1 ]; then
    echo "  [1] Local Static Server via Python3 (127.0.0.1)"
    echo "  [2] Direct Browser Mode (Zero install)"
    echo "  [3] Print Node.js download URL (optional)"
    printf "Choose mode [1/2/3]: "
    read -r CHOICE
    if [ "$CHOICE" = "3" ]; then
      echo "Download Node.js: https://nodejs.org/"
      exit 0
    fi
    [ "$CHOICE" = "2" ] && MODE="browser" || MODE="python"
  else
    echo "Node.js and Python3 not found."
    echo "  [1] Direct Browser Mode (Zero install)"
    echo "  [2] Print Node.js download URL (optional)"
    printf "Choose mode [1/2]: "
    read -r CHOICE
    if [ "$CHOICE" = "2" ]; then
      echo "Download Node.js: https://nodejs.org/"
      exit 0
    fi
    MODE="browser"
  fi
  printf "%s\n" "$MODE" > "$PREF_FILE"
  echo "Saved preference: $MODE (run './start_portal.sh --reset' to change)"
fi

open_url() {
  if command -v open >/dev/null 2>&1; then open "$1"
  elif command -v xdg-open >/dev/null 2>&1; then xdg-open "$1"
  else echo "Open in browser: $1"; fi
}

if [ "$MODE" = "node" ] && [ "$HAS_NODE" -eq 1 ]; then
  exec node "$PORTAL_DIR/server.mjs"
elif [ "$MODE" = "python" ] && [ "$HAS_PY" -eq 1 ]; then
  open_url "http://127.0.0.1:4173/portal/"
  cd "$PORTAL_DIR/.."
  exec python3 -m http.server 4173 --bind 127.0.0.1
else
  open_url "file://$PORTAL_DIR/index.html"
fi
