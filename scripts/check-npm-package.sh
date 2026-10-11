#!/usr/bin/env bash
#
# Verify the npm package this fork publishes: its name, its version scheme, the
# exact file set of the tarball, and the fork's spec and plan paths. CI runs it
# on every push; the release workflow runs it again before publishing.
#
# Usage: scripts/check-npm-package.sh
set -euo pipefail

cd "$(dirname "$0")/.."

fail() {
  echo "check-npm-package: $*" >&2
  exit 1
}

name=$(node -p "require('./package.json').name")
version=$(node -p "require('./package.json').version")
upstream=$(node -p "require('./.claude-plugin/plugin.json').version")

# Resolving an upstream sync's package.json conflict with upstream's side
# would retarget the squatted `superpowers` name on npm.
[ "$name" = "@loneexile/omp-superpowers" ] ||
  fail "name is '$name', expected '@loneexile/omp-superpowers'"

# A version is <upstream version>-omp.<n>. Its base is the obra/superpowers
# release this branch is synced to; upstream's bump-version keeps that version
# in every harness manifest, so .claude-plugin/plugin.json names it.
if [[ ! "$version" =~ ^([0-9]+\.[0-9]+\.[0-9]+)-omp\.[1-9][0-9]*$ ]]; then
  fail "version '$version' is not <upstream version>-omp.<n>"
fi
base=${BASH_REMATCH[1]}
[ "$base" = "$upstream" ] ||
  fail "version base $base is not the synced upstream $upstream (.claude-plugin/plugin.json); after a sync the version is $upstream-omp.1"

# The tarball holds exactly what omp loads (the extension, skills, agents) plus
# the docs npm always ships: nothing missing, nothing extra.
expected=$(
  {
    git ls-files .pi/extensions agents skills
    printf '%s\n' CHANGELOG.md LICENSE README.md package.json
  } | LC_ALL=C sort
)
# npm 11 prints `pack --json` as an array of results, npm 12 as an object keyed
# by package name.
actual=$(
  npm pack --dry-run --json 2>/dev/null |
    node -e '
      let s = "";
      process.stdin.on("data", (d) => { s += d; }).on("end", () => {
        const out = JSON.parse(s);
        const pkg = Array.isArray(out) ? out[0] : Object.values(out)[0];
        for (const f of pkg.files) console.log(f.path);
      });
    ' |
    LC_ALL=C sort
)
if [ "$expected" != "$actual" ]; then
  diff <(printf '%s\n' "$expected") <(printf '%s\n' "$actual") >&2 || true
  fail "tarball differs from the tracked runtime files ('<' missing, '>' unexpected)"
fi

# This fork saves specs to docs/specs/ and plans to docs/plans/; upstream uses
# docs/superpowers/. An upstream sync can bring the old path back in new or
# conflicting text, and agents follow whatever the shipped skills say.
# git grep exits 1 for no match; anything above 1 is an error, not a pass.
rc=0
stale=$(git grep -n 'docs/superpowers' -- .pi/extensions agents skills) || rc=$?
case $rc in
  0)
    printf '%s\n' "$stale" >&2
    fail "shipped files name docs/superpowers; this fork saves to docs/specs/ and docs/plans/"
    ;;
  1) ;;
  *) fail "git grep for docs/superpowers failed (exit $rc)" ;;
esac

echo "check-npm-package: $name@$version, $(printf '%s\n' "$actual" | wc -l | tr -d ' ') files"
