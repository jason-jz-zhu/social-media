---
name: harness-design
description: Guidelines for designing multi-agent harnesses that make AI agents reliable for long-running, complex tasks
user_invocable: true
---

# Harness Design Skill

Design and implement multi-agent harness architectures that make AI agents reliable for complex, long-running tasks. Based on Anthropic's research + our own experiments.

## Core Principle

> The model is the engine. The harness is the car.
> Prompt engineering tunes the engine. Harness design builds the car.

A harness is the orchestration layer around an AI agent: how many agents, what roles they play, how work gets evaluated, and how failures get fixed.

## When to Use This Skill

- Building anything that takes more than one agent turn to complete
- Any task where "AI says done" but output quality is uncertain
- Multi-file code generation, content systems, research pipelines
- When you need verifiable confidence in AI output, not just speed

## The Three Architecture Patterns

### Pattern A: Solo Agent (Simple Tasks < 30 min)
```
[Requirement] → [Single Agent] → [Output]
```
- **When:** Simple, well-defined tasks with clear success criteria
- **Eval:** None or hard validation only (linter, tests pass)
- **Risk:** Agent one-shots, declares done, no verification
- **Our data:** Run A — 7min, 51K tokens, unknown bugs

### Pattern B: Generator + Evaluator (Mid-Complexity, 1-4 hours)
```
[Requirement] → [Generator] → [Evaluator] → feedback → [Generator fixes] → loop
```
- **When:** Tasks where quality is somewhat subjective or has many edge cases
- **Eval:** Independent agent reviews output, ideally with interaction tools
- **Risk:** If generator and evaluator are same agent = self-evaluation bias
- **Our data:** Run B — 8min, 56K tokens, self-eval bias (13/14 PASS suspicious)

### Pattern C: Planner + Generator + Evaluator (Complex, multi-hour)
```
[Requirement] → [Planner] → spec
                 [Generator] → output (reads spec, works sprint by sprint)
                 [Evaluator] → report (reads spec + output, tests independently)
```
- **When:** Complex tasks with vague requirements, production-quality needed
- **Eval:** Independent agent with different tools (Playwright for web, test runners for code)
- **Key addition:** Planner turns 2 sentences into 300+ line spec with testable criteria
- **Our data:** Run C — 25min, 243K tokens, code review found 88/90

### Pattern D: Full Harness (Production-grade)
```
[Requirement] → [Planner] → spec
                 [Generator] → output per sprint
                 [Evaluator] → browser test → feedback
                 [Generator] → fixes → [Evaluator] → re-test → loop
```
- **When:** Anything going to production or users
- **Eval:** Real browser testing (Playwright/Puppeteer), multiple feedback-fix rounds
- **Key addition:** Feedback loop — evaluator finds bugs, generator fixes, evaluator re-tests
- **Our data:** Run D — 29min, 229K tokens, Playwright found overlay bug that code review missed

## Five Pillars of a Harness

1. **Tool Orchestration** — Define what each agent can access (file system, browser, APIs)
2. **Guardrails** — Permission boundaries, validation checks, architectural constraints
3. **Error Recovery** — Retry logic, rollback mechanisms, loop detection
4. **Observability** — Log every action, track tokens/cost, record decisions
5. **Human-in-the-Loop** — High-leverage checkpoints where human judgment matters most

## Key Findings from Our Experiment

### Self-Evaluation Bias Is Real
- Generator ALWAYS self-assesses near 100% (90/90 PASS in our tests)
- Independent evaluator consistently finds lower scores (88/90 code review, 18/20 browser test)
- **Rule:** Never trust an agent's assessment of its own work

### Code Review ≠ Using the Product
- Code review (Run C) found 3 code-level bugs
- Browser testing (Run D) found 4 interaction-level bugs, including one that BROKE THE ENTIRE APP
- The notification overlay bug: code logic was correct, code review passed it, but clicking in browser revealed overlay blocks all pointer events
- **Rule:** If the output is interactive (web app, UI, API), the evaluator must INTERACT with it, not just read code

### Feedback Loops Work
- Run D did 3 rounds of evaluator → generator fix → re-evaluate
- Fixed 3 of 4 bugs found
- **Rule:** Plan for 2-3 feedback rounds minimum

### Cost ≠ Confidence Proportionally
- Run A: ~$1, zero confidence
- Run B: ~$1, low confidence (self-eval bias)
- Run C: ~$5, medium confidence (code review only)
- Run D: ~$5, high confidence (browser-verified + bugs fixed)
- **Rule:** Run C and D cost the same, but D gives dramatically more confidence

## Prompt Templates for Each Agent

### Planner Prompt Pattern
```
You are the PLANNER agent. Your ONLY job is to expand a vague requirement
into a detailed product spec.

[requirement]

Create a spec with:
1. Product Vision (2-3 sentences)
2. User Persona
3. Feature List (15-20 features) each with:
   - Name, Description, Priority (P0/P1/P2)
   - Definition of Done (3-5 testable criteria)
   - Sprint assignment
4. Design Direction
5. Technical Constraints

ONLY write the spec. Do not build anything.
```

### Generator Prompt Pattern
```
You are the GENERATOR agent. A planner created a spec.
Your job is to BUILD, sprint by sprint.

1. Read the spec
2. Build Sprint N features
3. Write sprint report with self-assessment for each Definition of Done
4. Move to next sprint

Rules:
- Follow the spec's design direction
- ALL interactions must work — no stubs
- Be honest in self-assessment
```

### Evaluator Prompt Pattern
```
You are the EVALUATOR agent. You did NOT build this.
Your ONLY job is to be SKEPTICAL and THOROUGH.

Mindset:
- Assume the generator is overconfident
- Look for what's MISSING, not just what's present
- Test interactions, not just appearance

Steps:
1. Read the spec (focus on Definition of Done criteria)
2. Read/interact with the output
3. Rate each criterion: PASS / FAIL / PARTIAL with specific reasons
4. Write report with overall score, feature-by-feature results, bugs found

Be HONEST. The whole point is catching what the generator missed.
```

## Harness Evolution Rule

> Every component of your harness encodes an assumption about what the model cannot do on its own.

When a new model releases:
1. **Audit your harness** — which components exist because of model limitations?
2. **Test without them** — does the model handle it natively now?
3. **Simplify** — remove what's no longer load-bearing
4. **Extend** — add new components for newly possible but unreliable capabilities

Anthropic went from Pattern C (sprints + context resets) on Opus 4.5 to simplified Pattern B on Opus 4.6. Same quality, less complexity.

**Always find the simplest harness that works for your current model.**

## Practical Checklist

Before running a harness:
- [ ] Is the task complex enough to need a harness? (If < 30 min solo, maybe not)
- [ ] Did you define testable "Definition of Done" criteria?
- [ ] Is the evaluator truly independent (different agent, different context)?
- [ ] Does the evaluator have interaction tools (not just code reading)?
- [ ] Are you logging tokens, time, and pass/fail rates?
- [ ] Do you have a plan for 2-3 feedback-fix rounds?

## References

- [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- [Anthropic: Harness Design for Long-Running Apps](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [LangChain: Improving Deep Agents with Harness Engineering](https://blog.langchain.com/improving-deep-agents-with-harness-engineering/)
- Our experiment data: `experiments/harness-design/results/`
