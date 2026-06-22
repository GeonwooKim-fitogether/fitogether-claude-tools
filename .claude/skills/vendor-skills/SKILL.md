---
name: vendor-skills
description: 현재 repo의 .claude/skills/ 안에 FITogether 공용 스킬 파일을 직접 복사(vendor)해 넣는다. 사용자가 "이 repo에 스킬 가져와줘", "스킬 vendor", "스킬 파일 넣어줘", "레포에 스킬 복사", "/vendor-skills" 라고 하면 이 스킬을 사용한다. 마켓플레이스 참조만 거는 new-project와 달리, 스킬 파일 자체를 repo 안에 넣어 네트워크/전역 설치 없이도 동작하는 self-contained repo를 만든다.
label_ko: 스킬 vendor
summary_ko: 현재 repo의 .claude/skills/에 공용 스킬 파일을 직접 복사해 self-contained로 만듭니다.
---

# 스킬 vendor (vendor-skills)

현재 작업 중인 repo의 `.claude/skills/` 안에 **FITogether 공용 스킬 파일을 직접 복사**한다.

## new-project 와의 차이

| | `new-project` | `vendor-skills` (이 스킬) |
|---|---|---|
| 방식 | `.claude/settings.json`에 마켓플레이스 **참조**만 기록 | 스킬 **파일 자체**를 `.claude/skills/`에 복사 |
| 네트워크 | 세션마다 마켓플레이스에서 가져옴 | 불필요 — repo만으로 동작 (offline OK) |
| 적합한 경우 | 항상 최신 스킬을 따라가고 싶을 때 | repo를 자급자족(self-contained)으로 고정하고 싶을 때 |

둘 중 무엇이 필요한지 애매하면 사용자에게 먼저 물어본다.

## 워크플로

### 1단계: 대상 확인
- 기본 대상은 **현재 repo 루트**다.
- 사용자가 특정 스킬만 원하면 그 목록만, 아니면 **전체**를 복사한다.

### 2단계: 스킬 복사
가능하면 동봉된 스크립트를 그대로 실행한다 (모든 보조 파일까지 정확히 복사됨):

```bash
curl -sSL https://raw.githubusercontent.com/geonwookim-fitogether/fitogether-claude-tools/main/scripts/install-into-repo.sh | bash
```

curl/네트워크가 막혀 있고 이 repo가 로컬에 이미 있으면, 원본의
`.claude/skills/` 디렉터리를 대상 repo의 `.claude/skills/`로 통째로 복사한다
(`SKILL.md` 뿐 아니라 `assets/`, `reference/` 같은 보조 파일까지 빠짐없이).

### 3단계: 결과 안내 및 커밋
- 어떤 스킬이 복사됐는지 표로 보여준다.
- 사용자에게 물어본 뒤(또는 명시적으로 요청했으면 바로) 커밋한다:
  ```bash
  git add .claude/skills && git commit -m "Vendor fitogether-tools skills"
  ```
- 푸시는 사용자가 요청할 때만 한다.
- 세션을 새로 열면 스킬이 자동 로드된다고 안내한다.

## 주의

- `.claude/skills/`는 repo에 커밋되면 그 repo의 모든 사용자에게 공유되므로,
  팀 공용으로 적합한 스킬만 넣는다.
- 원본이 업데이트되면 같은 스크립트를 다시 실행해 최신화할 수 있다(덮어쓰기).
