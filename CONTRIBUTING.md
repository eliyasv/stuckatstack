# Development and change workflow

## Runtime and local checks

Use Node.js 24 (see `.nvmrc`). If you use nvm, run `nvm install` and `nvm use`.
Run `npm ci` after changing Node versions: `better-sqlite3` is a native module
and must match the runtime used by the app.

```sh
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm run test:production
```

`npm test` exercises the public `POST /api/recommend` endpoint on an isolated
development server. `npm run test:production` exercises the same contract on an
isolated copy of the built standalone server; run `npm run build` first. Both
commands isolate SQLite files and generated caches from the working tree and
stop their test server when finished. These are endpoint integration tests,
not browser tests or comprehensive recommendation-quality tests.

Development and production builds explicitly use Webpack, preserving the
existing bundler while upgrading Next.js. Moving to Turbopack is separate work.
Lint runs through the ESLint CLI because Next.js 16 removed `next lint`.
The existing result page's mount-only storage hydration has a documented,
file-scoped exception to the new `set-state-in-effect` rule; result-loading
and recovery improvements are not part of this dependency migration.

## Branching strategy

Use a lightweight, main-based workflow rather than a long-lived develop branch:

1. Start a short-lived `fix/<topic>` or `feat/<topic>` branch from the agreed,
   up-to-date `main` base. Check for existing changes before switching branches.
2. Keep unrelated fixes in separate commits. Do not put runtime database files,
   generated builds, credentials, or local environment files in commits.
3. Run the checks above and review the diff before committing.
4. Push the branch and open a PR only when authorized. CI validates PRs;
   publishing remains restricted to pushes to `main`.
5. Merge only after review and passing CI. Branch protection requiring those
   checks is recommended but must be configured separately on GitHub.

The initial reliability work uses `fix/request-validation-and-dependencies`.
Request validation and dependency migration are separate commits. Do not merge
or push automatically merely because local checks pass.

## Security checks and known tooling limitations

```sh
npm audit --omit=dev
npm audit --audit-level=high
```

CI blocks high/critical dependency findings and fixable high/critical Trivy
filesystem findings. The workflow does not yet scan the built container image;
that remains separate deployment-hardening work.

At the dependency migration, the production dependency audit reports zero
vulnerabilities. The full audit reports eight moderate affected development
packages, all propagated from the `minimatch` advisory GHSA-g3hv-75wg-m249
through the TypeScript ESLint dependency chain. Recheck the live audit rather
than treating these counts as permanent. The CI threshold intentionally allows
moderate findings; do not suppress them or run `npm audit fix --force` blindly.

ESLint 9 is retained for compatibility with the React, import, and accessibility
plugins bundled by `eslint-config-next`: their declared peer ranges do not yet
support ESLint 10. ESLint 9 is deprecated, so revisit the lint dependency tree
when compatible plugin releases are available. A forced ESLint 10 installation
currently introduces invalid peer dependencies; a forced minimatch major
override would bypass the upstream compatibility range.
