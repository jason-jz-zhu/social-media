# Claude Code Remote Control: Code From Your Phone in 2 Minutes

*I wrote half of my latest project from my couch. Here's how.*

---

Last weekend, I gave Claude Code a task, put my laptop aside, and went to run errands. When I came back, the code was written, tested, and ready for review — and I'd been checking progress from my phone the entire time.

This isn't some complicated SSH tunnel or third-party hack. It's a built-in feature called **Remote Control**, and it takes about 2 minutes to set up.

If you're already using Claude Code (or thinking about it), this might change how you work.

## What is Remote Control?

Think of it like a TV remote. Your computer is the TV — it does all the heavy lifting. Your phone is just the remote — you send commands and see results.

- Code runs **entirely on your local machine**
- Your phone is just a thin client — no code leaves your computer
- Real-time sync between devices
- Works on iOS, Android, or any browser

The key insight: **your source code never touches the cloud**. Anthropic's server only relays your typed commands back and forth. Environment variables, files, MCP servers — all stay local.

## Prerequisites

Before you start, you need:

1. **A Claude subscription** — Pro ($20/mo) or Max ($200/mo). API keys won't work.
2. **Claude Code installed on your computer** — see installation below.
3. **Your phone** — with the Claude App or a browser.

## Step 1: Install Claude Code

Open your terminal (Terminal on Mac, CMD/PowerShell on Windows) and run:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

On Mac, you can also use Homebrew:

```bash
brew install claude-code
```

Once installed, type `claude` to launch it. First time, it'll ask you to log in to your Claude account.

## Step 2: Enable Remote Control

In your terminal, run:

```bash
claude --remote-control
```

You'll see a **QR code** and a **URL** appear on screen. (Press spacebar to toggle the QR code display.)

## Step 3: Connect Your Phone

Three ways to connect:

1. **Scan the QR code** with your phone camera
2. **Open the URL** shown in terminal
3. **Go to [claude.ai/code](https://claude.ai/code)** and log in with the same account — your session will appear automatically

That's it. You're connected. Anything you type on your phone executes on your computer.

## What Can You Actually Do?

Once connected, your phone has **full access** to everything Claude Code can do:

- **Send tasks** — describe what you want built, fixed, or changed
- **Review code** — see exactly what Claude is writing in real-time
- **Approve actions** — when Claude asks for permission, tap to approve
- **Check results** — see test outputs, errors, and completions

It's not a stripped-down version. File system, MCP servers, Skills, project configs — everything works exactly like sitting at your computer.

## Three Tips That Make It 10x Better

### 1. Use Bypass Permissions Mode

By default, Claude asks for your approval before running commands or writing files. On a phone, tapping "approve" every 30 seconds gets old fast.

Start with:

```bash
claude --remote-control --dangerously-skip-permissions
```

Now Claude runs autonomously — it writes code, runs tests, and fixes errors without asking. You just check results when you want to.

> ⚠️ Only use this in isolated environments or projects where you're comfortable with autonomous execution. It will modify files without asking.

### 2. Use Plan Mode First

Before going hands-free, have Claude create a plan:

1. Start a session and describe what you want
2. Ask Claude to enter plan mode and outline the approach
3. Review and approve the plan from your phone
4. Then let it execute

This way, you're not giving it a blank check — you've agreed on the architecture before it starts coding.

### 3. Run Multiple Projects in Parallel

You can have multiple Claude Code sessions running on your computer simultaneously. On your phone, switch between them at `claude.ai/code`.

I regularly have 2-3 sessions going:
- One building a feature
- One writing tests
- One fixing bugs from the previous session

Your computer does all the work. You just check in on each one.

## Remote Control vs. OpenClaw

If you've been following the AI agent space, you've probably heard of [OpenClaw](https://github.com/openclaw) — the open-source agent framework that exploded in March 2026.

Here's how they compare:

| | Remote Control | OpenClaw |
|---|---|---|
| **Setup** | 2 minutes, zero config | Requires deployment and configuration |
| **Security** | No open ports, one-time credentials, account-bound | Has had [security vulnerabilities](https://www.unite.ai/openclaw-vs-claude-code-remote-control-agents/) found by Cisco |
| **Platforms** | Phone/browser only | 50+ platforms (Slack, WhatsApp, Telegram, etc.) |
| **Cost** | Included in Claude subscription | Free and open-source |
| **Best for** | Controlling your own dev sessions | Building autonomous agents across platforms |

**My take:** If you just want to control Claude Code from your phone, use Remote Control — it's simpler and more secure. If you need an AI agent that lives in Slack or WeChat, OpenClaw is the right tool.

They solve different problems.

## My Actual Workflow

Here's what a typical day looks like now:

**Morning (at desk):**
- Start 2-3 Claude Code sessions with `--remote-control`
- Give each one a task with a plan
- Approve the plans

**During the day (on phone):**
- Check progress between meetings
- Review code during lunch
- Approve any decisions Claude is stuck on

**Evening (on couch):**
- Review what got done
- Start new tasks for overnight processing

The mindset shift is real: **coding went from "sitting at a desk" to "checking in on progress."**

## Should You Try It?

If you're already paying for Claude Pro or Max, this feature is included — there's no reason not to try it.

If you're not using Claude Code yet but you're curious: start with the [$20/mo Pro plan](https://claude.ai/pricing), install it, and spend a weekend building something small. A personal tool, a script that automates something annoying, anything.

The barrier to entry has never been lower.

---

*I spend $200/month on Claude and use it for everything from building tools to writing this article. If you want to see more of my AI workflow, [subscribe to my Substack](https://your-substack-url) for deeper dives.*

*Have questions about the setup? Drop a comment — I'll answer everything.*

---

**Tags:** Claude Code, Remote Control, AI Coding, Anthropic, Developer Tools, Mobile Development, Vibe Coding
