# CLAUDE.md — expo-shared

> Workspace-wide conventions (language, git, build, collaboration): [`c:\skripte\private\general stuff\general_stuff_claude.md`](../../private/general%20stuff/general_stuff_claude.md)

---

## Project overview

Reusable TypeScript libraries for Tobias's Expo apps, published to GitHub Packages under the `@tobiasheinrichfaska` scope.

**Platform:** library (consumed by Expo / React Native / Node apps)
**Language:** TypeScript
**Architecture:** npm package workspace (`packages/*`). Each package builds to `dist/` (CommonJS + `.d.ts`) and is unit-tested in isolation with Jest (ts-jest). Packages are framework-agnostic where possible — the SDK-54 Expo dependency baseline does **not** apply to the library code (no React/Expo deps).

### Packages
- **`@tobiasheinrichfaska/qr-sync`** — pure-TS QR peer-to-peer data-sync engine: chunked deflate/base64 encode+assemble, change detection (new/changed/unchanged), and change-applying merge. Generalized over named `{id}`-entity collections via `createSyncEngine<T>({ collections })`. Extracted from TKD-Coach (first consumer).

---

## Publishing (GitHub Packages)

- Scope `@tobiasheinrichfaska`; registry `https://npm.pkg.github.com` (see root `.npmrc` + each package's `publishConfig`).
- **Auth is required even to _install_** (GitHub Packages limitation) — consumers and CI/EAS need an `.npmrc` with `NODE_AUTH_TOKEN` (a GitHub token: `read:packages` to install, `write:packages` to publish).
- Publish a package: `cd packages/<pkg> && npm run build && npm publish` (with `NODE_AUTH_TOKEN` in env).
- Versioning: semantic (`vMAJOR.MINOR.PATCH`) per workspace convention; tag releases.

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
| `packages/qr-sync/tsconfig.json` | Build config (emits `dist/` + `.d.ts`) |
| `packages/qr-sync/jest.config.js` | ts-jest test config |
| `.gitignore` | Git ignore rules |

---

*Last updated: 2026-05-31 — initial scaffold; qr-sync engine extracted from TKD-Coach.*
