# omp Tool Mapping

Skills speak in actions ("dispatch a subagent", "create a todo", "read a file"). On omp (Oh My Pi) these resolve to the tools below.

| Action skills request | omp equivalent |
| --- | --- |
| Dispatch a subagent (`Subagent (general-purpose):` template) | The built-in `task` tool |
| Dispatch N subagents in parallel | ONE `task` call with N entries in `tasks[]` |
| Resume or message an idle subagent | `write agent://<id>` |
| Read a long subagent result | `read agent://<id>` (structured fields at `agent://<id>/<field>`) |
| Task tracking ("create a todo", "mark complete") | The built-in `todo` tool |

## Subagents

omp ships a built-in `task` tool. Use it for every Superpowers subagent workflow — never conclude that subagent capability is missing.

Batch shape (the `task.batch` setting, on by default): one call carries `{ context, tasks[] }`, one subagent per item, run concurrently (capped by the `task.maxConcurrency` setting). Every item also needs `solutionSpace`, one line on how open the problem is. Dispatch parallel agents as multiple entries in a single call, never as sequential calls.

Agent types: pick the most specific one per item from the roster in the `task` tool's own description. Commonly available: `scout` (read-only research — use for investigation), `reviewer`, `security-reviewer`, `sonic` (strictly mechanical work), `task` (general-purpose, full capabilities). The exact roster depends on installed and configured agents, so read the tool description rather than assuming.

The tool is lowercase `task`; `Task` does not exist. `task.isolation.enabled` (default off) only lets a dispatch mark items `isolated: true`; isolated work comes back as an applied patch (default `task.isolation.merge: patch`), and an isolated subagent cannot be messaged afterwards. Superpowers SDD does not use it.

### Model selection on omp

The `task` tool has **no `model:` field**. Every `model: [...]` line in a Superpowers template is inert here — the agent TYPE carries model, thinking level, and tool set. The bundled `task` is a general agent with the widest tool set and whatever `modelRoles.task` names, not an SDD seat's contract.

This fork ships SDD-specific agents (they appear in the `task` roster once the plugin is installed):

| Superpowers role | `agent:` | Shipped default · thinking | Tools |
| --- | --- | --- | --- |
| Implementer, fix rounds 1-2 | `sdd-implementer` | claude-sonnet-5-5 · medium | edit/test tools; no subagents |
| Task reviewer | `sdd-reviewer` | claude-sonnet-5-5 · high | `read`, `grep`, `glob` — no bash, edit, or file-writing tool |
| Scoped re-review | `sdd-rereviewer` | claude-sonnet-5-5 · low | `read`/`grep`; ≤4 working calls plus the final `yield` |
| Fix round 3 / ruled strongest-tier task | `sdd-escalation-implementer` | claude-opus-5-5 · max | same tools as the implementer |
| Final whole-branch review (subagent-driven-development or executing-plans) | `sdd-final-reviewer` | claude-opus-5-5 · max | read-only + focused bash |

Shipped defaults are Anthropic; the tiers are a thinking ladder (low / medium / high / max). Re-point any seat per host with `task.agentModelOverrides` in `~/.omp/agent/config.yml` (or `/agents`) — it beats the agent file's `model:`, applies on the next dispatch, and a bare model keeps the agent's `thinkingLevel:` while an explicit `:level` replaces it. Turn on `task.showResolvedModelBadge` (default off) to see the model each subagent actually ran.

Never use the bundled `task` agent for an SDD seat: it lacks the seat's tools, output contract and no-subagent rule, and runs whatever `modelRoles.task` names (else the session model). If `task.enableEffort` is on, `effort: "hi"` on a dispatch raises that one subagent's thinking without changing its model — the only accepted values are `"lo"`, `"med"`, `"hi"`. `"hi"` maps to the model's top supported level, capped by `task.maxEffort`.

### Tool boundary

An agent's `tools:` list limits built-in tools only. Extension tools and MCP tools (mounted as `xd://` devices and run through a device-only `write` that refuses file paths) still attach to every subagent; memory tools attach only when the agent's `tools:` list names them. On omp 18.4.10 a read/grep/glob reviewer ran a shell command through an MCP device. Read-only seats are read-only by instruction, not by sandbox.

## Task lists

omp ships a built-in `todo` tool (`init`, `start`, `done`, `rm`, `drop`, `block`, `unblock`, `append`, `view`). Use it for all task tracking. Do not use Superpowers plan files, Markdown checklists, or a repo-local `TODO.md` for this. Older Superpowers docs may refer to `TodoWrite`; treat that as the `todo` tool.
