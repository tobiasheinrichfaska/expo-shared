# Briefing — next agent (qr-sync)

> Handoff note. **Your first focus: build out the test suite for `qr-sync`.** This package is the *pilot* for how shared packages in `expo-shared` get tested — get it thorough here, then the pattern propagates to future packages.

## What this package is

`@tobiasheinrichfaska/qr-sync` — a **pure-TypeScript, framework-agnostic** QR peer-to-peer data-sync engine. No React, no Expo, no native deps. Two devices sync offline by showing/scanning QR codes.

Extracted from the TKD-Coach app (its first consumer). See repo root [`expo_shared_claude.md`](../../expo_shared_claude.md) for workspace/publishing context, and [`README.md`](README.md) for the public API.

### Source map
- `src/chunks.ts` — transport: `encodeToChunks(data, chunkSize?)` / `assembleFromChunks(packets)`. Serialize → `pako` deflate → custom base64 (RN has no `atob`/`btoa`) → split into `QRChunk` JSON strings. Schema-agnostic (generic over payload).
- `src/diff.ts` — `createSyncEngine<T>({ collections })` → `exportSelected` / `detectChanges` / `applyChanges`, generalized over named `{ id }`-entity collections. Non-collection fields (e.g. `version`) are carried from local untouched.
- `src/index.ts` — public barrel.
- `src/__tests__/` — current tests (ts-jest).

## Current state (2026-05-31)

- Builds clean: `npm run build` → `dist/` (CommonJS + `.d.ts`).
- **7 tests passing** (`npm test`): encode↔assemble round-trip (incl. multi-chunk, out-of-order, tiny payload), detectChanges new/changed/unchanged, applyChanges replace+append+no-op, exportSelected.
- Consumed by TKD-Coach via a **local `file:` dependency** (no registry yet — publishing is a deliberately deferred FUTURE feature; see expo_shared_claude.md).

## Your task: expand the tests (pilot)

The existing 7 are a smoke test. Make the suite genuinely cover the engine's risk surface. Suggested coverage to add (verify/adjust against the code — don't assume):

**chunks.ts**
- [ ] Round-trip with unicode / emoji / large nested objects.
- [ ] `chunkSize` boundaries: payload exactly N×chunkSize; chunkSize larger than payload (1 chunk); very small chunkSize (many chunks).
- [ ] **Malformed input to `assembleFromChunks`**: non-JSON packet, packet missing fields, duplicate index, *missing* a chunk (gap). Decide+document intended behavior (throw? today it likely produces corrupt output — that's worth a test that pins the contract).
- [ ] base64 round-trips for byte values 0–255 and lengths mod 3 = 0/1/2 (padding correctness).
- [ ] base64 decode robustness for out-of-alphabet chars (current `indexOf` returns -1 — pin the behavior).
- [ ] `QRChunk.id`/`total`/`index` are consistent across a transfer.

**diff.ts**
- [ ] Multiple collections; a collection empty locally or empty imported.
- [ ] Items reordered but unchanged → all `unchanged` (note: detection is `JSON.stringify` equality, so key-order matters — test + document that limitation).
- [ ] `applyChanges` preserves *all* non-collection fields, not just the ones touched.
- [ ] `exportSelected` with no flags / all flags / partial; confirm unselected collections become `[]` and selected are copied.
- [ ] Type-level: `CollectionKey<T>` only admits array-of-`{id}` keys (a `// @ts-expect-error` test for a bad collection name).

**Tooling**
- [ ] Add a coverage script (`jest --coverage`) and aim for high coverage on both files.
- [ ] Consider `fast-check` (property-based) for the encode↔assemble round-trip — it's the highest-value invariant.

## Conventions & gotchas

- ts-jest, `testMatch: **/__tests__/**/*.test.ts`. Keep tests pure (no RN/Expo).
- Semantic versioning + git tags per workspace convention (see root `general_stuff_claude.md`). Bump only when publishing is enabled.
- **Don't** add React/Expo/native deps here — purity is the point (it's why it's trivially testable and reusable).
- Consumer gotcha (document, don't "fix" here): RN/Metro consumers using the local `file:` link must keep `pako` resolvable in their own tree and add the package's real path to Metro `watchFolders` (TKD-Coach does both).

## After tests: likely next steps (not your job unless asked)

- Decide a registry (public npm is the front-runner — tokenless installs) and publish `v0.1.0`; then switch TKD-Coach off the `file:` link to the published version.
- Add the mail-gateway *client* as a sibling package when that app exists.
