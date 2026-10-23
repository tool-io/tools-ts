# Consumer compatibility

> [!WARNING]
>
> **Alpha prerelease: not ready for production use.** Expect
> breaking changes to APIs, tool contracts, and documented
> behavior between previews.

## Requirements

- Node.js 24 or newer for Node.js applications.
- An ESM-capable bundler for browser applications.
- TypeScript 5.7.3 or newer for TypeScript consumers. JavaScript
  consumers do not need TypeScript installed.
- npm 11 or newer when installing a local archive with npm.
  Repository development uses the pnpm version pinned in
  `package.json`.

## Modules and TypeScript

Use ESM imports and public package subpaths, such as
`@tool.io/tools/body-mass-index`. The package is ESM-only. Do
not import files from `dist/` directly.

TypeScript consumers can use either `module: NodeNext` with
`moduleResolution: NodeNext`, or `module: ESNext` with
`moduleResolution: Bundler`. Legacy `node`/`node10` resolution
does not model package exports and is unsupported.

Individual tool imports keep unrelated implementations and the
catalog out of your bundle. Installing the package still
installs the full collection.

## Execution environments

Pure tools run from their input and execution context. Tools
that require a dataset, device capability, or remote service
declare those requirements; your application supplies the
normalized data or adapter results.

Alpha prerelease installation and runtime checks have focused on
Linux x64. macOS and Windows have not been verified. Browser
checks cover representative import and execution boundaries
rather than every tool in every browser.
