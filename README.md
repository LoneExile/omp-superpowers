# omp-superpowers

Fork of [obra/superpowers](https://github.com/obra/superpowers) with the **omp (Oh My Pi) tool-mapping fix**.

## Why this fork exists

Superpowers ships a "Pi tool mapping" that is injected into every session and asserts:

- the harness has **no subagent tool** → superpowers' parallel-dispatch and subagent-driven workflows degrade to sequential single-session work
- the harness has **no task-list tool** → work gets tracked in `TODO.md` instead of a real todo tool

Both are **false on omp**. omp ships:

- `task` — batch subagent dispatch, one call carries `{ context, tasks[] }`, run concurrently
- `todo` — task tracking (`init/start/done/rm/drop/block/unblock/append/view`)
- `read`/`grep`/`glob` as the preferred file tools (the system prompt directs away from shell `ls`/`find`/`grep`/`rg`)

The fix corrects `.pi/extensions/superpowers.ts` (the always-injected bootstrap) and `skills/using-superpowers/references/pi-tools.md`.

## Install (omp)

```bash
omp plugin install github:LoneExile/omp-superpowers
```

Pinned to a specific fix commit/branch:

```bash
omp plugin install github:LoneExile/omp-superpowers#omp-6.1.1
```

## Branches

| Branch | Contents |
|---|---|
| `main` | **the fix branch** — this is what the default install resolves; carries the omp tool-mapping fix |
| `omp-6.1.1` | pinned install target: `v6.1.1` + the fix + README (pre-merge snapshot) |
| `upstream/main` | pristine obra/superpowers, untouched |

## Maintenance

```bash
git fetch upstream && git checkout omp-6.1.1 && git rebase v6.1.1
git push --force-with-lease origin omp-6.1.1
omp plugin upgrade superpowers
```

## License

MIT, inherited from upstream. Not affiliated with obra/Prime Radiant.
