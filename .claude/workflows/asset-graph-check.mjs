#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// 자산 그래프 정합 검사 — 프로즈에 묻혀 있던 자산 의존을 기계가 검사한다.
//
// 왜 이 스크립트가 있나. 창고의 자산들은 서로 의존한다 — 예를 들어 데이터베이스
// 쓰기 규칙은 훅·설정과 셋이 한 몸이라 "셋을 함께 옮긴다"고 규칙 문서에 적혀
// 있었다. 그런데 그 의존이 전부 문장 속에 있어서, 반쪽만 배포된 저장소(규칙은
// 있는데 훅이 없는)나 죽은 참조(문서가 가리키는 파일이 없는 저장소)를 기계가
// 잡을 방법이 없었다. 이 스크립트는 asset-graph.json 에 선언된 관계를 읽어
// 그것을 검사한다.
//
// 검사 두 가지:
//   1. 번들(bundle) — "함께 움직여야 하는" 파일 묶음. 묶음의 일부만 존재하면
//      오류다 (전부 있거나 전부 없어야 한다).
//   2. 참조(reference) — from 파일이 있으면 to 파일도 있어야 한다.
//      optional=true 인 참조(동기화되지 않는 docs/ 등)는 경고로만 본다.
//
// 실행:
//   node .claude/workflows/asset-graph-check.mjs                 (현재 저장소 검사)
//   node .claude/workflows/asset-graph-check.mjs --root <경로>    (다른 저장소 검사)
//   node .claude/workflows/asset-graph-check.mjs --readme README.md
//       (창고 전용: .claude/rules/*.md 전부가 README 에 언급되는지도 검사 —
//        표에 없는 규칙은 아무도 그것이 있다는 것을 모른다)
//
// 종료 코드: 오류가 하나라도 있으면 1, 경고만 있으면 0.
// 준비물 없음 — Node 18+ 표준 라이브러리만 쓴다.
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const argv = process.argv.slice(2);
const opt = (name) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : null;
};

const ROOT = opt("--root") || process.cwd();
const README = opt("--readme");
const GRAPH_PATH = opt("--graph") || join(dirname(fileURLToPath(import.meta.url)), "asset-graph.json");

const graph = JSON.parse(readFileSync(GRAPH_PATH, "utf8"));
const errors = [];
const warnings = [];
const has = (p) => existsSync(join(ROOT, p));

// 1. 번들 — 일부만 존재하면 오류
for (const b of graph.bundles || []) {
  const present = b.members.filter(has);
  if (present.length > 0 && present.length < b.members.length) {
    const missing = b.members.filter((m) => !has(m));
    errors.push(
      `번들 반쪽 배포: '${b.name}' — 있음 ${present.length}/${b.members.length}, ` +
      `빠진 것: ${missing.join(", ")}  (이유: ${b.reason})`
    );
  }
}

// 2. 참조 — from 이 있으면 to 도 있어야 한다
for (const r of graph.references || []) {
  if (!has(r.from)) continue;
  if (has(r.to)) continue;
  const line = `죽은 참조: ${r.from} → ${r.to} (대상 없음)`;
  if (r.optional) warnings.push(line + " — optional, 이 저장소에서는 없는 것이 정상일 수 있다");
  else errors.push(line);
}

// 3. (창고 전용) 규칙 파일 전부가 README 에 언급되는가
if (README) {
  const readme = readFileSync(join(ROOT, README), "utf8");
  const rulesDir = join(ROOT, ".claude/rules");
  if (existsSync(rulesDir)) {
    for (const f of readdirSync(rulesDir)) {
      if (!f.endsWith(".md")) continue;
      if (!readme.includes(f)) {
        errors.push(`배선 누락: .claude/rules/${f} 가 ${README} 의 공용 규칙 표에 없다`);
      }
    }
  }
}

// 보고 — 말 없이 넘기지 않는다
const label = basename(ROOT) || ROOT;
if (errors.length === 0 && warnings.length === 0) {
  console.log(`자산 그래프 정합: 통과 (${label} — 번들 ${graph.bundles?.length ?? 0}개, 참조 ${graph.references?.length ?? 0}개 검사)`);
} else {
  for (const w of warnings) console.log(`경고: ${w}`);
  for (const e of errors) console.error(`오류: ${e}`);
  console.log(`요약 (${label}): 오류 ${errors.length}건, 경고 ${warnings.length}건`);
}
process.exit(errors.length > 0 ? 1 : 0);
