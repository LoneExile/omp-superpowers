# Personal omp-superpowers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install a pinned personal omp-superpowers with embedded Ponytail/SDD guardrails while preserving the sole @omp-utils/code-review receiving skill.

**Architecture:** Fork LoneExile at fad5b9e7ec578fbac11c7dbe1b251ceb1d7f19a9. Retain its workflow and native bootstrap; remove only the duplicate receiving skill, repair agent contracts and route personal models in operator config. Install original Ponytail separately at release SHA7801d061243d7b753bad0e0b3c057cd250b11755. Prove in temporary config before withdrawing existing vendor symlinks.

**Tech Stack:** Markdown skills/agents, TypeScript Pi extension, Node built-in tests, bash package inspection, omp 18.20.2, GitHub Git installs.

**Spec:** docs/specs/2026-11-16-personal-omp-superpowers-design.md

## Global Constraints

- Personal package @yarikmix/omp-superpowers, GitHub YarikMix/omp-superpowers; base 7.0.2-omp.3. Local version 7.0.2-omp.4.
- Delete skills/receiving-code-review only in the personal fork. Never edit official vendor, ~/projects/omp-utils, global memory or Codex config.
- Fourteen Superpowers skills, five sdd-* roles. Sole receiving-code-review owner: @omp-utils/code-review, no upstream alias.
- Keep risk-based review, independent parallel worktrees, three fix rounds. Missing accepted requirements/checks cannot become complete through parking.
- Exact Russian guard paragraph comes from the approved spec. It travels verbatim with spec/plan paths in initial implementer/reviewer and every fix/resume/escalation/final dispatch. Role output contracts outrank Ponytail generic endings.
- Add structured:true only to sdd-reviewer and sdd-rereviewer. Keep global task.structured=false and task.perCallModel=off.
- Keep task.eager=preferred, task.isolation.enabled=false, task.autoParallel=off, batch=true, steps=false.
- Operator model: openai-codex/gpt-6.1-sol. Role levels: implementer medium, reviewer high, rereviewer low, escalation/final max. No added providers.
- Original Ponytail modes are per-session; do not invent inherited-mode behavior. Default full only when no existing operator override.
- User authorized fork creation, commits/push and installation/cutover after evidence. No npm publication, no PR to upstream.

## Review Focus

- Package-root skills discovery must not expose removed receiving under a namespace: check real omp skill list, not pi.skills alone.
- Parent bootstrap must survive compaction and skip children without losing worker guardrails: extend existing lifecycle test and inspect actual worker assignments.
- Parent off does not imply worker off: smoke records actual native mode semantics and output-schema precedence.
- Resumed worker must receive fix with same identity and deliver real source change: capture actual task/follow-up and covering check.
- Cutover must preserve every unrelated skill/link/config change: scoped rollback metadata and before/after content hashes; never restore the old receiving link.

---

### Task 1: Personal package and sole receiving ownership

**Files:** package.json; .omp-plugin/plugin.json; scripts/check-npm-package.sh; .github/workflows release configuration if it would publish to the original npm scope; README.md; CHANGELOG.md; new SOURCE.md; remove skills/receiving-code-review directory.

**Interfaces:** Consumes unchanged upstream layout. Produces directly installable package @yarikmix/omp-superpowers@7.0.2-omp.4 with no receiving directory and all fourteen other complete skills, extension and agents. No distribution branch/build staging.

- [ ] Inspect existing package and release workflow before editing. Preserve upstream licenses and historical changelog.
- [ ] Rebrand active package/repository/native marker and relevant install/maintenance docs to the personal fork. Record both obra provenance and exact LoneExile base SHA in SOURCE.md. Disable automatic npm publication, not ordinary local validation.
- [ ] Remove the personal fork's receiving directory. Do not alter the external owned skill or official vendor. Include native .omp-plugin and SOURCE.md in package files and update exact package-file validation accordingly.
- [ ] Update existing package contract expectations only where public identity changes. Do not add brittle prose/source-string tests. Package dry-run/discovery inspection is the feature proof.
- [ ] Parent verification after edits: bash scripts/check-npm-package.sh. Inspect actual tarball manifest: receiving directory absent, full fourteen skill directories and native manifest present.
- [ ] Commit task; fresh reviewer checks spec+quality from brief/report/full diff package.

### Task 2: SDD guardrails, output and native Ponytail integration

**Files:** .pi/extensions/superpowers.ts; skills/using-superpowers/references/pi-tools.md; skills/subagent-driven-development/SKILL.md; its implementer-prompt.md, task-reviewer-prompt.md, re-review-prompt.md; agents/sdd-*.md; tests/pi/test-pi-extension.mjs; README.md, CHANGELOG.md as necessary.

**Interfaces:** Consumes Task1 package identity and preserved layout. Produces role-local structured contracts and end-to-end dispatch instructions independent of global memory. Original Ponytail remains a separate plugin, not copied code.

- [ ] Read complete controller dispatch/fix/merge/final sections and existing lifecycle tests before editing.
- [ ] Embed exact approved guard paragraph in relevant controller/role/template contracts; dispatch instructions require literal paragraph plus explicit spec/plan paths on every initial and follow-up assignment. Keep requirements task-scoped, not pasted full-plan history.
- [ ] Cover escalation, merge-fix, wave-fix, final review and omnibus final fixer, not just happy path. Every implementer assignment explicitly names covering check commands and required evidence.
- [ ] Preserve structured/report output over Ponytail generic closings. Set structured:true on two schema reviewer agents only.
- [ ] At the third-round cap, unmet accepted scope or mandatory checks means non-acceptance, not complete. Keep adjudication for nonmandatory/contested findings and do not add rounds.
- [ ] Correct categorical no-model-field prose: this installation uses named-agent routing; do not send ordinary per-call model overrides. Bootstrap identifies @omp-utils/code-review as receiving owner, no fallback.
- [ ] Extend existing executable bootstrap tests for owner/guard context surviving later requests and compaction without duplicate main bootstrap. Tests exercise returned runtime messages, not arbitrary text echoes. Agent schema behavior is proven by live smoke in Task3.
- [ ] Parent verification after edits: node --test tests/pi/test-pi-extension.mjs; bash scripts/check-npm-package.sh; bash tests/sdd-helper-paths/test-sdd-helper-paths.sh.
- [ ] Commit task; fresh task reviewer checks complete diff, no repeated test execution on unchanged code.

### Task 3: Isolated real-plugin acceptance and same-worker fix

**Files:** new docs/reports/2026-11-16-personal-omp-superpowers-acceptance.md. Temporary config, fixture and transcripts outside tracked source or under ignored .superpowers workspace.

**Interfaces:** Consumes committed source Tasks1-2. Produces evidence report and exact tested source SHA suitable for global installation. No global plugin/link changes in this task.

- [ ] Inspect omp help/docs to select temporary user-config directory and provider credentials without copying secrets into reports. Use supported env/config isolation, original Ponytail release pin, own plugin source snapshot, and temporary sdd model overrides. Do not set restrictive modes by guessing keys.
- [ ] Verify actual plugin loading, 14 personal skills, five native sdd roles and absence of upstream receiving; original Ponytail contributes its own separately identified skills. Test its per-session off/on behavior and record boundaries.
- [ ] Write throwaway deterministic spec/plan for comma-separated allowlist parsing: trim items, ignore empties, reject non-string. Cover with Node built-in tests. Run actual sdd-implementer to implement/commit/report with literal guard/spec/plan/check assignment.
- [ ] Run actual structured sdd-reviewer on real brief/report/diff; prove schema yield with global structured=false. If clean, transparently inject substantive missing non-string validation into fixture and commit; use real changed HEAD for another independent review. Never instruct a reviewer which verdict to emit or fabricate findings.
- [ ] Forward real finding via write agent://<original-id> with literal guard, spec/plan and check. Observe same worker identity/history fixing source, running check, committing and appending evidence.
- [ ] Run actual sdd-rereviewer on genuine fix range. Record structured verdict, covering test output, changed file and all dispatch evidence. Final acceptance checks scoped requirements; normal reviewer agreement alone does not prove source behavior.
- [ ] Run final whole-branch review once on personal fork with fresh reviewer; address confirmed findings, narrow check only if changed.
- [ ] Record factual outcomes/limitations and exact commands without credentials. Delete throwaway scripts/fixture after recording evidence, retain needed nonsecret transcript artifacts privately. Commit report before source release push.

### Task 4: Pinned cutover and scoped rollback

**Files:** operator plugin manifests/locks and config keys; legacy Superpowers symlinks only; acceptance report addendum with installed SHA and rollback location. Parent owns these mutations.

**Interfaces:** Consumes Task3 proven source SHA. Produces ordinary omp discovery backed solely by personal Superpowers plus separate owned receiving and original Ponytail.

- [ ] Capture hashes of protected receiving files, global memory and Codex config; baseline skill list. Capture every withdrawing symlink with lstat/literal target/realpath, plugin/lock/config metadata and existing absent statuses. Store private backup outside discovery.
- [ ] Push approved personal branch/release content to origin main without force; preserve upstream remote. Resolve immutable Git SHA for installation.
- [ ] Install original Ponytail only if not already installed; install personal package from GitHub exact SHA using supported omp plugin manager. Record outputs. Do not alter source caches by hand.
- [ ] Apply only approved five task.agentModelOverrides and task.showResolvedModelBadge via cfg approval, preserving unrelated keys. Persist only after permission; unavailable approval is not permission to edit config behind cfg.
- [ ] Archive only verified symlinks exposing official vendor skills, preserving nested-chain correctness and leaving actual skill directories untouched. Never restore receiving link.
- [ ] Fresh omp process: omp skill list --json proves exactly one receiving-code-review from @omp-utils/code-review, 14 personal skill sources with no vendor aliases, no disappeared unrelated skills; inspect real role roster/resolved models and bootstrap.
- [ ] Compare protected hashes. On failure restore only own touched links/keys and remove only newly installed packages, preserving concurrent changes. Re-test narrow failed discovery scenario after fix; do not silently leave partial cutover.
- [ ] Record installation SHA, backup/rollback command information, version, evidence and fresh-session requirement; remove temporary verification snapshots. Finish all user todos.

## Plan self-review

Spec coverage: package/provenance/exclusion Task1; every role/dispatch/guard and native boundaries Task2; isolated acceptance/schema/Ponytail modes/real repair Task3; links/config/discovery/protected ownership/rollback Task4. No user requirement deferred. No npm publication or Codex/global-memory mutation. Native lifecycle reuse avoids new Ponytail mode/inheritance implementation.
