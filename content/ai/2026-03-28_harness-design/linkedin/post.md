The AI said "I'm done."

The app was completely broken.

↓ here's what actually happened ↓

I gave the SAME 2-sentence requirement to Claude Opus 4.6 four times.

Same model. Same tools. Only difference? The architecture around it.

Run A → Solo agent, no checks
Run B → Agent checks its own work
Run C → 3 separate agents
Run D → 3 agents + real browser testing

The results:

Run A: "Done!" → zero verification, unknown bugs
Run B: "93% pass!" → self-evaluation bias (it graded itself an A)
Run C: Code review found 3 bugs
Run D: Browser test found an app-breaking bug that code review MISSED

The killer bug?

After opening the notification panel, an overlay blocked ALL clicks on the entire page.

→ Generator said PASS
→ Code reviewer said PASS
→ Playwright clicked a button and... nothing happened

The app was UNUSABLE. No amount of code review catches this.

This is called Harness Design.

Not better prompts. Better architecture AROUND the same model.

Inspired by Anthropic's latest research. I tested it myself.

Full experiment with data → in comments

What's your verification step when AI says "done"?

#AI #HarnessDesign #AIEngineering
