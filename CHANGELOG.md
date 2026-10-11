# Changelog

Releases of [`@loneexile/omp-superpowers`](https://www.npmjs.com/package/@loneexile/omp-superpowers), the omp (Oh My Pi) adaptation of [obra/superpowers](https://github.com/obra/superpowers).

A version is `<upstream version>-omp.<n>`: the upstream release this fork is synced to, then the fork's own iteration on top of it. Upstream's changes are described in its [release notes](https://github.com/obra/superpowers/blob/main/RELEASE-NOTES.md); this file records what the fork adds or changes.

## [Unreleased]

### Changed

- **Specs and plans save to `docs/specs/` and `docs/plans/`.** Upstream saves them under `docs/superpowers/`. brainstorming's written design and writing-plans' plan file now go to the shorter paths, and the example plan paths in executing-plans, subagent-driven-development and requesting-code-review match. `.superpowers/` (the SDD workspace and the brainstorm companion's files) is unchanged. Existing plans under `docs/superpowers/plans/` still run: SDD and executing-plans take any plan path. `scripts/check-npm-package.sh` now fails if a shipped file names `docs/superpowers/`.

## [7.0.0-omp.1] - 2026-10-11

Synced to upstream [v7.0.0](https://github.com/obra/superpowers/blob/v7.0.0/RELEASE-NOTES.md).

### Fixed

- **`skill://` in `bash` is narrower than the setup text said.** omp's shell resolves `skill://` paths itself, in its builtins and in-process coreutils, but an external program gets the literal URL, and a host extension can turn a command into one. In a real omp 18.5.0 run with the RTK extension, the controller's `realpath skill://subagent-driven-development/scripts` printed the directory, and the `ls skill://…/scripts` it added next, rewritten to `rtk ls`, failed with "No such file or directory". The SDD and executing-plans setup now says so and says to use the printed path everywhere else. The instructed path, one `realpath` then the printed directory, was never affected.
- **A vibe director's todo now follows the ledger at each read.** In the same run the director read three new `Task N: complete` lines, then waited another 10 minutes before marking them, so the todo lagged the ledger by 8 to 18 minutes. The vibe notes now say to mark them before waiting again.

### Changed

- **Synced with upstream v7.0.0** (from v6.4.2). What reaches omp: `brainstorming` is rebuilt around drawing out what you want before sizing the work, and a builder check (`builder-check-prompt.md`), which a subagent runs on the written design, replaces its spec reviewer. `task-done` now records a passing task whose tests print nothing; before, it exited without writing the ledger line. `sdd-workspace` leaves an existing `.superpowers/sdd/.gitignore` alone and keeps plan markers repo-relative on Git Bash. The systematic-debugging example no longer prints secret values. Upstream's Windows hook, Antigravity and Hermes changes are outside the npm package. No fork text needed porting: upstream touched none of the files this fork rewrites, and the builder check's general-purpose subagent goes to omp's `task` tool through the existing mapping.

## [6.4.2-omp.4] - 2026-10-03

### Added

- **omp vibe mode support.** In `/vibe` the session is a director with `read`, `todo`, the `vibe_*` tools and any MCP tools, but no `task`, `bash`, `edit` or `write`, and its `fast` and `good` workers are the bundled `sonic` and `task` agents, not SDD seats. subagent-driven-development and executing-plans now tell a director (tools include `vibe_spawn` but not `task`) to hand the whole run to one `good` worker, which keeps the ledger and dispatches the `sdd-*` seats through its own `task` tool. Each controller brief explicitly instructs the worker to run the tests, builds and scripts the skill calls for. using-git-worktrees says vibe refuses `/move` and `/wt` and leaving vibe kills every worker, so the worktree and `/move` come first. writing-plans' handoff says both approaches run in a worker. `pi-tools.md` gains a *Vibe mode* section: the action-to-`vibe_*` table, what workers have, and the request-budget note. Checked end to end on omp 18.4.12, with the director and worker on sonnet-5-5:low and the seats on haiku-4-5:low: a single `/vibe` prompt to execute a one-task plan led the director to read executing-plans' vibe note and brief one `good` worker with both rules; the worker resolved the scripts with `realpath`, created the workspace and ledger, ran `task-start`, ran `npm test` RED then GREEN, committed, ran `task-done` and `review-package`, and dispatched `sdd-final-reviewer` through its own `task` tool; the reviewer found nothing to fix, and the director reported the branch mergeable.
- **The injected mapping points a vibe director at that section.** Its last paragraph tells a session whose tools include `vibe_spawn` but not `task` that it is a director without the `task`, `bash`, `edit` or `write` tools the mapping names, and to read the section before acting on them. Live check on omp 18.4.10: a `good` worker ran `read skill://subagent-driven-development`, dispatched `sdd-rereviewer` through its own `task` tool, and the seat ran on its `task.agentModelOverrides` model, returned its structured output to the worker, and was resumed with `write agent://<id>`.

### Fixed

- **Subagents on omp 18.4.12 skip their checks unless told.** From 18.4.12 every subagent's system prompt, plugin agents and vibe workers alike, carries a hand-off rule: the main agent verifies once after all subagents land, and a subagent must not verify its changes (builds, tests, linters, formatters, smoke runs) unless its assignment explicitly instructs it. 18.4.10 allowed scoped proof instead. The rule is prompt text, not a tool block. The injected mapping now tells a dispatching session to name the checks a subagent must run, and `pi-tools.md` gains a *Checks* subsection that quotes the rule and says every dispatch that needs a check names the command and when to run it. Measured on 18.4.12 with haiku-4-5:low, a weak proxy for the real seats: an `sdd-implementer` given the implementer template ran `npm test` before and after its fix and reported RED/GREEN; a vibe `good` worker told to fix `sum.js` and commit ran no test; the same brief plus an explicit instruction to run `npm test` before and after the fix ran both.

## [6.4.2-omp.3] - 2026-10-02

### Fixed

- **The reviewer read-only boundary was overstated.** The text said reviewers could not run a shell, leaning on `hub`, which omp 18.3.0 removed. A `tools:` list limits built-in tools only: extension tools and MCP tools (`xd://` devices through the device-only `write`) still attach, and memory tools attach only when the list names them. A live probe on 18.4.10 had a read/grep/glob reviewer run a shell command through an MCP device. The docs now say read-only is by instruction, and the reviewers forbid such calls.
- **Subagents start in the session's cwd.** The `task` tool has no `cwd`, so after `omp worktree add` and before `/move`, every SDD subagent worked in the original checkout (measured). using-git-worktrees, SDD Setup and executing-plans' final-review dispatch now require `/move` first, or the worktree's absolute path plus the bash `cwd` parameter in every dispatch.
- **The bootstrap reaches `/new`, `/resume` and `/fork` sessions.** omp fires `session_start` once per process, so only the first session got the bootstrap. The extension now re-arms on `session_switch`, skips subagent sessions, and ignores an `agent_end` that will auto-continue, so an automatic retry no longer ends injection early.
- **The scripts directory resolves on omp.** The SDD and executing-plans text assumed a path that does not exist there. They now resolve `skill://subagent-driven-development/scripts` and `skill://executing-plans/scripts` with `realpath`, record them in the ledger, and run scripts from the repo root.
- **The omp worktree steps match omp 18.4.10.** All re-measured. `omp worktree clear --all` force-removes every worktree under the worktree directory, live and `/wt` ones included, uncommitted work and all; the text had said it "also takes PR checkouts". Clone-first falls back to a plain checkout, without `node_modules`, on filesystems without copy-on-write clones or for in-repo targets. Setup and tests run in the worktree via the bash tool's `cwd` parameter until `/move`. omp's bash rewrites a literal `git worktree add` into `omp worktree add`, but only without shell expansion. The omp-added lines say "your human partner".
- **Reviewers read the whole package.** Reads came in 300-line pages, and summarization could replace the diff with a digest. Seats set `readSummarize: false`, the text uses `:1-3000` ranges, and the call budgets now leave room for the extra pages and the final `yield` call.
- **Parallel implementer waves are gone.** Isolated work merges as a patch with no per-task commits, and an isolated agent cannot be resumed for fix rounds. Implementers run one at a time, as upstream does.
- **The implementer runs the full suite once before committing,** as upstream's template says, not on every iteration.
- **The escalation seat handles a first implementation** when a task is ruled to need the strongest tier, not only a third fix round.
- **Templates carry the required `solutionSpace`.** omp's task schema requires it on every spawn, not only in the batch shape.
- **The tool mapping is complete.** It adds resume via `write agent://<id>`, full results at `agent://<id>`, `task.batch`, `solutionSpace`, and the `superpowers:` skill-name prefix, and drops tier claims that hosts override.
- **Marketplace and `--plugin-dir` installs keep model pins.** Without `.omp-plugin/plugin.json`, omp treated the repo root as Claude dialect and dropped every agent's `model:` line. The repo now carries that manifest. The discovery check was read from omp's source; a marketplace install has not been exercised.

### Changed

- **New seat defaults, with fallbacks.** Each seat pins `anthropic/claude-sonnet-5-5` (medium, high, low) or `claude-opus-5-5:max`, then falls back to `@task` (implementer, reviewers) or `@slow` (escalation, final review). omp takes the first entry with credentials, and the list is also the retry chain on rate and usage limits (`retry.modelFallback`). An override in `task.agentModelOverrides` replaces the whole list; append `,@task` to keep a fallback.
- **`sdd-final-reviewer` reads `code-reviewer.md`'s rubric** at run time (What to Check, Calibration, severity definitions, Critical Rules) and reports Strengths first and Mergeable last.
- **Task review scales with risk** through `effort: "hi"` on high-risk tasks, only when `task.enableEffort` is on. The controller ledgers a `Task <N>: high-risk diff — <class>` line; without `effort`, it names that risk in the final review dispatch.
- **The controller checks reviewer results** and runs the tests a re-review names, rather than trusting the reviewer's word.
- **The final dispatch passes the applied-fix and high-risk lines,** so the final reviewer knows where to look hardest.
- **Fix rounds go to the same implementer.** Fix rounds 1-2 and NEEDS_CONTEXT message the idle implementer with `write agent://<id>`; the id is ledgered at dispatch (a `dispatched` line). A write to an idle agent has two success answers: a live agent answers `Delivered to <id>.`, and a parked one answers `Queued for <id> (was parked; revived).` (an idle agent is parked after `task.agentIdleTtlMs`, 7 minutes by default). Only an error means dispatch fresh, and the fresh dispatch's new id is ledgered as `re-dispatched`. BLOCKED maps onto seats: retry the same seat, or escalate to `sdd-escalation-implementer` as a takeover or a first implementation.
- **The escalation takeover also covers a BLOCKED implementer.** The dispatch carries the blocker instead of findings.
- **Ledger lines are found by prefix, never by position.** Lines like `SDD scripts:` are matched by prefix, so SDD and executing-plans can share a ledger.
- **Agent descriptions name roles only,** never models, since hosts re-point them.

## [6.4.2-omp.2] - 2026-10-02

### Fixed

- **Native execution's final review goes to a known agent on omp.** `executing-plans` tells the controller to dispatch its final review "on the most capable available model" and to specify the model explicitly, but omp's `task` tool has no `model:` field, so the review ran on whichever agent the session picked. An omp paragraph in its Final Review now sends it to `sdd-final-reviewer`. Its model is whatever your host maps that agent to: opus-5 · xhigh by default, or your `task.agentModelOverrides` entry.
- **`sdd-final-reviewer` knows how the plan ran.** It assumed every task had passed a task review and concentrated on cross-file seams. After an inline run no task was reviewed, so it now does the task reviews' work across the whole branch, then the seams. subagent-driven-development's dispatch says its tasks were reviewed; a dispatch that does not say gets the full review. It also checks each Review Focus item the dispatch carries.

## [6.4.2-omp.1] - 2026-10-02

First release, synced to upstream [v6.4.2](https://github.com/obra/superpowers/blob/v6.4.2/RELEASE-NOTES.md).

### Added

- **omp tool mapping.** The bootstrap injected into every session, and `skills/using-superpowers/references/pi-tools.md`, describe omp's real `task` tool (batched subagents, no `model:` field) and `todo` tool instead of claiming the harness has neither.
- **Five SDD agents** (`agents/sdd-*.md`): implementer, task reviewer, scoped re-reviewer, round-3 escalation implementer, and final whole-branch reviewer, each with its own model, thinking level, and tool set. Re-point any seat per host with `task.agentModelOverrides`.
- **subagent-driven-development rewritten around them:** *Agent Selection* replaces *Model Selection*; a three-round fix loop whose third round goes to the escalation seat; a proven-trivial-fix route; structured reviewer results with a `package_gap` verdict; parallel implementer waves only when `task.isolation.enabled` is on.
- **omp worktree steps** in `using-git-worktrees`: `/wt` for the user, `omp worktree add` for the agent.
- **npm package.** `omp plugin install npm:@loneexile/omp-superpowers`. The package holds only what omp loads (the extension, `skills/`, `agents/`). This first version was published by hand, without provenance; 6.4.2-omp.2 was the first release published through GitHub Releases and npm Trusted Publishing, with provenance.

### Changed

- **Synced with upstream v6.4.2** (from v6.3.0): the `diagnosing-superpowers` skill, inline `executing-plans` (Native execution), leaner `writing-plans` plans with a Review Focus section, per-plan ownership markers in `sdd-workspace`, range guards in `review-package`, and skill prose that invokes bundled scripts through `bash`.
- The fork's rewritten subagent-driven-development text invokes its helper scripts through `bash` as well, so a package extractor that drops exec bits cannot break them.
- `sdd-final-reviewer` carries upstream's new review rules from `code-reviewer.md`, the template it replaces in SDD's final review: the spec is a vision document (behavior it is silent on is graded by what a reasonable person expects), and a "Declined to judge" section that the controller rules on and ledgers like a plan conflict.

[Unreleased]: https://github.com/LoneExile/omp-superpowers/compare/v7.0.0-omp.1...HEAD
[7.0.0-omp.1]: https://github.com/LoneExile/omp-superpowers/releases/tag/v7.0.0-omp.1
[6.4.2-omp.4]: https://github.com/LoneExile/omp-superpowers/releases/tag/v6.4.2-omp.4
[6.4.2-omp.3]: https://github.com/LoneExile/omp-superpowers/releases/tag/v6.4.2-omp.3
[6.4.2-omp.2]: https://github.com/LoneExile/omp-superpowers/releases/tag/v6.4.2-omp.2
[6.4.2-omp.1]: https://github.com/LoneExile/omp-superpowers/releases/tag/v6.4.2-omp.1
