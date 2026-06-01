# CLAUDE.md — expo-shared

> Workspace-wide conventions (language, git, build, collaboration): [`c:\skripte\private\general stuff\CLAUDE.md`](../../private/general%20stuff/CLAUDE.md)

---

## Project overview

Reusable TypeScript libraries for Tobias's Expo apps, published to GitHub Packages under the `@tobiasheinrichfaska` scope.

**Platform:** library (consumed by Expo / React Native / Node apps)
**Language:** TypeScript
**Architecture:** npm package workspace (`packages/*`). Each package builds to `dist/` (CommonJS + `.d.ts`) and is unit-tested in isolation with Jest (ts-jest). Packages are framework-agnostic where possible — the SDK-54 Expo dependency baseline does **not** apply to the library code (no React/Expo deps).

### Packages
- **`@tobiasheinrichfaska/qr-sync`** — pure-TS QR peer-to-peer data-sync engine: chunked deflate/base64 encode+assemble, change detection (new/changed/unchanged), and change-applying merge. Generalized over named `{id}`-entity collections via `createSyncEngine<T>({ collections })`. Extracted from TKD-Coach (first consumer).

---

## Publishing — FUTURE FEATURE (not yet enabled)

Packages are **not published to any registry yet.** Registry choice is deliberately deferred:

- **Public npm (npmjs.org)** — likely future choice: tokenless installs *everywhere* (incl. EAS/CI); only publishing needs a token. Requires a free npm account owning the `@tobiasheinrichfaska` scope.
- **GitHub Packages** — rejected for now: requires an auth token even to *install* public packages (every consumer + EAS/CI), defeating frictionless reuse.

**For now:** consume locally via an npm `file:` dependency / workspace link. First consumer: TKD-Coach.

When publishing is enabled: build each package, add `publishConfig`/registry, `npm publish`; semantic versioning (`vMAJOR.MINOR.PATCH`) + git tags per workspace convention.

---

## Project Directory

| File/Folder | Purpose |
|---|---|
| `package.json` | Root workspace (private); `workspaces: packages/*` |
| `.npmrc` | GitHub Packages registry + token-via-env config |
| `LICENSE` / `LICENSE_COMMERCIAL.md` / `CONTRIBUTING.md` | AGPLv3 + commercial dual license |
| `packages/qr-sync/` | The QR sync engine package |
| `packages/qr-sync/src/index.ts` | Public API barrel |
| `packages/qr-sync/src/chunks.ts` | Chunked deflate/base64 encode + assemble (schema-agnostic) |
| `packages/qr-sync/src/diff.ts` | `createSyncEngine`: exportSelected / detectChanges / applyChanges |
| `packages/qr-sync/src/__tests__/` | Jest unit tests |
| `packages/qr-sync/BRIEFING.md` | Handoff note for the next agent (testing-first) |
| `packages/qr-sync/tsconfig.json` | Build config (emits `dist/` + `.d.ts`) |
| `packages/qr-sync/jest.config.js` | ts-jest test config |
| `manual_tests/` | Human-tester notes (libraries → validated by `npm test`; see README) |
| `.gitignore` | Git ignore rules |

## Manual Tests

This is a library repo (no UI) — correctness is via automated `npm test`. See [`manual_tests/README.md`](manual_tests/README.md) for the build/test smoke checks and the pointer to the real integration check in TKD-Coach.

---

*Last updated: 2026-05-31 — initial scaffold; qr-sync engine extracted from TKD-Coach.*
