# Harness Design Experiment

## Goal
Test three harness architectures using the same task, measure quality/time/effort differences.

## Task
Build an **Operator Dashboard** — a web-based dashboard for career coaching operators who use JobAgent AI tools to manage multiple job-seeking clients. (Think: Shopify merchant dashboard for career services.)

## Three Runs

### Run A: Solo Agent (No Harness)
- Single Claude Code prompt with full requirements
- "Build the whole thing"
- No structured evaluation, no incremental approach
- Metric: time, quality, completeness

### Run B: Generator + Evaluator (Two-Agent Harness)
- Agent 1 (Generator): Builds one feature at a time
- Agent 2 (Evaluator): Reviews output, takes screenshots, reports issues
- Generator iterates based on feedback
- Metric: time, quality, completeness, iterations needed

### Run C: Planner + Generator + Evaluator (Full Harness)
- Agent 1 (Planner): Decomposes requirements into feature list with definition of done
- Agent 2 (Generator): Implements one feature per sprint
- Agent 3 (Evaluator): Tests with browser, scores against criteria, sends feedback
- Sprint contracts between generator and evaluator
- Metric: time, quality, completeness, iterations needed

## Evaluation Criteria
1. **Functionality** — Does it actually work? Can you click through flows?
2. **Completeness** — How many features from the spec are implemented?
3. **Visual Quality** — Does it look professional, not generic AI slop?
4. **Code Quality** — Is the code organized, maintainable?
5. **Bugs** — How many bugs found on first manual test?

## Tracking
Each run logs:
- Start/end time
- Number of agent turns
- Screenshots of final output
- Manual bug count
- Feature completion checklist
