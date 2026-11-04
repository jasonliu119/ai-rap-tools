# AI Rap Tools

Small, dependency-free TypeScript generators used by [AI Rap Generators](https://airapgenerators.com). They run locally in the browser or on a server: no database, API key, analytics, or network request is required.

## Included tools

- `rap-name` — produces a finite, filterable pool of original rap-name ideas, then optionally shuffles it.
- `wu-tang-name` — produces a deterministic Wu-Tang-style alias and interpretation from a name and style.

The repository contains only the portable generator logic. It intentionally excludes the production site's UI, user accounts, billing, analytics, deployment configuration, and proprietary application framework.

## Install

```bash
pnpm add @airapgenerators/tools
```

Until the package is published, use a GitHub dependency or copy the package into a workspace:

```bash
pnpm add github:YOUR_GITHUB_HANDLE/ai-rap-tools
```

## Usage

```ts
import {
  generateWuTangName,
  shuffledRapNames,
  takeRapNameBatch,
} from '@airapgenerators/tools';

const name = generateWuTangName('Maya', 'classic');
// { name: '...', interpretation: '...', style: 'classic' }

const pool = shuffledRapNames({
  style: 'boom-bap',
  form: 'mixed',
  mustInclude: 'Maya',
  noNumbers: true,
});
const suggestions = takeRapNameBatch(pool, 12);
```

### Stable Wu-Tang-style results

`generateWuTangName(input, style)` is deterministic. The same normalized input and style always return the same value, making it suitable for share links and repeat visits without persistence.

```ts
import { generateWuTangName } from '@airapgenerators/tools/wu-tang-name';

const result = generateWuTangName('Ace', 'street');
```

This is an unofficial fan-made creative tool. It is not affiliated with, endorsed by, or connected to Wu-Tang Clan or its members. It intentionally excludes member names, but generated names are not guaranteed to be available as artist names, domains, social handles, or trademarks.

## Add a tool

1. Create `src/tools/<tool-id>.ts`. Keep it deterministic where possible, with no browser-only globals or network calls.
2. Export the public input/result types and functions from `src/index.ts`.
3. Add the subpath to `package.json` `exports` if consumers should be able to import it directly.
4. Add a `ToolDefinition` entry in `src/registry.ts`.
5. Add a focused test under `tests/`.
6. Run `pnpm test && pnpm build`.

Do not add credentials, production configuration, user data, or copied code from a framework whose license disallows redistribution.

## Development

```bash
pnpm install
pnpm test
pnpm build
```

The build writes ESM JavaScript and TypeScript declarations to `dist/`. `dist/` is deliberately not committed.

## Publish to npm (optional)

The package is preconfigured for public npm publishing:

```bash
pnpm install
pnpm test
pnpm build
pnpm login
pnpm publish --access public
```

Before publishing, change the `name` field in `package.json` if `@airapgenerators` is not your npm scope.

## License

[MIT](./LICENSE). “Wu-Tang Clan” and associated member names are trademarks or names of their respective owners; no trademark rights are granted by this repository.
