#!/usr/bin/env node
// kimlead-verified.js 의 배선 시험 — 되돌아가는 엣지가 실제로 발동하는가.
//
// 왜 이 시험이 있나. 이 엔진의 완결성 비평가는 "이번 검토가 통째로 놓친 각도"를
// 찾아내는데, 한동안 **그 산출을 받아 쓰는 코드가 없었다.** 찾아 놓고 결과 파일에
// 적히고 끝났다 — 만들어 놓고 아무도 부르지 않는 코드이고, communication 규칙 7-2 가
// 말하는 배선 누락이다. 그 배선을 이었으므로, 이 시험은 "이었다"가 아니라
// **"실제로 발동한다"** 를 확인한다.
//
// 여기서 확인하는 것은 오케스트레이션 배선이지 에이전트의 답이 아니다. 그래서
// agent 를 스텁(정해진 값을 돌려주는 가짜)으로 갈아 끼우고 스크립트 본문을 그대로
// 돌린다. 토큰을 쓰지 않으므로 매번 돌릴 수 있다.
//
// 사용: node .claude/workflows/kimlead-verified.test.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "kimlead-verified.js");

// ── 스크립트 본문을 런타임과 같은 모양으로 감싸 실행 가능한 함수로 만든다 ──────
// 워크플로 런타임은 스크립트 본문을 함수 안에서 돌리므로 최상위 return 이 정상이다.
// 그래서 여기서도 같은 방식으로 감싼다 (export 만 떼어 낸다).
function loadWorkflow() {
  const src = readFileSync(SRC, "utf-8").replace("export const meta", "const meta");
  // eslint-disable-next-line no-new-func
  return new Function(
    "agent", "parallel", "pipeline", "phase", "log", "args",
    `return (async () => {\n${src}\n})()`
  );
}

// ── 런타임 API 의 스텁 ────────────────────────────────────────────────────
// pipeline(items, stage1, stage2): 항목마다 stage1 을 돌리고 그 결과를 stage2 에 넘긴다.
// parallel(thunks): 전부 실행하고 결과 배열을 돌려준다.
function makeRuntime(agentImpl) {
  const calls = [];   // agent 호출 기록 (label · phase)
  const phases = [];  // phase() 로 선언된 단계
  const logs = [];
  return {
    calls, phases, logs,
    agent: async (prompt, opts = {}) => {
      calls.push({ label: opts.label || "(무명)", phase: opts.phase, prompt });
      return agentImpl(prompt, opts);
    },
    parallel: (thunks) => Promise.all(thunks.map((t) => t())),
    pipeline: async (items, stage1, stage2) => {
      const out = [];
      for (const item of items) out.push(await stage2(await stage1(item), item));
      return out;
    },
    phase: (title) => phases.push(title),
    log: (msg) => logs.push(String(msg)),
  };
}

// 정해진 값을 돌려주는 가짜 에이전트. missing 은 시나리오마다 바꾼다.
function cannedAgent(missing) {
  return async (_prompt, opts = {}) => {
    const label = opts.label || "";
    if (opts.phase === "완결성 비평") return { missing };
    if (label.includes("verify")) return { refuted: false, reason: "성립함" };
    // 찾기 단계 — 렌즈 하나당 발견 하나
    return { findings: [{ title: `발견(${label})`, detail: "상세", location: "위치" }] };
  };
}

const ARGS = {
  goal: "배선 시험",
  target: "README.md",
  lenses: ["정확성 — 시험용", "완결성 — 시험용"],
  refuters: 2,
};

let failed = 0;
function check(name, cond, extra = "") {
  if (cond) { console.log(`  통과 — ${name}`); }
  else { failed++; console.error(`  실패 — ${name}${extra ? `\n         ${extra}` : ""}`); }
}

async function run(missing, extraArgs = {}) {
  const rt = makeRuntime(cannedAgent(missing));
  const wf = loadWorkflow();
  const result = await wf(rt.agent, rt.parallel, rt.pipeline, rt.phase, rt.log, { ...ARGS, ...extraArgs });
  return { result, rt };
}

console.log("kimlead-verified — 되돌아가는 엣지 배선 시험\n");

// ── 시나리오 1. 비평가가 빠진 각도를 찾으면 재라운드가 돈다 ────────────────
{
  console.log("1. 빠진 각도가 있으면 재라운드가 발동한다");
  const missing = [
    { angle: "성능 관점", why: "아무도 보지 않았다" },
    { angle: "접근성 관점", why: "렌즈에 없었다" },
  ];
  const { result, rt } = await run(missing);
  const reCalls = rt.calls.filter((c) => c.label.startsWith("re:"));
  check("rounds 가 2 로 보고된다", result.rounds === 2, `실제: ${result.rounds}`);
  check("재라운드 렌즈 2개가 비평가의 각도에서 나왔다",
    result.rerunLenses.length === 2 && result.rerunLenses[0].startsWith("성능 관점"),
    `실제: ${JSON.stringify(result.rerunLenses)}`);
  check("재라운드에서 에이전트가 실제로 호출됐다", reCalls.length > 0, `실제: ${reCalls.length}건`);
  check("재라운드 단계 이름이 붙었다",
    reCalls.some((c) => c.phase === "재라운드 팬아웃") && reCalls.some((c) => c.phase === "재라운드 적대 검증"));
  check("재라운드 발견이 확정 목록에 합쳐졌다", result.confirmed.length === 4,
    `실제: ${result.confirmed.length}건 (1라운드 2 + 재라운드 2 를 기대)`);
  check("못 본 각도는 남지 않았다", result.missingAnglesNotCovered.length === 0);
}

// ── 시나리오 2. 빠진 각도가 없으면 재라운드는 돌지 않는다 ──────────────────
{
  console.log("\n2. 빠진 각도가 없으면 재라운드를 돌지 않는다 (토큰을 쓰지 않는다)");
  const { result, rt } = await run([]);
  check("rounds 가 1 이다", result.rounds === 1, `실제: ${result.rounds}`);
  check("re: 로 시작하는 호출이 하나도 없다", rt.calls.filter((c) => c.label.startsWith("re:")).length === 0);
  check("확정 발견은 1라운드 것뿐이다", result.confirmed.length === 2, `실제: ${result.confirmed.length}건`);
}

// ── 시나리오 3. 상한은 코드가 강제한다 ────────────────────────────────────
{
  console.log("\n3. 상한을 코드가 강제하고, 넘친 각도는 침묵하지 않는다");
  const many = [1, 2, 3, 4, 5].map((n) => ({ angle: `각도 ${n}`, why: "이유" }));
  const { result } = await run(many, { maxRerunLenses: 2 });
  check("재라운드 렌즈가 상한 2개로 잘렸다", result.rerunLenses.length === 2, `실제: ${result.rerunLenses.length}`);
  check("잘려 나간 3개가 결과에 남아 사람에게 넘어간다",
    result.missingAnglesNotCovered.length === 3, `실제: ${result.missingAnglesNotCovered.length}`);
  check("재라운드는 한 번뿐이다 (2라운드로 끝)", result.rounds === 2);
}

// ── 시나리오 4. 끌 수 있다 ────────────────────────────────────────────────
{
  console.log("\n4. reround:false 면 끄되, 찾은 각도는 그대로 보고한다");
  const missing = [{ angle: "성능 관점", why: "이유" }];
  const { result, rt } = await run(missing, { reround: false });
  check("재라운드를 돌지 않는다", result.rounds === 1 && result.rerunLenses.length === 0);
  check("re: 호출이 없다", rt.calls.filter((c) => c.label.startsWith("re:")).length === 0);
  check("찾은 각도는 못 본 것으로 남는다",
    result.missingAngles.length === 1 && result.missingAnglesNotCovered.length === 1);
}

console.log(failed === 0 ? "\n전부 통과." : `\n실패 ${failed}건.`);
process.exit(failed === 0 ? 0 : 1);
