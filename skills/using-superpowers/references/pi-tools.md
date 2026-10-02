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

### Checks

From omp 18.4.12, every subagent's system prompt carries a hand-off rule ahead of the agent body (read in 18.4.12's `src/prompts/system/system-prompt.md`). It says the main agent verifies once after all subagents land, and: "NEVER verify your changes (builds, tests, linters, formatters, smoke runs) unless your assignment explicitly instructs it." It also tells the subagent to yield when its changes are complete and to name the checks the main agent should run. omp 18.4.10 allowed scoped proof instead: a single test file, a targeted repro, a smoke run.

The rule is prompt text, not a tool block. It applies to every subagent at task depth > 0: plugin agents and vibe workers alike. An explicit instruction in the dispatch wins. Measured on 18.4.12 with haiku-4-5:low, a weak proxy for the real seats:

- an `sdd-implementer` given the implementer template ran `npm test` before and after its fix, and reported RED/GREEN;
- a vibe `good` worker told "fix sum.js so sum(2, 3) returns 5, then commit" ran no test;
- the same brief plus "This assignment explicitly instructs you to run the tests yourself (`npm test`), before and after the fix" ran both.

So every dispatch that needs a check names the command and when to run it. SDD's implementer template already instructs its test runs: the focused test while iterating, the full suite once before committing.

## Task lists

omp ships a built-in `todo` tool (`init`, `start`, `done`, `rm`, `drop`, `block`, `unblock`, `append`, `view`). Use it for all task tracking. Do not use Superpowers plan files, Markdown checklists, or a repo-local `TODO.md` for this. Older Superpowers docs may refer to `TodoWrite`; treat that as the `todo` tool.

## Vibe mode

`/vibe` makes the session a director of worker sessions. You are the director when your tools include `vibe_spawn` but not `task` (a hidden `<vibe-mode>` block before each prompt also says "Vibe mode ON. You are DIRECTOR"). The director keeps `read`, `todo`, the `vibe_*` tools (`vibe_spawn`, `vibe_send`, `vibe_wait`, `vibe_kill`, `vibe_list`) and any MCP tools. It has no `task`, `bash`, `edit`, `write`, `grep`, `glob` or `ask`. MCP tools stay, but omp's vibe rule still applies (never edit, run, grep or build yourself), so do not run commands through an MCP tool either. Every instruction that needs a missing tool goes to a worker.

| Action skills request | Vibe director's equivalent |
| --- | --- |
| Dispatch a subagent | `vibe_spawn` a worker. `vibe_spawn` takes only `cli`, a name and a prompt. `cli: "fast"` is omp's bundled `sonic` agent on the `modelRoles.smol` model; `cli: "good"` is the bundled `task` agent on the `modelRoles.task` model. It cannot start any other agent type |
| Message or resume it | `vibe_send` to the same worker session |
| Read a long result | The worker writes it to a file; you `read` the file |
| Run a command, edit, commit | A worker does it |
| Verify a claim | A worker you explicitly tell to run the command saves the full output and exit code to a file; you `read` that file |
| Task tracking ("create a todo", "mark complete") | `todo`, which only the director has |

A worker is an ordinary omp subagent. It has the normal coding tools, including `task`, `wait` and `write agent://`, but no `todo`, `ask` or `vibe_*`, and it starts in the session's cwd. It never gets this plugin's bootstrap (the extension skips subagent sessions), so a brief names the skill to `read` (`read skill://<name>`). Workers get the 18.4.12 hand-off rule too (see *Checks*), so a brief that needs a test, build or smoke run names it. A worker is never an SDD seat: `fast` and `good` are the bundled `sonic` and `task` agents, and overrides for their models are `task.agentModelOverrides.sonic` and `task.agentModelOverrides.task`. A long worker result reaches you as a cut-off `<vibe-turn>` response, and its full text at `agent://<id>` comes back as a single line that `read` cuts at 768 characters. Have workers write long reports to a file, and `read` the file.

- **subagent-driven-development and executing-plans:** hand the whole run to ONE `good` worker. Its brief names the skill to read, the plan path and the worktree path, and gives two rules. First, run every test, build and script the skill calls for: the brief must say so explicitly, because an 18.4.12 worker skips checks otherwise (see *Checks*). Second, when the skill says to stop and ask your human partner, end the turn with the question. That worker is the controller. It runs the scripts, keeps the ledger, and dispatches the SDD seats through its own `task` tool, so each seat keeps its model, tools and output contract (measured on omp 18.4.10: a `good` worker ran `read skill://subagent-driven-development`, dispatched `sdd-rereviewer` through its own `task` tool, and the seat ran on its `task.agentModelOverrides` model, returned its structured output to the worker, and was resumed with `write agent://<id>`). The worker has no `todo`; the ledger (`<workspace>/progress.md`) is its record. You keep `todo` from the ledger, take its questions to your human partner, and `vibe_send` the answers.
- **Worktrees:** while vibe is on, `/move`, `/wt`, `/new` and fork are refused ("Exit vibe mode first."), and leaving vibe mode kills every worker. Create the worktree and `/move` into it before `/vibe`. Otherwise every brief carries the worktree's absolute path, and you `read` files there by absolute path.
- **Long runs:** a worker's first turn runs under omp's soft request budget, `task.softRequestBudget`: 200 by default, and the `fast` worker's `sonic` agent caps at 100. At the budget the worker gets a wrap-up notice; at 1.5x it is stopped and must yield. A long plan's controller can cross the budget. Set `task.softRequestBudget: 0` (it disables the budget for every subagent), or `vibe_send` the stopped worker "continue from the ledger": omp's source runs a `vibe_send` turn without the budget and keeps a budget-stopped worker idle and resumable (read in 18.4.12's source, not run).
- **The rest:** brainstorming's questions, the plan handoff and finishing a branch's options are conversation, and stay with the director. A worker writes the files and runs git and the tests its brief names.
