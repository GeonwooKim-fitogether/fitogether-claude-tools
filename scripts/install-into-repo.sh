#!/bin/bash
# FITogether Claude Skills — repo 내부(vendor) 설치 스크립트
#
# 전역(~/.claude/skills)이 아니라 "현재 repo"의 .claude/skills/ 안에 스킬 파일을
# 직접 복사해 넣는다. 이렇게 하면 마켓플레이스 등록·전역 설치 없이도 그 repo를
# 여는 누구나(웹/클라우드 세션 포함) 같은 스킬을 바로 쓸 수 있다.
#
# 사용법 (스킬을 넣고 싶은 repo 루트에서 실행):
#   curl -sSL https://raw.githubusercontent.com/geonwookim-fitogether/fitogether-claude-tools/main/scripts/install-into-repo.sh | bash
#
# 특정 디렉터리를 대상으로 하려면 첫 번째 인자로 경로를 넘긴다:
#   ./install-into-repo.sh /path/to/repo

set -euo pipefail

REPO_URL="https://github.com/geonwookim-fitogether/fitogether-claude-tools.git"
TARGET_DIR="${1:-$PWD}"
DEST="$TARGET_DIR/.claude/skills"

echo "🚀 FITogether 스킬을 repo 안에 설치합니다 → $DEST"

# 1) 원본 repo를 임시 폴더에 얕게(clone) 받는다 — 모든 보조 파일까지 정확히 복사하기 위함
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
git clone --depth 1 --quiet "$REPO_URL" "$TMP"

SRC="$TMP/.claude/skills"
if [ ! -d "$SRC" ]; then
  echo "❌ 원본에서 스킬 디렉터리를 찾지 못했습니다: $SRC" >&2
  exit 1
fi

# 2) 현재 repo의 .claude/skills/ 로 통째로 복사 (보조 파일 포함)
mkdir -p "$DEST"
count=0
for skill in "$SRC"/*/; do
  name="$(basename "$skill")"
  rm -rf "$DEST/$name"
  cp -r "$skill" "$DEST/$name"
  echo "  ✅ $name"
  count=$((count + 1))
done

echo ""
echo "✨ 완료! ${count}개 스킬이 $DEST 에 설치됐습니다."
echo "   변경사항을 커밋하면 이 repo를 여는 누구나 스킬을 쓸 수 있습니다:"
echo "     git add .claude/skills && git commit -m 'Vendor fitogether-tools skills'"
