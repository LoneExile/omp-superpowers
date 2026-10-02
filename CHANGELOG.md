# Changelog

Releases of [`@loneexile/omp-superpowers`](https://www.npmjs.com/package/@loneexile/omp-superpowers), the omp (Oh My Pi) adaptation of [obra/superpowers](https://github.com/obra/superpowers).

A version is `<upstream version>-omp.<n>`: the upstream release this fork is synced to, then the fork's own iteration on top of it. Upstream's changes are described in its [release notes](https://github.com/obra/superpowers/blob/main/RELEASE-NOTES.md); this file records what the fork adds or changes.

## [Unreleased]

## [6.4.2-omp.1] - 2026-10-02

First release, synced to upstream [v6.4.2](https://github.com/obra/superpowers/blob/v6.4.2/RELEASE-NOTES.md).

### Added

- **omp tool mapping.** The bootstrap injected into every session, and `skills/using-superpowers/references/pi-tools.md`, describe omp's real `task` tool (batched subagents, no `model:` field) and `todo` tool instead of claiming the harness has neither.
- **Five SDD agents** (`agents/sdd-*.md`): implementer, task reviewer, scoped re-reviewer, round-3 escalation implementer, and final whole-branch reviewer, each with its own model, thinking level, and tool set. Re-point any seat per host with `task.agentModelOverrides`.
- **subagent-driven-development rewritten around them:** *Agent Selection* replaces *Model Selection*; a three-round fix loop whose third round goes to the escalation seat; a proven-trivial-fix route; structured reviewer results with a `package_gap` verdict; parallel implementer waves only when `task.isolation.enabled` is on.
- **omp worktree steps** in `using-git-worktrees`: `/wt` for the user, `omp worktree add` for the agent.
- **npm package.** `omp plugin install npm:@loneexile/omp-superpowers`. The package holds only what omp loads (the extension, `skills/`, `agents/`). GitHub Releases publish it through npm Trusted Publishing, with provenance.

### Changed

- **Synced with upstream v6.4.2** (from v6.3.0): the `diagnosing-superpowers` skill, inline `executing-plans` (Native execution), leaner `writing-plans` plans with a Review Focus section, per-plan ownership markers in `sdd-workspace`, range guards in `review-package`, and skill prose that invokes bundled scripts through `bash`.
- The fork's rewritten subagent-driven-development text invokes its helper scripts through `bash` as well, so a package extractor that drops exec bits cannot break them.
- `sdd-final-reviewer` carries upstream's new review rules from `code-reviewer.md`, the template it replaces in SDD's final review: the spec is a vision document (behavior it is silent on is graded by what a reasonable person expects), and a "Declined to judge" section that the controller rules on and ledgers like a plan conflict.

[Unreleased]: https://github.com/LoneExile/omp-superpowers/compare/v6.4.2-omp.1...HEAD
[6.4.2-omp.1]: https://github.com/LoneExile/omp-superpowers/releases/tag/v6.4.2-omp.1
