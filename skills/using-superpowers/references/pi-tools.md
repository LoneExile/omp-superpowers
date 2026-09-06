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

## Task lists

omp ships a built-in `todo` tool (`init`, `start`, `done`, `rm`, `drop`, `block`, `unblock`, `append`, `view`). Use it for all task tracking. Do not use Superpowers plan files, Markdown checklists, or a repo-local `TODO.md` for this. Older Superpowers docs may refer to `TodoWrite`; treat that as the `todo` tool.
