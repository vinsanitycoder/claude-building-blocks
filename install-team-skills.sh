#!/usr/bin/env bash
# Installs the team's building-blocks skills (design-standard + 3 others)
# into your personal Claude skills folder. Works on BOTH the Claude Desktop
# app and the terminal Claude Code CLI.
#
# To run: open Terminal, paste this whole file's path, or run:
#   bash <(curl -fsSL https://raw.githubusercontent.com/vinsanitycoder/claude-building-blocks/main/install-team-skills.sh)
set -euo pipefail

DST="$HOME/.claude/skills"
TMP="$(mktemp -d)"
URL="https://github.com/vinsanitycoder/claude-building-blocks/archive/refs/heads/main.tar.gz"
SKILLS=(design-standard ai-model-settings data-importer team-activity)

echo "→ Downloading team building-blocks skills..."
curl -fsSL "$URL" -o "$TMP/bb.tar.gz"
tar -xzf "$TMP/bb.tar.gz" -C "$TMP"
SRC="$TMP/claude-building-blocks-main/plugins/building-blocks/skills"

mkdir -p "$DST"
for s in "${SKILLS[@]}"; do
  rm -rf "$DST/$s"
  cp -R "$SRC/$s" "$DST/$s"
  echo "  ✓ installed: $s"
done
rm -rf "$TMP"

echo ""
echo "✅ Done. Now fully quit Claude Code (Cmd+Q) and reopen it."
echo "   Then ask Claude: \"what skills do you have?\" — you should see design-standard."
