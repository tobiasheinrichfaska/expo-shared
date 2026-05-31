# expo-shared

Reusable TypeScript libraries for [Tobias Heinrich](mailto:tobias.a.w.heinrich@gmail.com)'s Expo apps.

A small package workspace. Each package is independent, framework-agnostic where possible, and published to GitHub Packages under the `@tobiasheinrichfaska` scope.

## Packages

| Package | Description |
|---|---|
| [`@tobiasheinrichfaska/qr-sync`](packages/qr-sync) | Pure-TS QR peer-to-peer data-sync engine: chunked deflate/base64 encode+assemble, change detection, and change-applying merge — generalized over named `{id}`-entity collections. First consumer: TKD-Coach. |

## Install (consumers)

Packages live on **GitHub Packages**, which requires auth even to install. Add to the consuming project's `.npmrc`:

```
@tobiasheinrichfaska:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

…with `NODE_AUTH_TOKEN` set to a GitHub token that has `read:packages` (and `write:packages` to publish). CI / EAS builds need the same token as a secret.

```bash
npm install @tobiasheinrichfaska/qr-sync
```

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
