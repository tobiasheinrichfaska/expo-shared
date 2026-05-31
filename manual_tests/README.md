# Manual Tests — expo-shared

This repo contains **libraries, not apps** — there is no UI to click through. Correctness is covered by **automated unit tests**, which are the primary validation:

```
npm test            # all packages
npm test --workspace=@tobiasheinrichfaska/qr-sync
```

A non-developer wanting to confirm a package is healthy can run the two checks below; everything else is automated.

## MT-S-1: Package builds and tests pass
**Steps:**
1. `cd c:\skripte\public\expo-shared`
2. `npm install`
3. `npm run build` — expect no errors; each package produces a `dist/` with `.js` + `.d.ts`.
4. `npm test` — expect **all suites green** (e.g. qr-sync: encode/assemble round-trip, change detection, merge).

**Expected:** Build exits 0; tests report all passing.

## MT-S-2: Consumed correctly by an app (integration smoke)
The real-world manual check lives in the **consuming app**. For `@tobiasheinrichfaska/qr-sync`, that is TKD-Coach's two-phone QR sync:
- See `c:\skripte\public\TKD-Coach\manual_tests\04_qr_transfer.md`.
- A successful round-trip there confirms `encodeToChunks` / `assembleFromChunks` / `detectChanges` / `applyChanges` work end-to-end on real devices.

> Per-package detail and the testing roadmap live in [`packages/qr-sync/BRIEFING.md`](../packages/qr-sync/BRIEFING.md).
