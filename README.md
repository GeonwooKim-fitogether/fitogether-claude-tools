# FITogether Claude Tools 🛠️

FITogether 팀이 함께 쓰는 **Claude Code 스킬 모음**입니다.
누구나 명령어 한 줄로 설치해서 바로 사용할 수 있습니다.

---

## 🚀 빠르게 시작하기 (3단계)

Claude Code(터미널, 데스크톱 앱, VS Code 확장 무엇이든)에서 아래를 입력하세요.

**1단계 — 마켓플레이스 등록 (최초 1회만)**
```
/plugin marketplace add geonwookim-fitogether/fitogether-claude-tools
```

**2단계 — 원하는 스킬 설치**
```
/plugin install superpower@fitogether-tools
/plugin install humanizer@fitogether-tools
```

**3단계 — 끝!** 설치한 스킬은 Claude가 상황에 맞게 자동으로 불러옵니다.
직접 부르고 싶으면 `/superpower` 처럼 스킬 이름을 입력하면 됩니다.

> 💡 나중에 스킬이 업데이트되면 `/plugin marketplace update fitogether-tools` 로 최신화하세요.

---

## 📚 사용할 수 있는 스킬 목록

<!-- SKILLS:START (자동 생성 구간 - 직접 수정하지 마세요) -->
> 현재 **14개**의 스킬이 등록되어 있습니다. 이 구간은 `scripts/generate_docs.py`가 자동으로 생성합니다.

| 스킬 | 한글 이름 | 무엇을 해주나요 | 설치 명령 |
|------|-----------|----------------|-----------|
| **agent-memory** | 에이전트 메모리 | 세션 중 한 작업을 로컬에 저장해두고, 다음 세션에서 지금 작업에 꼭 필요한 맥락만 자동으로 다시 불러옵니다. | `/plugin install agent-memory@fitogether-tools` |
| **andrepathy** | 안드레카파시 | AI의 고질적인 4가지 코딩 실수(가정 금지·단순성·외과적 수정·목표 기반 실행)를 막아주는 규칙입니다. | `/plugin install andrepathy@fitogether-tools` |
| **claude-video** | 클로드 비디오 | 유튜브·영상 링크를 다운로드해 프레임과 자막을 추출하고 화면과 음성까지 심층 분석합니다. | `/plugin install claude-video@fitogether-tools` |
| **find-skill** | 파인드 스킬 | 목적만 입력하면 4800개 이상의 카탈로그에서 지금 작업에 가장 적합한 스킬을 찾아 설치해 줍니다. | `/plugin install find-skill@fitogether-tools` |
| **firmware-map** | 펌웨어 맵 | 펌웨어/임베디드 C 코드베이스를 스캔해 클릭 가능한 의존성 그래프·플로우차트·역할 테이블이 담긴 인터랙티브 HTML Explorer를 매번 동일한 형태로 생성합니다. | `/plugin install firmware-map@fitogether-tools` |
| **fitogether-user-guide** | 피투게더 유저 가이드 | 제품 매뉴얼·유저 가이드 요청 시 인터뷰→사진 수집→A4 PDF 제작까지 FITogether 브랜드 기준으로 자동 진행합니다. | `/plugin install fitogether-user-guide@fitogether-tools` |
| **frontend-design** | 프론트엔드 디자인 | 흔히 말하는 'AI 슬롭'(AI가 만든 티가 나는) 디자인을 막고 세련된 UI 결과물을 내도록 돕습니다. | `/plugin install frontend-design@fitogether-tools` |
| **humanizer** | 휴머나이저 | AI 특유의 문체를 없애고, 자연스러운 사람의 말투와 리듬으로 글을 다시 써줍니다. | `/plugin install humanizer@fitogether-tools` |
| **new-project** | 새 프로젝트 세팅 | 현재 repo에 .claude/settings.json을 만들어 FITogether 공용 스킬 전부를 한 번에 연결합니다 (커밋까지). | `/plugin install new-project@fitogether-tools` |
| **remotion** | 리모션 | React 기반 영상 제작에서 AI가 자주 틀리는 애니메이션 타이밍·싱크 오류를 교정해 줍니다. | `/plugin install remotion@fitogether-tools` |
| **skill-creator** | 스킬 크리에이터 | 원하는 기능을 설명하면 코드·테스트·패키징까지 알아서 새 스킬을 만들어 줍니다 (Anthropic 공식). | `/plugin install skill-creator@fitogether-tools` |
| **superpower** | 슈퍼파워 | 냅다 코드부터 짜는 대신 스펙→계획→테스트를 먼저 하도록 시니어 개발 방식을 강제합니다. | `/plugin install superpower@fitogether-tools` |
| **understand** | 언더스탠드 | 코드베이스를 스캔해 의존성 지식 그래프를 만들고 아키텍처를 시각적으로 파악하게 해줍니다. | `/plugin install understand@fitogether-tools` |
| **vendor-skills** | 스킬 vendor | 현재 repo의 .claude/skills/에 공용 스킬 파일을 직접 복사해 self-contained로 만듭니다. | `/plugin install vendor-skills@fitogether-tools` |

### 스킬별 상세 설명

#### 에이전트 메모리 (`agent-memory`)

세션 중 한 작업을 로컬에 저장해두고, 다음 세션에서 지금 작업에 꼭 필요한 맥락만 자동으로 다시 불러옵니다.

- **설치**: `/plugin install agent-memory@fitogether-tools`
- **직접 호출**: `/agent-memory`

#### 안드레카파시 (`andrepathy`)

AI의 고질적인 4가지 코딩 실수(가정 금지·단순성·외과적 수정·목표 기반 실행)를 막아주는 규칙입니다.

- **설치**: `/plugin install andrepathy@fitogether-tools`
- **직접 호출**: `/andrepathy`

#### 클로드 비디오 (`claude-video`)

유튜브·영상 링크를 다운로드해 프레임과 자막을 추출하고 화면과 음성까지 심층 분석합니다.

- **설치**: `/plugin install claude-video@fitogether-tools`
- **직접 호출**: `/claude-video`

#### 파인드 스킬 (`find-skill`)

목적만 입력하면 4800개 이상의 카탈로그에서 지금 작업에 가장 적합한 스킬을 찾아 설치해 줍니다.

- **설치**: `/plugin install find-skill@fitogether-tools`
- **직접 호출**: `/find-skill`

#### 펌웨어 맵 (`firmware-map`)

펌웨어/임베디드 C 코드베이스를 스캔해 클릭 가능한 의존성 그래프·플로우차트·역할 테이블이 담긴 인터랙티브 HTML Explorer를 매번 동일한 형태로 생성합니다.

- **설치**: `/plugin install firmware-map@fitogether-tools`
- **직접 호출**: `/firmware-map`

#### 피투게더 유저 가이드 (`fitogether-user-guide`)

제품 매뉴얼·유저 가이드 요청 시 인터뷰→사진 수집→A4 PDF 제작까지 FITogether 브랜드 기준으로 자동 진행합니다.

- **설치**: `/plugin install fitogether-user-guide@fitogether-tools`
- **직접 호출**: `/fitogether-user-guide`

#### 프론트엔드 디자인 (`frontend-design`)

흔히 말하는 'AI 슬롭'(AI가 만든 티가 나는) 디자인을 막고 세련된 UI 결과물을 내도록 돕습니다.

- **설치**: `/plugin install frontend-design@fitogether-tools`
- **직접 호출**: `/frontend-design`

#### 휴머나이저 (`humanizer`)

AI 특유의 문체를 없애고, 자연스러운 사람의 말투와 리듬으로 글을 다시 써줍니다.

- **설치**: `/plugin install humanizer@fitogether-tools`
- **직접 호출**: `/humanizer`

#### 새 프로젝트 세팅 (`new-project`)

현재 repo에 .claude/settings.json을 만들어 FITogether 공용 스킬 전부를 한 번에 연결합니다 (커밋까지).

- **설치**: `/plugin install new-project@fitogether-tools`
- **직접 호출**: `/new-project`

#### 리모션 (`remotion`)

React 기반 영상 제작에서 AI가 자주 틀리는 애니메이션 타이밍·싱크 오류를 교정해 줍니다.

- **설치**: `/plugin install remotion@fitogether-tools`
- **직접 호출**: `/remotion`

#### 스킬 크리에이터 (`skill-creator`)

원하는 기능을 설명하면 코드·테스트·패키징까지 알아서 새 스킬을 만들어 줍니다 (Anthropic 공식).

- **설치**: `/plugin install skill-creator@fitogether-tools`
- **직접 호출**: `/skill-creator`

#### 슈퍼파워 (`superpower`)

냅다 코드부터 짜는 대신 스펙→계획→테스트를 먼저 하도록 시니어 개발 방식을 강제합니다.

- **설치**: `/plugin install superpower@fitogether-tools`
- **직접 호출**: `/superpower`

#### 언더스탠드 (`understand`)

코드베이스를 스캔해 의존성 지식 그래프를 만들고 아키텍처를 시각적으로 파악하게 해줍니다.

- **설치**: `/plugin install understand@fitogether-tools`
- **직접 호출**: `/understand`

#### 스킬 vendor (`vendor-skills`)

현재 repo의 .claude/skills/에 공용 스킬 파일을 직접 복사해 self-contained로 만듭니다.

- **설치**: `/plugin install vendor-skills@fitogether-tools`
- **직접 호출**: `/vendor-skills`
<!-- SKILLS:END -->

---

## 🆕 새 프로젝트에서 스킬 쓰기 (가장 쉬운 길)

새 repo를 만들 때마다 스킬을 깔 필요가 없습니다. **템플릿 repo에서 시작**하면 끝입니다.

### 1단계 — 템플릿에서 새 repo 만들기
1. 템플릿 repo [**Template-repository**](https://github.com/geonwookim-fitogether/Template-repository) 로 이동
2. 초록색 **`Use this template`** ▸ **`Create a new repository`** 클릭
3. 새 프로젝트 이름을 정하고 생성

→ 이렇게 만든 repo에는 `.claude/settings.json`이 **처음부터 들어있습니다.** (마켓플레이스 연결 + 전체 스킬 활성화)

### 2단계 — 그 repo를 Claude Code로 열기
터미널/데스크톱/웹 무엇이든 그 repo를 열면, 세션 시작 시 **최신 스킬이 자동 로드**됩니다.
별도 설치나 명령어가 필요 없습니다. 직접 부르고 싶으면 `/superpower` 처럼 스킬 이름을 입력하면 됩니다.

> 잘 떴는지 확인: 세션에서 `/` 를 입력해 스킬 목록에 `superpower`, `humanizer` 등이 보이면 성공입니다.

### 왜 손댈 게 없나 (수동 포인트 0)
- **스킬 내용 수정** → 세션 시작 시 마켓플레이스에서 자동으로 최신본을 당겨옵니다.
- **스킬 추가/삭제** → `scripts/generate_docs.py`가 표준 `.claude/settings.json`(`templates/new-repo/`)을
  자동 갱신하고, 템플릿으로 만든 각 프로젝트의 `sync-skills.yml` 봇이 주기적으로 그걸 따라갑니다.

> 기존 repo에 적용하려면 [`templates/new-repo/`](./templates/new-repo/)의 `.claude/` 와
> `.github/workflows/sync-skills.yml` 을 그 repo에 복사해 커밋하세요.
> 마켓플레이스 없이 스킬 파일을 repo 안에 직접 넣고 싶으면 `/vendor-skills` 를 쓰면 됩니다.

---

## ❓ 자주 묻는 질문

**Q. 스킬을 설치하면 어디에 저장되나요?**
A. 해당 프로젝트의 `.claude/settings.json`에 기록됩니다. 다음에 그 프로젝트를 열면 자동으로 로드됩니다.

**Q. 모든 프로젝트에서 쓰고 싶어요.**
A. 마켓플레이스를 한 번 등록해두면 어느 프로젝트에서든 `/plugin install ...` 로 바로 설치할 수 있습니다.

**Q. 팀원 전체가 자동으로 쓰게 하려면?**
A. 팀 프로젝트 레포의 `.claude/settings.json` 에 아래를 넣어 커밋하세요. clone한 팀원 모두 자동 적용됩니다.
```json
{
  "extraKnownMarketplaces": {
    "fitogether-tools": {
      "source": { "source": "github", "repo": "geonwookim-fitogether/fitogether-claude-tools" }
    }
  },
  "enabledPlugins": {
    "superpower@fitogether-tools": true
  }
}
```

**Q. 스킬이 안 보여요.**
A. Claude Code를 재시작하거나 `/plugin marketplace update fitogether-tools` 를 실행해보세요.

---

## 🧩 새 스킬 추가 / 삭제하는 법 (관리자용)

이 레포는 **플러그인 폴더가 곧 문서**입니다. 폴더만 추가/삭제하면 이 README와 마켓플레이스 카탈로그가 **자동으로** 갱신됩니다.

### 새 스킬 추가
1. 아래 구조로 폴더와 파일을 만듭니다.
   ```
   plugins/<스킬이름>/
   ├── .claude-plugin/plugin.json
   └── skills/<스킬이름>/SKILL.md
   ```
2. `SKILL.md` 상단에 frontmatter를 작성합니다.
   ```markdown
   ---
   name: <스킬이름>
   description: <한 문장 설명. 언제 이 스킬을 써야 하는지 구체적으로.>
   ---
   ```
3. 커밋 & 푸시하면 GitHub Actions가 README와 `marketplace.json`을 자동 업데이트합니다.

### 스킬 삭제
`plugins/<스킬이름>/` 폴더를 지우고 푸시하면 됩니다. 문서에서도 자동으로 빠집니다.

### 로컬에서 직접 문서 갱신
```bash
python scripts/generate_docs.py
```

---

*이 문서의 스킬 목록 구간은 `scripts/generate_docs.py`가 자동 생성합니다. 직접 수정하지 마세요.*
