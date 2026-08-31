export const meta = {
  name: 'kimlead-verified',
  description: 'KimLead의 결정론적 검증 오케스트레이션 — 렌즈별로 독립 검토자를 팬아웃해 발견을 모으고, 발견 하나마다 회의론자들이 반박을 시도하는 적대 검증을 거쳐, 완결성 비평으로 마감한다',
  whenToUse: '검토 대상과 목표가 정해져 있고, "여러 관점에서 찾기 → 발견마다 검증 → 종합"이라는 정형 흐름을 재현 가능하게 돌리고 싶을 때. /orchestrate(KimLead)가 판돈 큰 검토·감사 단계에서 호출한다. 토큰을 크게 쓰므로 사소한 확인에는 쓰지 않는다.',
  phases: [
    { title: '팬아웃', detail: '렌즈별 독립 검토자가 발견을 수집한다' },
    { title: '적대 검증', detail: '발견마다 회의론자들이 반박을 시도하고, 다수가 반박하면 폐기한다' },
    { title: '완결성 비평', detail: '카테고리째로 빠진 각도가 없는지 점검한다' },
    { title: '재라운드 팬아웃', detail: '비평가가 찾은 빠진 각도를 새 렌즈로 삼아 한 번 더 찾는다 (상한 1회)' },
    { title: '재라운드 적대 검증', detail: '재라운드에서 나온 발견도 같은 회의론자 검증을 거친다' },
  ],
}

// ── 입력 (모두 args로 받는다) ─────────────────────────────────────────────
// args.goal   (필수) 이 검토로 무엇을 확인하려는가 — 한 문장.
// args.target (필수) 검토 대상 — 파일 경로 또는 대상 설명. 파일이면 각 에이전트가 직접 읽는다.
// args.lenses (선택) 렌즈(검토 관점) 문자열 배열. 각 렌즈마다 독립 검토자 1명이 붙는다.
// args.refuters (선택) 발견 하나당 붙는 회의론자 수. 기본 3 (다수결 폐기).
// args.maxFindingsPerLens (선택) 렌즈당 최대 발견 수. 기본 4. 상한을 두는 대신 폐기·미탐색분을 결과에 남긴다.
// args.reround (선택) 완결성 비평이 찾은 빠진 각도로 한 라운드를 더 돌지. 기본 true (상한은 언제나 1회).
// args.maxRerunLenses (선택) 재라운드에 쓸 각도 수 상한. 기본 3.

// args가 JSON 문자열로 들어오는 호출 환경도 있어, 문자열이면 여기서 파싱해 받아 준다.
const input = (typeof args === 'string') ? JSON.parse(args) : args
if (!input || !input.goal || !input.target) {
  throw new Error('args.goal(목표)과 args.target(검토 대상)이 필요합니다. 예: {goal: "...", target: "docs/foo.md"}')
}
const goal = input.goal
const target = input.target
const lenses = (input.lenses && input.lenses.length) ? input.lenses : [
  '정확성 — 사실과 다르거나 그대로 실행하면 깨지는 서술',
  '완결성 — 통째로 빠진 단계·조건·예외 처리',
  '일관성 — 이 저장소의 기존 규칙·규약·문서와 충돌하는 부분',
  // 도달 가능성은 완결성과 겹치지 않는다. 완결성은 산출물 '안'의 빠진 것을 보고,
  // 이 렌즈는 산출물 '바깥'의 연결(누가 이것을 부르나)을 본다 — 배선 누락을 잡는 유일한 렌즈다.
  '도달 가능성 — 사용자가 제품의 정상 진입점에서 이 산출에 실제로 닿을 수 있는가; 만들어 놓고 아무 곳에서도 부르지 않는(배선되지 않은) 요소, 또는 파일로만 있고 실환경에 적용되지 않은 변경이 없는가',
]
const refuters = input.refuters || 3
const maxPerLens = input.maxFindingsPerLens || 4
const reround = input.reround !== false
const maxRerunLenses = input.maxRerunLenses || 3

const FINDINGS_SCHEMA = {
  type: 'object',
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string', description: '발견을 한 문장으로' },
          detail: { type: 'string', description: '왜 문제인지 — 대상에서 확인한 사실로' },
          location: { type: 'string', description: '대상의 어느 부분인지 (절 제목, 줄, 파일 경로 등)' },
        },
        required: ['title', 'detail'],
      },
    },
  },
  required: ['findings'],
}

const VERDICT_SCHEMA = {
  type: 'object',
  properties: {
    refuted: { type: 'boolean', description: '반박에 성공했으면 true (발견이 틀렸다)' },
    reason: { type: 'string', description: '판정 근거 — 검토 대상에서 직접 확인한 사실로' },
  },
  required: ['refuted', 'reason'],
}

const CRITIC_SCHEMA = {
  type: 'object',
  properties: {
    missing: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          angle: { type: 'string', description: '빠진 검토 각도' },
          why: { type: 'string', description: '왜 다음 라운드에서 봐야 하는가' },
        },
        required: ['angle', 'why'],
      },
    },
  },
  required: ['missing'],
}

log(`목표: ${goal}`)
log(`렌즈 ${lenses.length}개로 팬아웃, 발견당 회의론자 ${refuters}명 (렌즈당 발견 상한 ${maxPerLens}건)`)

// ── 한 라운드 = 렌즈별 팬아웃 → 발견마다 적대 검증 ─────────────────────────
// 라운드 1과 재라운드가 같은 함수를 쓴다. 렌즈별로 독립 진행하므로(barrier가 없으므로
// pipeline) 한 렌즈의 발견이 검증에 들어가는 동안 다른 렌즈는 아직 찾는 중이어도 된다.
function runRound(roundLenses, findPhase, verifyPhase, tag) {
  return pipeline(
    roundLenses,
    (lens) => agent(
      `너는 독립 검토자다. 다른 검토자의 결과를 보지 못하며, 오직 아래 렌즈 하나로만 본다.\n\n` +
      `목표: ${goal}\n` +
      `검토 대상: ${target} (파일 경로면 Read 도구로 직접 읽어라)\n` +
      `네 렌즈: ${lens}\n\n` +
      `이 렌즈에서 가장 중요한 발견을 최대 ${maxPerLens}건까지만 보고하라. 발견이 없으면 빈 배열을 반환하라. ` +
      `각 발견에는 대상의 어느 부분인지(location)와 왜 문제인지(detail)를 구체적으로 적어라. ` +
      `추측이 아니라 대상에서 직접 확인한 것만 적는다.`,
      { label: `${tag}find:${lens.split(' ')[0]}`, phase: findPhase, schema: FINDINGS_SCHEMA }
    ),
    (found, lens) => parallel(((found && found.findings) || []).map((f, i) => () =>
      parallel(Array.from({ length: refuters }, (_, k) => () =>
        agent(
          `너는 회의론자 ${k + 1}호다. 아래 '발견'이 틀렸음을 증명하는 것이 네 임무다. ` +
          `기본값은 refuted=true이고, 검토 대상을 직접 확인해 발견이 실제로 성립함을 봤을 때만 refuted=false로 하라.\n\n` +
          `원래 목표: ${goal}\n` +
          `검토 대상: ${target} (파일 경로면 Read 도구로 직접 읽어라)\n\n` +
          `발견: ${f.title}\n상세: ${f.detail}\n위치: ${f.location || '(명시 안 됨)'}\n\n` +
          `reason에는 판정 근거를 검토 대상에서 직접 확인한 사실로 적어라.`,
          { label: `${tag}verify:${lens.split(' ')[0]}#${i + 1}-${k + 1}`, phase: verifyPhase, schema: VERDICT_SCHEMA }
        )
      )).then(votes => {
        const valid = votes.filter(Boolean)
        const refutedCount = valid.filter(v => v.refuted).length
        // 다수가 반박하면 폐기. 검증자가 전멸(모두 null)했으면 보수적으로 폐기한다.
        const survived = valid.length > 0 && refutedCount < (valid.length / 2 + 0.5)
        return { ...f, lens, survived, votes: valid.map(v => ({ refuted: v.refuted, reason: v.reason })) }
      })
    ))
  )
}

const perLens = await runRound(lenses, '팬아웃', '적대 검증', '')

const flatten = (rows) => rows.filter(Boolean).flat().filter(Boolean)
const round1 = flatten(perLens)
const round1Confirmed = round1.filter(f => f.survived)
log(`1라운드: 발견 ${round1.length}건 중 적대 검증 생존 ${round1Confirmed.length}건`)

phase('완결성 비평')
const critic = await agent(
  `너는 완결성 비평가다. 방금 "${target}"을 아래 렌즈들로 검토해 다음 발견들이 확정됐다.\n\n` +
  `사용한 렌즈: ${lenses.join(' / ')}\n` +
  `확정된 발견: ${round1Confirmed.map(f => f.title).join('; ') || '(없음)'}\n\n` +
  `묻는 것은 하나다 — 이 검토에서 카테고리째로 빠진 각도는 무엇인가? ` +
  `(안 돈 렌즈, 검증 안 된 전제, 안 읽은 관련 자료 등.) ` +
  `검토 대상을 직접 확인하고, 다음 라운드에서 봐야 할 것을 최대 3건까지 구체적으로 적어라. 없으면 빈 배열. ` +
  `여기 적은 각도는 그대로 다음 라운드의 검토 렌즈가 되므로, 무엇을 어떤 관점으로 보라는 것인지 알 수 있게 적어라.`,
  { phase: '완결성 비평', schema: CRITIC_SCHEMA }
)

// ── 되돌아가는 엣지 — 비평가의 산출을 실제로 소비한다 ───────────────────────
// 비평가가 "빠진 각도"를 찾아도 그것을 읽어 쓰는 곳이 없으면, 만들어 놓고 아무도
// 부르지 않는 코드다(communication 규칙 7-2가 말하는 배선 누락). 그래서 찾은 각도를
// 새 렌즈로 삼아 한 라운드를 더 돈다 — 그래프에 되돌아가는 길을 박아 두는 것이다.
//
// 발동 여부와 상한은 AI가 아니라 이 코드가 판정한다(판단의 분업: 세는 일은 코드).
// 상한 없는 재시도는 토큰만 태우므로 재라운드는 딱 한 번이고, 그러고도 남는 각도는
// 결과에 남겨 사람에게 넘긴다.
const missingAngles = (critic && critic.missing) || []
const rerunLenses = reround
  ? missingAngles.slice(0, maxRerunLenses).map((m) => `${m.angle} — ${m.why}`)
  : []

let round2 = []
if (rerunLenses.length > 0) {
  log(`재라운드: 비평가가 찾은 빠진 각도 ${rerunLenses.length}개를 새 렌즈로 한 번 더 돈다 (상한 1회)`)
  round2 = flatten(await runRound(rerunLenses, '재라운드 팬아웃', '재라운드 적대 검증', 're:'))
}

const all = round1.concat(round2)
const confirmed = all.filter(f => f.survived)
const dropped = all.filter(f => !f.survived)
log(`합계 ${rerunLenses.length > 0 ? 2 : 1}라운드 — 발견 ${all.length}건 중 생존 ${confirmed.length}건, 반박되어 폐기 ${dropped.length}건`)

// 침묵의 상한 금지: 폐기된 발견, 렌즈당 상한, 재라운드로도 보지 못한 각도를 결과에 그대로 남긴다.
return {
  goal,
  target,
  lensesUsed: lenses,
  findingsCapPerLens: maxPerLens,
  rounds: rerunLenses.length > 0 ? 2 : 1,
  confirmed,
  dropped: dropped.map(f => ({ title: f.title, lens: f.lens, votes: f.votes })),
  missingAngles,
  rerunLenses,
  missingAnglesNotCovered: missingAngles.slice(rerunLenses.length),
}
