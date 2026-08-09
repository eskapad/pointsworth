export const meta = {
  name: 'refresh-valuations',
  description: 'Fan out researchers to re-verify every programme valuation, audit the claims, and report needed updates',
  whenToUse: 'Quarterly data refresh, or when a devaluation/announcement makes the dataset suspect. Pass {focus: ["program-id", ...]} as args to limit scope.',
  phases: [
    { title: 'Inventory', detail: 'read the current dataset' },
    { title: 'Research', detail: 'one researcher per market group' },
    { title: 'Audit', detail: 'adversarial check of proposed changes' },
    { title: 'Synthesize', detail: 'unified change report' },
  ],
}

phase('Inventory')
const inventory = await agent(
  `Read src/data/programs.js in this repo. Return JSON: an array of
  {id, name, owner, type, country, confidence, asOfNote} for every programme —
  asOfNote is any date-sensitive claim in its blurb (announced repricings,
  "launched", "no published rate"). Also return the AS_OF constant.`,
  {
    schema: {
      type: 'object',
      properties: {
        asOf: { type: 'string' },
        programs: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' }, name: { type: 'string' }, owner: { type: 'string' },
              type: { type: 'string' }, country: { type: 'string' },
              confidence: { type: 'string' }, asOfNote: { type: 'string' },
            },
            required: ['id', 'name', 'owner', 'type', 'country', 'confidence'],
          },
        },
      },
      required: ['asOf', 'programs'],
    },
  },
)

const focus = args?.focus?.length ? inventory.programs.filter((p) => args.focus.includes(p.id)) : inventory.programs

// Group by market so each researcher carries coherent regional context.
const groups = {}
for (const p of focus) (groups[p.country] ??= []).push(p)

const PROPOSAL_SCHEMA = {
  type: 'object',
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          status: { type: 'string', enum: ['unchanged', 'update', 'upgrade-confidence', 'exclude'] },
          summary: { type: 'string' },
          proposedUsd: {
            type: 'object',
            properties: { low: { type: 'number' }, median: { type: 'number' }, high: { type: 'number' } },
          },
          evidence: { type: 'array', items: { type: 'string' } },
        },
        required: ['id', 'status', 'summary', 'evidence'],
      },
    },
  },
  required: ['findings'],
}

const researched = await pipeline(
  Object.entries(groups),
  ([country, programs]) =>
    agent(
      `You are refreshing valuations for PointsWorth (read CLAUDE.md and
      .claude/agents/valuation-researcher.md for the sourcing rules — follow
      the source hierarchy strictly; never invent a rate).

      Re-verify these ${country} programmes as of today:
      ${programs.map((p) => `- ${p.id} (${p.name} — ${p.owner}, currently ${p.confidence})${p.asOfNote ? ` [watch: ${p.asOfNote}]` : ''}`).join('\n')}

      For each: search for rate changes, devaluations, new published anchors
      (especially for provisional programmes — an anchor upgrades them), and
      programme rebrands/closures. Compare against the current entry in
      src/data/programs.js. Report status per programme with evidence URLs.
      "unchanged" needs evidence too — a checked source confirming the rate.`,
      { label: `research:${country}`, phase: 'Research', schema: PROPOSAL_SCHEMA },
    ),
  (proposal, [country]) =>
    agent(
      `You are the data auditor (rules in .claude/agents/data-auditor.md).
      Adversarially verify this refresh proposal for ${country}:
      ${JSON.stringify(proposal.findings, null, 2)}

      For every "update"/"upgrade-confidence": check the evidence URLs actually
      support the numbers (fetch them), the peg math (usd x peg rates in
      src/data/currencies.js), and cross-programme consistency for
      transfer-derived values. Reject anything resting on a blog rumor.
      Return the findings array with each item's status confirmed or demoted
      to "unchanged", and a note explaining any demotion.`,
      { label: `audit:${country}`, phase: 'Audit', schema: PROPOSAL_SCHEMA },
    ),
)

phase('Synthesize')
const confirmed = researched.filter(Boolean).flatMap((r) => r.findings)
const report = await agent(
  `Write the refresh report for PointsWorth (dataset dated "${inventory.asOf}").
  Verified findings: ${JSON.stringify(confirmed, null, 2)}

  Produce: (1) programmes needing updates, each with proposed usd values and
  evidence; (2) provisional programmes that can be upgraded; (3) programmes to
  exclude; (4) confirmed-current programmes as one line. End with the exact
  edit plan for src/data/programs.js (including the new AS_OF) so the main
  session can apply it, run npm run audit, and update README/memory.`,
  { label: 'report', phase: 'Synthesize' },
)

return { report, findings: confirmed }
