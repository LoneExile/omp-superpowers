---
name: using-git-worktrees
description: Use when starting feature work that needs isolation from current workspace or before executing implementation plans - ensures an isolated workspace exists via native tools or git worktree fallback
---

# Using Git Worktrees

## Overview

Ensure work happens in an isolated workspace. Prefer your platform's native worktree tools. Fall back to manual git worktrees only when no native tool is available.

**Core principle:** Detect existing isolation first. Then use native tools. Then fall back to git. Never fight the harness.

**Announce at start:** "I'm using the using-git-worktrees skill to set up an isolated workspace."

## Step 0: Detect Existing Isolation

**Before creating anything, check if you are already in an isolated workspace.**

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
BRANCH=$(git branch --show-current)
```

**Submodule guard:** `GIT_DIR != GIT_COMMON` is also true inside git submodules. Before concluding "already in a worktree," verify you are not in a submodule:

```bash
# If this returns a path, you're in a submodule, not a worktree — treat as normal repo
git rev-parse --show-superproject-working-tree 2>/dev/null
```

**If `GIT_DIR != GIT_COMMON` (and not a submodule):** You are already in a linked worktree. Skip to Step 2 (Project Setup). Do NOT create another worktree.

Report with branch state:
- On a branch: "Already in isolated workspace at `<path>` on branch `<name>`."
- Detached HEAD: "Already in isolated workspace at `<path>` (detached HEAD, externally managed). Branch creation needed at finish time."

**If `GIT_DIR == GIT_COMMON` (or in a submodule):** You are in a normal repo checkout.

Has the user already indicated their worktree preference in your instructions? If not, ask for consent before creating a worktree:

> "Would you like me to set up an isolated worktree? It protects your current branch from changes."

Honor any existing declared preference without asking. If the user declines consent, work in place and skip to Step 2.

**On omp, the user has a one-line answer:** `/wt <branch>` moves *this session* into a new worktree on a new branch off `HEAD`, carrying uncommitted changes with it (clone-first, so `node_modules`/`target` come along). Only the user can run it — it is a slash command, refused while you are streaming. If they do, re-run the detection above: `GIT_DIR != GIT_COMMON` now holds, so skip to Step 2. (`worktree.cleanSource: true` additionally runs `git reset --hard` + `git clean` on the *original* checkout afterwards; it is off by default.)

## Step 1: Create Isolated Workspace

**You have two mechanisms. Try them in this order.**

### 1a. Native Worktree Tools (preferred)

The user has asked for an isolated workspace (Step 0 consent). Do you already have a way to create a worktree? It might be a tool with a name like `EnterWorktree`, `WorktreeCreate`, a `/worktree` command, or a `--worktree` flag. If you do, use it and skip to Step 2.

Native tools handle directory placement, branch creation, and cleanup automatically. Using `git worktree add` when you have a native tool creates phantom state your harness can't see or manage.

Only proceed to Step 1b if you have no native worktree tool available.

#### On omp: `omp worktree add`

omp exposes no worktree *tool* to the agent — `/wt` and `/move` are slash commands only the user can type. The native mechanism you can run is the CLI, from `bash`:

```bash
repo=$(basename "$(git rev-parse --show-toplevel)")
path=~/.omp/wt/"$BRANCH_NAME-$repo"
omp worktree add -b "$BRANCH_NAME" "$path"      # optional trailing commit-ish, default HEAD
```

Rules, each measured on omp 18.1:

- **Put it under `~/.omp/wt/`** (or the configured `worktree.base`). That is the registry `omp worktree list` / `omp worktree clear` manage; a worktree created elsewhere is a valid git worktree that omp cannot see — the phantom state this step exists to avoid. Do not use `.worktrees/` on omp.
- **It does not carry uncommitted changes.** It is clone-first (ignored build artifacts like `node_modules` come along), but a dirty tree stays behind. If the user has work in flight, either commit/stash it first or ask them to use `/wt <branch>`, which does carry it.
- **Your working directory does not follow.** `cd` in `bash` is per call, and `read`/`edit`/`glob` resolve relative paths against the *session* cwd. After creating the worktree, ask the user to run `/move <path>` so the session follows you — until then, use absolute paths for everything under the worktree.
- **Cleanup.** A finished worktree is removed with `git worktree remove <path>` from the repo — that also deletes the directory. `omp worktree clear` only sweeps *orphaned* entries (its own words: "parent repo no longer tracks this worktree"); a live worktree survives it, and `--all` also takes the user's PR checkouts. Preview with `omp worktree clear --dry-run`. Never `rm -rf` a registered worktree.

This is the whole-session layer. Per-*subagent* isolation for parallel SDD waves is a separate switch, `task.isolation.enabled` (default off) — see the subagent-driven-development skill.

Then skip to Step 2.

### 1b. Git Worktree Fallback

**Only use this if Step 1a does not apply** — you have no native worktree tool available. Create a worktree manually using git.

#### Directory Selection

Follow this priority order. Explicit user preference always beats observed filesystem state.

1. **Check your instructions for a declared worktree directory preference.** If the user has already specified one, use it without asking.

2. **Check for an existing project-local worktree directory:**
   ```bash
   ls -d .worktrees 2>/dev/null     # Preferred (hidden)
   ls -d worktrees 2>/dev/null      # Alternative
   ```
   If found, use it. If both exist, `.worktrees` wins.

3. **If there is no other guidance available**, default to `.worktrees/` at the project root.

#### Safety Verification (project-local directories only)

**MUST verify directory is ignored before creating worktree:**

```bash
git check-ignore -q .worktrees 2>/dev/null || git check-ignore -q worktrees 2>/dev/null
```

**If NOT ignored:** Add to .gitignore, commit the change, then proceed.

**Why critical:** Prevents accidentally committing worktree contents to repository.

#### Create the Worktree

```bash
# Determine path based on chosen location
path="$LOCATION/$BRANCH_NAME"

git worktree add "$path" -b "$BRANCH_NAME"
cd "$path"
```

**Sandbox fallback:** If `git worktree add` fails with a permission error (sandbox denial), tell the user the sandbox blocked worktree creation and you're working in the current directory instead. Then run setup and baseline tests in place.

## Step 2: Project Setup

Auto-detect and run appropriate setup:

```bash
# Node.js
if [ -f package.json ]; then npm install; fi

# Rust
if [ -f Cargo.toml ]; then cargo build; fi

# Python
if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
if [ -f pyproject.toml ]; then poetry install; fi

# Go
if [ -f go.mod ]; then go mod download; fi
```

## Step 3: Verify Clean Baseline

Run tests to ensure workspace starts clean:

```bash
# Use project-appropriate command
npm test / cargo test / pytest / go test ./...
```

**If tests fail:** Report failures, ask whether to proceed or investigate.

**If tests pass:** Report ready.

### Report

```
Worktree ready at <full-path>
Tests passing (<N> tests, 0 failures)
Ready to implement <feature-name>
```

## Quick Reference

| Situation | Action |
|-----------|--------|
| Already in linked worktree | Skip creation (Step 0) |
| In a submodule | Treat as normal repo (Step 0 guard) |
| Native worktree tool available | Use it (Step 1a) |
| No native tool | Git worktree fallback (Step 1b) |
| omp, user typed `/wt <branch>` | Session already moved, WIP carried — re-run Step 0, skip to Step 2 |
| omp, you create it | `omp worktree add -b <branch> ~/.omp/wt/<branch>-<repo>`; then ask for `/move <path>` |
| omp, dirty tree | Commit/stash first, or ask the user for `/wt` — `omp worktree add` leaves WIP behind |
| `.worktrees/` exists | Use it (verify ignored) |
| `worktrees/` exists | Use it (verify ignored) |
| Both exist | Use `.worktrees/` |
| Neither exists | Check instruction file, then default `.worktrees/` |
| Directory not ignored | Add to .gitignore + commit |
| Permission error on create | Sandbox fallback, work in place |
| Tests fail during baseline | Report failures + ask |
| No package.json/Cargo.toml | Skip dependency install |

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "I'm obviously not in a worktree — no need to check" | Run Step 0. Harness-created isolation and submodules both fool eyeballing; the detection commands settle it. |
| "`git worktree add` is quicker than hunting for a native tool" | A native tool (e.g. `EnterWorktree`) owns placement, branching, and cleanup. Bypassing it is the #1 mistake — it creates phantom state your harness can't see or manage. |
| "I `cd`'d into the worktree, so I'm working there now" | On omp, `cd` lasts one `bash` call and `read`/`edit`/`glob` resolve against the session cwd. You are still editing the original checkout. Ask for `/move <path>` or use absolute paths. |
| "The worktree directory is surely ignored already" | Run `git check-ignore`. An unignored worktree directory commits the whole tree into the repo. |
| "Any directory name works" | Explicit instructions beat an existing project-local directory, which beats the `.worktrees/` default. |
| "The workspace is fresh — baseline tests can wait" | A dirty baseline makes every later failure ambiguous. Run the tests now; proceeding past failures is your human partner's call. |
