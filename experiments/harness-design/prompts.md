# Harness Design Experiment — Agent Prompts

All agents were launched via Claude Code's `Agent` tool with different prompts.
The ONLY difference between Run A, B, C is the prompt architecture.
Same model (Opus 4.6), same tools, same input requirement.

---

## The Input (identical for all runs)

```
Operator Dashboard — Requirements Document

Overview: Web-based dashboard for operators (career experts) who use JobAgent AI tools
to serve multiple job-seeking clients. Think Shopify merchant dashboard — operators manage
their "store" (career service business) through this interface.
```

---

## Run A: Solo Agent (1 prompt, 1 agent)

**Architecture:** Single agent, no harness
**Agents:** 1

### Agent prompt:
```
You are building a web application from scratch. Here is the ONLY requirement:

[requirement text]

Build a complete, working, professional web application.
Build as HTML/CSS/JS. Put files in: experiments/harness-design/results/run_a/app/
Make it professional. Include realistic mock data. Make all interactions work.
When done, list every feature you implemented.
```

**What happened:** Agent one-shot the entire app in 5 tool calls. No evaluation, no iteration.

---

## Run B: Generator + Evaluator (1 prompt, 1 agent playing both roles)

**Architecture:** Two-agent loop (but same agent self-evaluating)
**Agents:** 1 (with instructions to alternate between generating and evaluating)

### Agent prompt:
```
You are running a TWO-AGENT HARNESS experiment.

[requirement text]

Your Role: ORCHESTRATOR — you run a Generator-Evaluator loop.

Phase 1: Feature Decomposition
List 10-15 features with: name, "done" criteria, priority (P0/P1/P2)

Phase 2: Build Feature by Feature
For each feature:
1. GENERATE: Build the feature
2. EVALUATE: Critically assess — PASS or FAIL with reasons
3. If FAIL: fix, re-evaluate
4. Only move to next feature after PASS
5. Write progress entry

Phase 3: Final Integration Check
Read entire codebase, check cross-feature interactions, fix issues.

Rules:
- DO NOT skip evaluation for any feature
- Be HONEST — if something doesn't work, mark it FAIL
```

**What happened:** Agent decomposed into 14 features, built each one, self-evaluated.
13/14 passed first try (suspiciously high — self-evaluation bias).

---

## Run C: Planner + Generator + Evaluator (3 prompts, 3 separate agents)

**Architecture:** Three independent agents, each in isolation
**Agents:** 3 (launched sequentially)

### Agent 1: PLANNER prompt
```
You are the PLANNER agent. Your ONLY job is to take a vague requirement
and produce a detailed product spec.

[requirement text]

Expand into a COMPREHENSIVE spec:
1. Product Vision
2. User Persona (who is the operator? daily life? problems?)
3. Feature List (15-20 features), each with:
   - Name, Description, Priority,
   - Definition of Done (3-5 testable criteria)
   - Sprint assignment (1-4)
4. Design Direction (colors, layout, feel)
5. Technical Constraints

Be DETAILED. The generator and evaluator will use this spec.
ONLY write the spec. Do not build anything.
```

**Output:** spec.md — 322 lines, 18 features, 90 acceptance criteria, 4 sprints

### Agent 2: GENERATOR prompt
```
You are the GENERATOR agent. A planner already created a spec.
Your job is to BUILD the application sprint by sprint.

Step 1: Read experiments/harness-design/results/run_c/spec.md
Step 2: Build Sprint by Sprint (1→2→3→4)
  For each sprint:
  1. Read features for that sprint from spec
  2. Build ALL features
  3. Write sprint report (sprint_N_report.md) with self-assessment
  4. Move to next sprint

Rules:
- Follow spec's design direction
- ALL interactions must work — no stubs
- Write final summary to generator_summary.md
```

**Output:** 4 app files + 4 sprint reports + generator_summary.md
**Self-assessment:** 90/90 PASS (overconfident)

### Agent 3: EVALUATOR prompt
```
You are the EVALUATOR agent. You did NOT build this code.
Your ONLY job is to be a SKEPTICAL, THOROUGH QA reviewer.

Your Mindset:
- You are a skeptic. Assume the generator is overconfident.
- Look for what's MISSING, not just what's present.
- Test interactions, not just appearance.

Step 1: Read spec.md (focus on Definition of Done)
Step 2: Read ALL source code
Step 3: Evaluate each of 18 features against each DoD criterion
  Rate: PASS / FAIL / PARTIAL with specific reasons

Be especially critical about:
- Do click handlers actually exist?
- Does filtering/sorting actually work?
- Are modals properly wired?
- Is drag-and-drop implemented?
- Does design match spec?

Step 4: Write evaluator_report.md with:
- Overall score (1-10)
- Feature-by-feature PASS/FAIL/PARTIAL
- Bugs with file:line references
- Missing features
- Final verdict: how many of 90 criteria actually pass?

Be HONEST. The whole point is to catch what the generator missed.
```

**Output:** evaluator_report.md
**Independent assessment:** 88/90 PASS, 2 PARTIAL, 3 bugs found
**Score:** 8/10

---

## The Architecture Difference Visualized

```
Run A:  [Requirement] → [Solo Agent] → [Output]
                         (no eval)

Run B:  [Requirement] → [Agent as Generator] → [Same Agent as Evaluator] → [Output]
                         (self-eval loop, same context)

Run C:  [Requirement] → [Planner Agent]  → spec.md
                         [Generator Agent] → app/ + sprint reports  (reads spec.md)
                         [Evaluator Agent] → evaluator_report.md   (reads spec.md + app/)
                         (3 separate agents, 3 separate contexts)
```

## Key Insight
The prompts ARE the harness. The difference between Run A and Run C is not
the model or the tools — it's the prompt architecture:
- How many agents
- What role each plays
- What artifacts they produce for the next agent
- Whether evaluation is self or independent

This is exactly what "harness design" means in practice.
