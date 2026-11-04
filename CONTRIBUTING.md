# Contributing

Thanks for helping make the generators more useful.

## Ground rules

- Keep every generator self-contained, deterministic where appropriate, and free of network, storage, and framework dependencies.
- Do not add real-person names, copyrighted lyrics, secrets, user data, or unlicensed datasets.
- Include a focused test for every behavioral change.
- Preserve the published API or document a breaking change before making it.

## Local checks

```bash
pnpm test
pnpm build
```

Please describe the generator's input, output, determinism guarantees, and any names or terms it deliberately excludes in the pull request.
