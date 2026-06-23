#!/usr/bin/env python3
"""
플러그인 폴더를 스캔해서 README.md와 marketplace.json을 자동 생성한다.

단일 진실원천(single source of truth): plugins/<name>/skills/<name>/SKILL.md 의 frontmatter
스킬을 추가/삭제하면 이 스크립트가 두 문서를 자동으로 맞춰준다.

사용법:
    python scripts/generate_docs.py          # README.md, marketplace.json 갱신
    python scripts/generate_docs.py --check  # 갱신이 필요한지만 검사 (CI용, 변경 시 exit 1)
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLUGINS_DIR = ROOT / "plugins"
README = ROOT / "README.md"
MARKETPLACE = ROOT / ".claude-plugin" / "marketplace.json"
# 새 프로젝트 repo에 그대로 복사해 넣을 표준 시드. 템플릿 repo의 내용물이기도 하다.
TEMPLATE_DIR = ROOT / "templates" / "new-repo"
TEMPLATE_SETTINGS = TEMPLATE_DIR / ".claude" / "settings.json"

MARKETPLACE_NAME = "fitogether-tools"
REPO = "geonwookim-fitogether/fitogether-claude-tools"

# 새 프로젝트에 기본으로 켜지 않을 "세팅 전용" 메타 스킬.
# (이 스킬들은 repo를 세팅하는 도구라, 일반 프로젝트에서 상시 켜둘 필요가 없다.)
SETUP_ONLY_SKILLS = {"new-project", "vendor-skills"}

# README 안에서 자동 생성 구간을 표시하는 마커
START = "<!-- SKILLS:START (자동 생성 구간 - 직접 수정하지 마세요) -->"
END = "<!-- SKILLS:END -->"


def parse_frontmatter(skill_md: Path) -> dict:
    """SKILL.md 상단의 YAML frontmatter에서 name, description을 뽑는다."""
    text = skill_md.read_text(encoding="utf-8")
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n", text, re.DOTALL)
    if not m:
        return {}
    fm = {}
    for line in m.group(1).splitlines():
        if ":" in line:
            key, _, val = line.partition(":")
            fm[key.strip()] = val.strip().strip('"').strip("'")
    return fm


def collect_skills() -> list[dict]:
    """plugins/ 아래의 모든 스킬을 스캔한다."""
    skills = []
    if not PLUGINS_DIR.exists():
        return skills
    for plugin_dir in sorted(PLUGINS_DIR.iterdir()):
        if not plugin_dir.is_dir():
            continue
        name = plugin_dir.name
        skill_md = plugin_dir / "skills" / name / "SKILL.md"
        if not skill_md.exists():
            print(f"  ⚠️  {name}: SKILL.md 없음 → 건너뜀")
            continue
        fm = parse_frontmatter(skill_md)
        skills.append({
            "name": name,
            "description": fm.get("description", ""),   # 영어 — Claude가 스킬 트리거 판단에 사용
            "label_ko": fm.get("label_ko", name),       # 한글 이름 (문서용)
            "summary_ko": fm.get("summary_ko", ""),      # 한 줄 한글 요약 (문서용)
            "source": f"./plugins/{name}",
        })
    return skills


def build_marketplace(skills: list[dict]) -> str:
    data = {
        "name": MARKETPLACE_NAME,
        "owner": {"name": "FITogether", "email": "geonwoo.kim@fitogether.com"},
        "plugins": [
            {"name": s["name"], "source": s["source"], "description": s["description"]}
            for s in skills
        ],
    }
    return json.dumps(data, ensure_ascii=False, indent=2) + "\n"


def build_settings(skills: list[dict]) -> str:
    """새 프로젝트 repo용 표준 .claude/settings.json 을 만든다.

    마켓플레이스를 등록하고, 세팅 전용 메타 스킬을 뺀 모든 스킬을 활성화한다.
    스킬을 추가/삭제하면 이 목록이 자동으로 따라가므로 손댈 곳이 없다.
    """
    enabled = {
        f"{s['name']}@{MARKETPLACE_NAME}": True
        for s in skills
        if s["name"] not in SETUP_ONLY_SKILLS
    }
    data = {
        "extraKnownMarketplaces": {
            MARKETPLACE_NAME: {
                "source": {"source": "github", "repo": REPO}
            }
        },
        "enabledPlugins": enabled,
    }
    return json.dumps(data, ensure_ascii=False, indent=2) + "\n"


def short_desc(desc: str) -> str:
    """표에 넣을 한 줄 요약 (첫 문장만)."""
    first = re.split(r"(?<=[.。])\s", desc.strip())[0]
    return first.strip()


def build_skills_section(skills: list[dict]) -> str:
    lines = []
    lines.append(f"> 현재 **{len(skills)}개**의 스킬이 등록되어 있습니다. "
                 "이 구간은 `scripts/generate_docs.py`가 자동으로 생성합니다.")
    lines.append("")
    lines.append("| 스킬 | 한글 이름 | 무엇을 해주나요 | 설치 명령 |")
    lines.append("|------|-----------|----------------|-----------|")
    for s in skills:
        cmd = f"`/plugin install {s['name']}@{MARKETPLACE_NAME}`"
        summary = s["summary_ko"] or short_desc(s["description"])
        lines.append(f"| **{s['name']}** | {s['label_ko']} | {summary} | {cmd} |")
    lines.append("")
    lines.append("### 스킬별 상세 설명")
    lines.append("")
    for s in skills:
        title = f"{s['label_ko']} (`{s['name']}`)" if s["label_ko"] != s["name"] else f"`{s['name']}`"
        lines.append(f"#### {title}")
        lines.append("")
        if s["summary_ko"]:
            lines.append(s["summary_ko"])
            lines.append("")
        lines.append(f"- **설치**: `/plugin install {s['name']}@{MARKETPLACE_NAME}`")
        lines.append(f"- **직접 호출**: `/{s['name']}`")
        lines.append("")
    return "\n".join(lines).rstrip() + "\n"


def build_full_readme(skills_section: str) -> str:
    return f"""# FITogether Claude Tools 🛠️

FITogether 팀이 함께 쓰는 **Claude Code 스킬 모음**입니다.
누구나 명령어 한 줄로 설치해서 바로 사용할 수 있습니다.

---

## 🚀 빠르게 시작하기 (3단계)

Claude Code(터미널, 데스크톱 앱, VS Code 확장 무엇이든)에서 아래를 입력하세요.

**1단계 — 마켓플레이스 등록 (최초 1회만)**
```
/plugin marketplace add {REPO}
```

**2단계 — 원하는 스킬 설치**
```
/plugin install superpower@{MARKETPLACE_NAME}
/plugin install humanizer@{MARKETPLACE_NAME}
```

**3단계 — 끝!** 설치한 스킬은 Claude가 상황에 맞게 자동으로 불러옵니다.
직접 부르고 싶으면 `/superpower` 처럼 스킬 이름을 입력하면 됩니다.

> 💡 나중에 스킬이 업데이트되면 `/plugin marketplace update {MARKETPLACE_NAME}` 로 최신화하세요.

---

## 📚 사용할 수 있는 스킬 목록

{START}
{skills_section}{END}

---

## 🆕 새 프로젝트에 한 번에 적용하기 (수동 포인트 0)

새 repo를 만들 때마다 스킬을 일일이 깔 필요 없습니다. 이 레포가 **표준 설정을 자동 생성**해 둡니다.

- `templates/new-repo/` 폴더 = 새 프로젝트 시드. 안의 `.claude/settings.json`은
  `scripts/generate_docs.py`가 마켓플레이스에서 **자동 생성**하므로 항상 최신 스킬 목록을 담습니다.
- 함께 들어있는 `.github/workflows/sync-skills.yml`(자가 동기화 봇)이 각 프로젝트에서
  주기적으로 그 표준본을 따라가므로, 스킬을 추가/삭제해도 **사람이 손댈 곳이 없습니다.**

**권장 흐름** — 이 시드를 담은 **템플릿 repo**를 하나 만들어 두고("Template repository"로 표시),
새 프로젝트는 GitHub에서 **"Use this template"** 으로 시작하면 됩니다. 그러면 그 repo를 여는
모든 Claude Code 세션(웹/클라우드 포함)이 세션 시작 시 최신 스킬을 자동 로드합니다.

자세한 사용법은 [`templates/new-repo/README.md`](./templates/new-repo/README.md) 참고.

---

## ❓ 자주 묻는 질문

**Q. 스킬을 설치하면 어디에 저장되나요?**
A. 해당 프로젝트의 `.claude/settings.json`에 기록됩니다. 다음에 그 프로젝트를 열면 자동으로 로드됩니다.

**Q. 모든 프로젝트에서 쓰고 싶어요.**
A. 마켓플레이스를 한 번 등록해두면 어느 프로젝트에서든 `/plugin install ...` 로 바로 설치할 수 있습니다.

**Q. 팀원 전체가 자동으로 쓰게 하려면?**
A. 팀 프로젝트 레포의 `.claude/settings.json` 에 아래를 넣어 커밋하세요. clone한 팀원 모두 자동 적용됩니다.
```json
{{
  "extraKnownMarketplaces": {{
    "{MARKETPLACE_NAME}": {{
      "source": {{ "source": "github", "repo": "{REPO}" }}
    }}
  }},
  "enabledPlugins": {{
    "superpower@{MARKETPLACE_NAME}": true
  }}
}}
```

**Q. 스킬이 안 보여요.**
A. Claude Code를 재시작하거나 `/plugin marketplace update {MARKETPLACE_NAME}` 를 실행해보세요.

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
"""


def main():
    check_only = "--check" in sys.argv

    print("📦 플러그인 스캔 중...")
    skills = collect_skills()
    for s in skills:
        print(f"  ✅ {s['name']}")
    print(f"총 {len(skills)}개 스킬 발견\n")

    new_marketplace = build_marketplace(skills)
    skills_section = build_skills_section(skills)
    new_readme = build_full_readme(skills_section)
    new_settings = build_settings(skills)

    old_marketplace = MARKETPLACE.read_text(encoding="utf-8") if MARKETPLACE.exists() else ""
    old_readme = README.read_text(encoding="utf-8") if README.exists() else ""
    old_settings = TEMPLATE_SETTINGS.read_text(encoding="utf-8") if TEMPLATE_SETTINGS.exists() else ""

    changed = (
        new_marketplace != old_marketplace
        or new_readme != old_readme
        or new_settings != old_settings
    )

    if check_only:
        if changed:
            print("❌ 문서가 최신이 아닙니다. `python scripts/generate_docs.py` 를 실행하세요.")
            sys.exit(1)
        print("✅ 문서가 최신 상태입니다.")
        return

    MARKETPLACE.parent.mkdir(parents=True, exist_ok=True)
    MARKETPLACE.write_text(new_marketplace, encoding="utf-8")
    README.write_text(new_readme, encoding="utf-8")
    TEMPLATE_SETTINGS.parent.mkdir(parents=True, exist_ok=True)
    TEMPLATE_SETTINGS.write_text(new_settings, encoding="utf-8")
    print("✨ README.md, marketplace.json, 템플릿 settings.json 갱신 완료" if changed else "변경 사항 없음")


if __name__ == "__main__":
    main()
