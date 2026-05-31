# expo-shared

Reusable TypeScript libraries for [Tobias Heinrich](mailto:tobias.a.w.heinrich@gmail.com)'s Expo apps.

A small package workspace. Each package is independent, framework-agnostic where possible, and published to GitHub Packages under the `@tobiasheinrichfaska` scope.

## Packages

| Package | Description |
|---|---|
| [`@tobiasheinrichfaska/qr-sync`](packages/qr-sync) | Pure-TS QR peer-to-peer data-sync engine: chunked deflate/base64 encode+assemble, change detection, and change-applying merge — generalized over named `{id}`-entity collections. First consumer: TKD-Coach. |

## Install (consumers)

> **Publishing is a future feature — packages are not on any registry yet.** Registry choice (public npm vs GitHub Packages) is deferred; see [`expo_shared_claude.md`](expo_shared_claude.md).

For now, consume **locally** via an npm `file:` dependency (or workspace link):

```jsonc
// consuming app's package.json
"dependencies": {
  "@tobiasheinrichfaska/qr-sync": "file:../relative/path/to/expo-shared/packages/qr-sync"
}
```

The package ships built JS + types in `dist/` (run `npm run build` in the package first).

## Develop

```bash
npm install        # installs all workspaces
npm test           # runs each package's tests
npm run build      # builds each package to dist/
```

## License

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

This project is licensed under the **GNU Affero General Public License v3.0** (AGPLv3).
You are free to use, modify, and distribute this software under the terms of the AGPLv3.
If you use this software to provide a network service, you must make the full source code
of your modifications available to users of that service.

**Commercial License:** If you wish to use this software in a closed-source or proprietary
product, a commercial license is available. Contact: tobias.a.w.heinrich@gmail.com

See [LICENSE](LICENSE) for the full AGPLv3 text.
See [LICENSE_COMMERCIAL.md](LICENSE_COMMERCIAL.md) for commercial licensing terms.
