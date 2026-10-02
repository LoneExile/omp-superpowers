# Scoped Re-Review Prompt Template

Use this template when dispatching a re-review after a fix round. The
re-reviewer verifies the findings were addressed and checks the fix diff for
new breakage. It is not a fresh review — the full review already happened.

**Purpose:** Verify each finding from the previous review was addressed, and
that the fix itself broke nothing.

```
{ context: "<one line: plan name, branch, read-only re-review of one fix round>",
  tasks: [ {
  name: "ReReviewTaskNRoundR",
  agent: "sdd-rereviewer",   # REQUIRED — the verdict-only seat: read/grep only (no
                             # edit, bash, or file-write tool), four working calls
                             # plus the final yield.
  solutionSpace: "verdicts only: the findings and the fix diff are given; nothing to design",
                             # REQUIRED by omp's task schema: one line on how open the problem is.
  task: |
    You are re-reviewing one task's fix round. A previous review produced
    findings; an implementer has attempted to fix them. Your job is to
    verdict each finding and inspect the fix diff — nothing else.

    ## The Task

    Read the task brief (explicit range: `[BRIEF_FILE]:1-3000`): [BRIEF_FILE]

    ## The Findings Under Verification

    [FINDINGS]

    ## The Fix

    Read the implementer's report to its last line — the fix reports are
    appended at the end, past a bare read's 300 lines (explicit range:
    `[REPORT_FILE]:1-3000`): [REPORT_FILE]

    **Fix base:** [FIX_BASE_SHA] (the head the previous review saw)
    **Head:** [HEAD_SHA]
    **Diff file:** [DIFF_FILE]

    Read the diff file in full, with an explicit range: `[DIFF_FILE]:1-3000`
    (a bare read returns only the first 300 lines; while the footer says
    `[Showing lines … of N. Use :M to continue]`, continue with the next
    range). It contains the fix commits, a stat summary, and the fix diff
    with surrounding context. You have no bash tool; if the diff file is
    missing, report that as a gap and stop.

    Your review is read-only on this checkout. Do not mutate the working
    tree, the index, HEAD, or branch state in any way, and never call an
    `xd://` device or an extension, MCP, or memory tool that executes code,
    writes files, or changes external state — your `tools:` list does not
    stop those, this instruction does.

    ## You Do Not Dispatch Subagents

    Do all of this review yourself. Never spawn a subagent to review part
    of the diff, and never spawn another reviewer for a second opinion.
    This process already provides every review seat the work gets; a
    reviewer you spawn duplicates one of them at full cost, and its
    verdict counts for nothing. If the diff feels too large for one
    pass, review it in passes yourself and say so in your report.

    ## Scope

    Your scope is the findings list and the fix diff. Verdict every finding.
    Inspect the fix diff for new problems the fix itself introduced. Do NOT
    re-review code the fix did not touch: if you notice an issue entirely
    outside the fix diff, report it in `out_of_scope[]` — it does not
    block this task and does not extend the loop. A broad whole-branch
    review happens after all tasks are complete.

    ## Tests

    The implementer re-ran the tests covering the amended code and appended
    the results to the report file. Treat the report as unverified claims:
    confirm the fix report names the covering tests and shows their output,
    and verify the claims against the diff. You have no bash tool: if reading
    the code raises a specific doubt that no existing run answers, name the
    focused test you would run in that finding's evidence and verdict on
    what the diff shows — the controller runs that test before it accepts
    `all_addressed`.

    ## Output

    Your result is structured (the agent's `output:` schema), not prose.
    Yield:

    - `finding_verdicts[]`, one per finding in The Findings Under
      Verification, in order: `{finding: the one-liner, status: ADDRESSED |
      NOT_ADDRESSED, evidence: file:line}`. "Attempted" is not addressed:
      the specific defect must no longer exist.
    - `new_breakage[]`: only what the fix itself broke or introduced —
      `{severity: Critical|Important|Minor, location: file:line, body}`.
      Empty when clean.
    - `out_of_scope[]`: issues entirely outside the fix diff. Non-blocking;
      the controller ledgers these for the final review.
    - `round_verdict`: `all_addressed` (every finding ADDRESSED and no new
      Critical/Important breakage) | `findings_open` | `package_gap`.
    - `package_gap`: ONLY when you could not read the diff package at the
      path given. Then yield exactly: `round_verdict: package_gap`,
      `finding_verdicts: []`, `package_gap` = the path and the error — and
      nothing else. Never verdict findings against a package you did not
      read; the controller regenerates the package and re-dispatches.
  } ] }
```

**Placeholders:**
- `agent: sdd-rereviewer` — REQUIRED (see SKILL.md Agent Selection); a
  scoped re-review is verdict-only work over a small diff
- `[BRIEF_FILE]` — the task brief file (same file the implementer worked from)
- `[FINDINGS]` — the Critical/Important findings and spec gaps from the
  previous review, copied verbatim, one per bullet
- `[REPORT_FILE]` — the implementer's report file (fix reports appended)
- `[FIX_BASE_SHA]` — the head the previous review saw
- `[HEAD_SHA]` — current commit
- `[DIFF_FILE]` — the path `bash scripts/review-package PLAN_FILE FIX_BASE HEAD` printed

**Re-reviewer returns** (structured): `finding_verdicts[]` (ADDRESSED /
NOT_ADDRESSED with file:line), `new_breakage[]` for the fix diff only,
`out_of_scope[]`, and `round_verdict`.
