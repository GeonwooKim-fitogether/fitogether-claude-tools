# 새 프로젝트 (FITogether 스킬 자동 적용)

이 폴더는 **새 프로젝트 repo의 시드(seed)** 입니다. 두 개의 파일이 들어있습니다:

- `.claude/settings.json` — [fitogether-claude-tools](https://github.com/geonwookim-fitogether/fitogether-claude-tools)
  마켓플레이스를 가리키는 설정. 이 repo를 여는 모든 Claude Code 세션(웹/클라우드 포함)이
  **세션 시작 시 최신 스킬을 자동으로 불러옵니다.** 로컬 설치도, 명령어도 필요 없습니다.
- `.github/workflows/sync-skills.yml` — **자가 동기화 봇.** 주기적으로(매주) 마켓플레이스의
  표준 목록을 가져와 `.claude/settings.json`을 갱신합니다. 그래서 새 스킬이 추가되면
  이 repo도 알아서 그 스킬을 켭니다.

## 이 시드를 쓰는 법

- **전용 템플릿 repo로 사용 (권장)**: 이 폴더 **내용물**(`.claude/`, `.github/`, 이 README)을
  템플릿 repo 루트에 넣고 GitHub 설정에서 "Template repository"로 표시하세요. 이후 새 프로젝트는
  **"Use this template"** 한 번이면 끝 — 설정과 동기화 봇을 갖고 태어납니다.
- **기존 repo에 적용**: 이 폴더의 `.claude/` 와 `.github/workflows/sync-skills.yml` 을
  그 repo에 복사해 커밋하면 됩니다.

## 손댈 필요 없음 (수동 포인트 0)

- `.claude/settings.json`은 마켓플레이스에서 **자동 생성**됩니다
  ([generate_docs.py](https://github.com/geonwookim-fitogether/fitogether-claude-tools/blob/main/scripts/generate_docs.py) + GitHub Actions).
- 스킬 *내용* 수정 → 세션 시작 시 자동 반영.
- 스킬 추가/삭제 → 표준 목록 자동 갱신 → 이 repo의 동기화 봇이 알아서 따라옴.

> 이 폴더의 파일은 자동 생성/배포됩니다. 직접 수정하지 마세요.
