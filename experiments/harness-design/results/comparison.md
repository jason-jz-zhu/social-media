# Harness Design Experiment — Final Comparison

## Input (identical for all three runs)
"Web-based dashboard for operators (career experts) who use JobAgent AI tools to serve multiple job-seeking clients. Think Shopify merchant dashboard."

## Results

| Metric | Run A (Solo) | Run B (Gen+Eval) | Run C (Full Harness) |
|--------|-------------|-----------------|---------------------|
| **Architecture** | Single agent | Generator + Evaluator | Planner + Generator + Evaluator |
| **Duration** | ~7 min | ~8 min | ~25 min (3.5+16+4.5) |
| **Total Tokens** | 50,787 | 56,259 | 243,141 (20K+99K+124K) |
| **Tool Uses** | 5 | 14 | 39 (3+15+21) |
| **Files Produced** | 3 | 5 | 5 + spec + 4 sprint reports + evaluator report |
| **Features Claimed** | 16 | 14 | 18 |
| **Spec Detail** | None | Self-decomposed | 322-line spec, 90 acceptance criteria |
| **Self-found Bugs** | 0 | 1 | 0 (generator claimed 90/90 pass) |
| **Independent Eval** | None | None (self-eval) | 88/90 PASS, 2 PARTIAL |
| **Bugs Found by Evaluator** | N/A | N/A | 3 (implicit global, fragile JSON, missing edit) |
| **Code Organization** | 3 files monolith | 4 files separated | 4 files separated + spec + reports |
| **Design Direction** | Generic | Generic + dark mode | Spec-driven (indigo+amber palette) |
| **Mock Data Quality** | Good | Good | Exceptional (persona-consistent) |
| **Progress Tracking** | None | progress.md | Sprint reports + evaluator report |

## Key Observations

### 1. Planner Creates Scope the Others Miss
- Run A: 16 features (self-decided, no structure)
- Run B: 14 features (self-decomposed with priorities)
- Run C: 18 features from 322-line spec with 90 testable criteria, 4 sprints, design direction, user persona

The planner turned 2 sentences into a product spec that a PM would recognize. This alone justifies the architecture.

### 2. Self-Evaluation Bias Is Real
- Run A: No evaluation at all — "I'm done" after one pass
- Run B: 13/14 PASS on first try (suspiciously high)
- Run C Generator: Claims 90/90 PASS (even more suspicious)
- Run C Evaluator: Independently found 88/90 PASS, 2 PARTIAL, 3 bugs

The generator rated itself 90/90. The independent evaluator found 2 criteria that don't fully pass and 3 code-level bugs. This is EXACTLY the self-evaluation problem the Anthropic article describes.

### 3. Cost vs Quality Tradeoff
- Run A: ~$1 → looks good on surface, unknown bug count
- Run B: ~$1.10 → slightly better organized, 1 self-caught bug
- Run C: ~$5 → spec-driven, independently verified, 3 bugs caught, design-consistent

5x the cost for dramatically more confidence in the output. The question is whether that confidence is worth it — for a production app, absolutely yes.

### 4. The Evaluator Is the Key Differentiator
Run B's evaluator was the SAME agent as the generator (self-eval). Run C's evaluator was completely independent with a "skeptic" prompt. The independent evaluator:
- Found bugs the generator missed (implicit global var, fragile JSON parsing)
- Identified missing functionality (edit button on calendar events)
- Provided actionable feedback with file:line references
- Gave an honest 8/10 instead of a perfect score

### 5. Artifacts Enable Accountability
Run C produced: spec.md, 4 sprint reports, generator_summary.md, evaluator_report.md
This paper trail is invaluable for:
- Understanding what was built and why
- Debugging issues later
- Iterating on the harness itself
- Writing blog posts about the experiment :)

## Conclusion
The full harness (Run C) produced a more complete, better-designed, independently-verified application with a clear paper trail. The cost was ~5x more but the confidence in the output was incomparably higher. For anything going to production, the harness pays for itself.

The most important finding: **self-evaluation is unreliable**. The generator claiming 90/90 when the evaluator found 88/90 + 3 bugs is a small gap numerically but a huge gap philosophically. In a more complex app, that gap would be much larger.
