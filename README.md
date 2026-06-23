# FITogether Claude Tools 🛠️

FITogether 팀의 **Claude Code 스킬 창고 + 새 프로젝트 템플릿**입니다.
이 repo 하나가 두 가지 역할을 합니다:

1. **스킬 창고** — 모든 공용 스킬이 `.claude/skills/` 에 들어있습니다. 스킬은 여기서만 편집합니다.
2. **프로젝트 템플릿** — 이 repo에서 **"Use this template"** 으로 새 프로젝트를 시작하면,
   스킬이 그대로 따라가 **클라우드·로컬 어디서든 자동 로드**됩니다.

> 💡 Claude Code 웹/클라우드에는 플러그인·마켓플레이스 기능이 없습니다. 그래서 스킬을
> **파일 자체로 repo에 넣는(vendor)** 이 방식이 클라우드·로컬 모두에서 동작하는 정공법입니다.

---

## 🚀 새 프로젝트 시작하기

1. 이 repo에서 초록색 **`Use this template`** ▸ **`Create a new repository`** 클릭
2. 새 repo를 Claude Code(웹·데스크톱·터미널)로 열기
3. 끝. 세션 시작 시 스킬이 자동 로드됩니다. `/` 를 눌러 `humanizer`, `superpower` 등이 보이면 성공.

> 로컬에서 쓸 거면 만든 repo를 `git clone` 하면 됩니다. `.claude/skills/` 가 그대로 따라오니
> 로컬 Claude Code에서도 똑같이 자동 로드됩니다. 별도 설치·명령어 없음.

---

## 📚 포함된 스킬

| 스킬 | 무엇을 해주나요 |
|------|----------------|
| `agent-memory` | 세션 작업을 로컬에 저장하고 다음 세션에서 필요한 맥락만 복원 |
| `andrepathy` | AI의 흔한 코딩 실수 4가지를 막는 코딩 규칙 |
| `claude-video` | 영상 다운로드·프레임/자막 추출·멀티모달 분석 |
| `find-skill` | 목적에 맞는 스킬을 카탈로그에서 찾아줌 |
| `firmware-map` | 펌웨어/임베디드 C 코드베이스를 인터랙티브 HTML로 시각화 |
| `frontend-design` | 'AI 슬롭' 디자인을 막고 세련된 UI 결과물 유도 |
| `humanizer` | AI 문체를 제거하고 자연스러운 사람 말투로 재작성 |
| `remotion` | React 기반 영상 제작의 타이밍·싱크 오류 교정 |
| `skill-creator` | 새 스킬을 코드·테스트·패키징까지 자동 생성 |
| `superpower` | 스펙→계획→테스트를 강제하는 시니어 개발 워크플로 |
| `understand` | 코드베이스 의존성 지식 그래프 생성 및 시각화 |

---

## 🔄 스킬 추가 / 수정 / 삭제 (관리자용)

스킬은 **이 repo의 `.claude/skills/` 에서만** 관리합니다.

- **수정**: `.claude/skills/<스킬>/SKILL.md` 를 고치고 커밋.
- **추가**: `.claude/skills/<새스킬>/SKILL.md` 를 만들고 커밋.
- **삭제**: 해당 폴더를 지우고 커밋.

### 하위 프로젝트는 어떻게 최신이 되나 (수동 포인트 0)
이 템플릿에는 `.github/workflows/sync-skills.yml`(자가 동기화 봇)이 들어있습니다.
**"Use this template"로 만든 모든 repo가 이 봇을 함께 물려받아**, 매주 이 창고의
`.claude/skills/` 를 자기 repo로 다시 받아옵니다. 즉 창고만 고치면 하위 프로젝트들이
알아서 따라옵니다. (즉시 반영이 필요하면 그 repo의 Actions에서 워크플로를 수동 실행)

---

## 🧩 기존 repo에 스킬 넣기

템플릿에서 시작하지 않은 기존 repo라면, 이 repo의 `.claude/skills/` 폴더와
`.github/workflows/sync-skills.yml` 을 복사해 커밋하면 동일하게 동작합니다.
(Claude Code 세션이면 "fitogether-claude-tools의 .claude/skills를 이 repo에 복사해줘" 라고 시키면 됩니다.)

---

## 📌 참고: fitogether-user-guide 스킬

제품 유저가이드 PDF 생성 스킬(`fitogether-user-guide`)은 폰트 등 약 9MB라 모든 프로젝트에
따라붙지 않도록 이 템플릿에서 제외했습니다. 필요하면 이 repo의 git 히스토리(마켓플레이스 구조 시절)
에서 가져오거나 별도 repo로 분리해 쓰세요.
