#!/usr/bin/env bash
set -euo pipefail

cmd="${1:-help}"

run() {
  echo "+ $*"
  "$@"
}

case "$cmd" in
  check)
    run npm run lint
    run npm run format:check
    run npm run build
    ;;
  lint)
    run npm run lint
    ;;
  format)
    run npm run format
    ;;
  build)
    run npm run build
    ;;
  help|*)
    cat <<'EOF'
skills.sh — project checks

Usage:
  ./skills.sh check   # lint + format check + build
  ./skills.sh lint
  ./skills.sh format
  ./skills.sh build

Conventions for coding agents: see AGENTS.md
EOF
    ;;
esac
