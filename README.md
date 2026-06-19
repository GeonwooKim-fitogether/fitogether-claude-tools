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
> 현재 **11개**의 스킬이 등록되어 있습니다. 이 구간은 `scripts/generate_docs.py`가 자동으로 생성합니다.

| 스킬 | 한글 이름 | 무엇을 해주나요 | 설치 명령 |
|------|-----------|----------------|-----------|
| **agent-memory** | 에이전트 메모리 | 세션 중 한 작업을 로컬에 저장해두고, 다음 세션에서 지금 작업에 꼭 필요한 맥락만 자동으로 다시 불러옵니다. | `/plugin install agent-memory@fitogether-tools` |
| **andrepathy** | 안드레카파시 | AI의 고질적인 4가지 코딩 실수(가정 금지·단순성·외과적 수정·목표 기반 실행)를 막아주는 규칙입니다. | `/plugin install andrepathy@fitogether-tools` |
| **claude-video** | 클로드 비디오 | 유튜브·영상 링크를 다운로드해 프레임과 자막을 추출하고 화면과 음성까지 심층 분석합니다. | `/plugin install claude-video@fitogether-tools` |
| **find-skill** | 파인드 스킬 | 목적만 입력하면 4800개 이상의 카탈로그에서 지금 작업에 가장 적합한 스킬을 찾아 설치해 줍니다. | `/plugin install find-skill@fitogether-tools` |
| **fitogether-user-guide** | 유저 가이드 제작 | 담당자 인터뷰 및 사진 수집부터 Fitogether 브랜드 디자인(차콜+그린, Pretendard)으로 A4 PDF 유저 가이드를 자동 생성합니다. | `/plugin install fitogether-user-guide@fitogether-tools` |
| **frontend-design** | 프론트엔드 디자인 | 흔히 말하는 'AI 슬롭'(AI가 만든 티가 나는) 디자인을 막고 세련된 UI 결과물을 내도록 돕습니다. | `/plugin install frontend-design@fitogether-tools` |
| **humanizer** | 휴머나이저 | AI 특유의 문체를 없애고, 자연스러운 사람의 말투와 리듬으로 글을 다시 써줍니다. | `/plugin install humanizer@fitogether-tools` |
| **remotion** | 리모션 | React 기반 영상 제작에서 AI가 자주 틀리는 애니메이션 타이밍·싱크 오류를 교정해 줍니다. | `/plugin install remotion@fitogether-tools` |
| **skill-creator** | 스킬 크리에이터 | 원하는 기능을 설명하면 코드·테스트·패키징까지 알아서 새 스킬을 만들어 줍니다 (Anthropic 공식). | `/plugin install skill-creator@fitogether-tools` |
| **superpower** | 슈퍼파워 | 냅다 코드부터 짜는 대신 스펙→계획→테스트를 먼저 하도록 시니어 개발 방식을 강제합니다. | `/plugin install superpower@fitogether-tools` |
| **understand** | 언더스탠드 | 코드베이스를 스캔해 의존성 지식 그래프를 만들고 아키텍처를 시각적으로 파악하게 해줍니다. | `/plugin install understand@fitogether-tools` |

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

#### 유저 가이드 제작 (`fitogether-user-guide`)

담당자 인터뷰 및 사진 수집부터 Fitogether 브랜드 디자인(차콜+그린, Pretendard)으로 A4 PDF 유저 가이드를 자동 생성합니다.

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
<!-- SKILLS:END -->

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
