# Source provenance

- Personal fork: https://github.com/YarikMix/omp-superpowers
- Package: `@yarikmix/omp-superpowers`, starting at `7.0.2-omp.4`.
- Direct base: https://github.com/LoneExile/omp-superpowers at commit [`fad5b9e7ec578fbac11c7dbe1b251ceb1d7f19a9`](https://github.com/LoneExile/omp-superpowers/commit/fad5b9e7ec578fbac11c7dbe1b251ceb1d7f19a9), version `7.0.2-omp.3`.
- Original project: https://github.com/obra/superpowers, upstream release `v7.0.2` as recorded by the direct base.

The original MIT license and copyright notice remain in [LICENSE](LICENSE). Historical fork entries remain in [CHANGELOG.md](CHANGELOG.md). This personal fork is not an official obra / Prime Radiant or LoneExile release.

The personal package ships the repository layout directly: fourteen complete Superpowers skills, five SDD agents, the Pi extension and the native omp manifest. It deliberately removes only `skills/receiving-code-review/`; `@omp-utils/code-review` is the sole receiving skill owner. No external owned skill or official vendor is modified by this source change.

Install approved immutable commits from the personal GitHub repository. Release automation validates the package but does not publish to npm. Preserve this provenance, package identity and receiving exclusion when adopting upstream changes.
