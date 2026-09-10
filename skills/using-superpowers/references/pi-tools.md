# omp Tool Mapping

Skills speak in actions ("dispatch a subagent", "create a todo", "read a file"). On omp (Oh My Pi) these resolve to the tools below.

| Action skills request | omp equivalent |
| --- | --- |
| Dispatch a subagent (`Subagent (general-purpose):` template) | The built-in `task` tool |
| Dispatch N subagents in parallel | ONE `task` call with N entries in `tasks[]` |
| Task tracking ("create a todo", "mark complete") | The built-in `todo` tool |

## Subagents

omp ships a built-in `task` tool. Use it for every Superpowers subagent workflow — never conclude that subagent capability is missing.

Batch shape: one call carries `{ context, tasks[] }`, one subagent per item, run concurrently (capped by the `task.maxConcurrency` setting). Dispatch parallel agents as multiple entries in a single call, never as sequential calls.

Agent types: pick the most specific one per item from the roster in the `task` tool's own description. Commonly available: `scout` (read-only research — use for investigation), `reviewer`, `security-reviewer`, `sonic` (strictly mechanical work), `task` (general-purpose, full capabilities). The exact roster depends on installed and configured agents, so read the tool description rather than assuming.

The tool is lowercase `task`; `Task` does not exist. Optional: `task.isolation.enabled` runs each subagent in an isolated checkout copy and integrates the result, replacing manual `git worktree` plumbing.

### Model selection on omp

The `task` tool has **no `model:` field**. Every `model: [...]` line in a Superpowers template is inert here — the agent TYPE carries model, thinking level, and tool set. Choosing `task` "because it can do everything" means the slowest tier over the widest tool set on every dispatch.

This fork ships SDD-specific agents (they appear in the `task` roster once the plugin is installed):

| Superpowers role | `agent:` | What it pins |
| --- | --- | --- |
| Implementer, fix rounds 1-2 | `sdd-implementer` | sonnet-5 · medium; edit/test tools; no subagents |
| Task reviewer | `sdd-reviewer` | sonnet-5 · high; `read`/`grep`/`glob` — no file writes, no shell (`hub start` can still launch a process; the harness cannot remove `hub`) |
| Scoped re-review | `sdd-rereviewer` | sonnet-5 · low; `read`/`grep`; ≤4 calls |
| Fix round 3 / ruled strongest-tier task | `sdd-escalation-implementer` | opus-5 · xhigh; same tools as the implementer |
| Final whole-branch review | `sdd-final-reviewer` | opus-5 · xhigh; read-only + focused bash |

Shipped defaults are Anthropic; the tiers are a thinking ladder (low / medium / high / xhigh). Re-point any seat per host with `task.agentModelOverrides` in `~/.omp/agent/config.yml` (or `/agents`) — it beats the agent file's `model:`, applies on the next dispatch, and a bare model keeps the agent's `thinkingLevel:` while an explicit `:level` replaces it.

Never use the bundled `task` agent for an SDD seat: it resolves to `modelRoles.task` (else the session model), which may be weaker than `sdd-implementer`. If `task.enableEffort` is on, `effort: "hi"` on a dispatch raises that one subagent's thinking without changing its model — the only accepted values are `"lo"`, `"med"`, `"hi"`.

## Task lists

omp ships a built-in `todo` tool (`init`, `start`, `done`, `rm`, `drop`, `block`, `unblock`, `append`, `view`). Use it for all task tracking. Do not use Superpowers plan files, Markdown checklists, or a repo-local `TODO.md` for this. Older Superpowers docs may refer to `TodoWrite`; treat that as the `todo` tool.
