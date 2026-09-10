# omp-superpowers

[obra/superpowers](https://github.com/obra/superpowers) adapted for **omp (Oh My Pi)**.

Upstream superpowers is a set of workflow skills (brainstorm → plan → implement via subagents → review → finish). It ships a Pi/omp compatibility layer that is wrong on omp: it tells the agent there is no subagent tool and no todo tool, and its *Model Selection* rules use a `model:` field the omp `task` tool does not have. Under those rules every subagent silently inherits the slowest configured model over the widest tool set — in a real 157-subagent session that was where most of the wall-clock went.

This fork keeps the skills and fixes the omp side:

- the always-injected tool mapping tells the truth about `task`, `todo`, `read`/`grep`/`glob`
- **five omp agents** (`agents/sdd-*.md`) give every subagent-driven-development seat its own model, thinking level, and tool set
- subagent-driven-development is rewritten around them: three-round fix loop, structured reviewer output, waves gated on isolation

## Install

```bash
omp plugin install github:LoneExile/omp-superpowers
```

Pin to a commit when you want reproducibility (the pin is recorded in `~/.omp/plugins/bun.lock`):

```bash
omp plugin install github:LoneExile/omp-superpowers#<sha>
```

Verify it loaded — the roster of your `task` tool should now include the five `sdd-*` agents:

```bash
omp -p --no-session --no-skills --model anthropic/claude-haiku-4-5 \
  'List the agent type names your `task` tool offers, comma-separated, nothing else.'
# scout, reviewer, security-reviewer, sonic, task, sdd-implementer, sdd-reviewer, sdd-rereviewer, sdd-escalation-implementer, sdd-final-reviewer
```

Agent definitions are read **per dispatch**, so a reinstall takes effect on the next `task` call in a running session. The injected tool mapping and the skill catalog are read at process start — restart omp after upgrading to pick those up.

## Using it

The skills drive themselves once loaded. The usual path:

1. `read skill://brainstorming` — turn an idea into a design
2. `read skill://writing-plans` — produce `docs/superpowers/plans/<date>-<name>.md`
3. `read skill://subagent-driven-development` — execute the plan task by task via subagents
4. `read skill://finishing-a-development-branch` — merge / PR / discard

On omp the agent invokes a skill by reading it (`read skill://<name>`); you can also invoke one explicitly with `/skill:<name>`.

### The SDD seats

| Seat | agent | default model · thinking | tools |
|---|---|---|---|
| implementer (every task, fix rounds 1–2) | `sdd-implementer` | deepseek-flash · medium | read, write, edit, bash, grep, glob, lsp, ast_grep |
| task reviewer | `sdd-reviewer` | deepseek-flash · high | read, grep, glob |
| scoped re-review | `sdd-rereviewer` | deepseek-flash · low | read, grep |
| fix round 3 / ruled strongest-tier task | `sdd-escalation-implementer` | deepseek-flash · xhigh | same as implementer |
| final whole-branch review | `sdd-final-reviewer` | deepseek-flash · xhigh | read, grep, glob, bash, lsp, ast_grep |

All five default to `opencode-go/deepseek-flash` (DeepSeek V4.1 Flash, 1M context) and differ by **thinking level** — the tiers are a reasoning ladder, not a model ladder. Each carries an Anthropic fallback that omp uses only when the primary has no working credentials.

The two reviewer seats have no `bash`, `edit`, or filesystem `write`: the review package (`git diff -U10` written to a file) is their whole view of the change, and they return a structured result (`spec_compliance`, `task_quality`, `findings[]`, `cannot_verify[]`; `finding_verdicts[]`, `new_breakage[]`, `round_verdict`) plus `package_gap` when they could not read the package. Note the honest boundary: omp always attaches `hub` to subagents, and `hub start` can launch a process, so "no shell" means *cannot edit the tree and cannot run a shell*, not a sandbox.

### Changing models — no file edits

Use omp's built-in per-agent override. It beats the agent file's `model:` line and applies on the next dispatch:

```yaml
# ~/.omp/agent/config.yml
task:
  agentModelOverrides:
    sdd-implementer: opencode-go/deepseek-flash:medium
    sdd-reviewer: anthropic/claude-sonnet-5:high
    sdd-rereviewer: anthropic/claude-haiku-4-5:low
    sdd-escalation-implementer: anthropic/claude-opus-5:xhigh
    sdd-final-reviewer: anthropic/claude-opus-5:xhigh
```

Or interactively: `/agents` in any session opens the same map for editing.

Rules that are easy to get wrong:

- A **bare model** (`anthropic/claude-haiku-4-5`) keeps the agent file's own `thinkingLevel`. Add `:level` (`…:high`) to change reasoning too.
- Delete a line to fall back to the agent file.
- The `task` tool has **no `model:` field**. Never dispatch the bundled `task` or `reviewer` agent for an SDD seat — they resolve to `modelRoles.task` / `@slow`, which on many hosts is a cheap model.
- `effort` on a dispatch (when `task.enableEffort` is on) accepts only `"lo"`, `"med"`, `"hi"`.

### Optional settings that matter

| setting | why |
|---|---|
| `task.isolation.mode` | off by default; SDD only runs implementers in **parallel waves** when it is on — otherwise they share one checkout and stay serial |
| `task.enableEffort` | exposes per-dispatch `effort` for the round-3 escalation |
| `autolearn.autoContinue` | omp's auto-learn mints managed skills every session; the whole catalog is injected into every subagent's prompt. Keep it pruned or off — a 2,500-skill catalog was ~220k tokens per subagent turn |

## What changed from upstream

- `.pi/extensions/superpowers.ts` — the injected mapping names `task`, `todo`, the `sdd-*` roster, and the no-`model:`-field rule
- `skills/using-superpowers/references/pi-tools.md` — same, as the reference doc
- `agents/sdd-*.md` — new
- `skills/subagent-driven-development/` — *Model Selection* → *Agent Selection*; fix-loop cap 5 → 3 with a round-3 escalation seat; a proven-trivial-fix route that replaces a re-review with a one-command proof; waves keyed to the plan's pre-flight file/interface table and gated on isolation; templates show omp's real `{ context, tasks: [{ agent, task }] }` wire shape and the reviewers' structured fields

Everything else is upstream, unmodified.

## Maintenance

```bash
git fetch upstream
git rebase upstream/main
git push --force-with-lease origin main
omp plugin install github:LoneExile/omp-superpowers#$(git rev-parse --short HEAD)
(cd ~/.omp/plugins && npm install --package-lock-only --ignore-scripts)   # keep package-lock in step with bun.lock
```

Expect conflicts in `skills/subagent-driven-development/` and `pi-tools.md` whenever upstream touches them — this fork rewrites those files rather than appending to them. `agents/` and the extension's mapping paragraph are additive.

Before trusting a new omp release, re-check the three harness facts this fork depends on, in the installed package (`~/.bun/install/global/node_modules/@oh-my-pi/pi-coding-agent/src`): agent frontmatter fields (`discovery/helpers.ts` `parseAgentFields`), the `task` item schema (`task/types.ts`), and the `task.agentModelOverrides` precedence (`config/model-resolver.ts` `resolveAgentModelSelection`).

## License

MIT, inherited from upstream. Not affiliated with obra / Prime Radiant.
