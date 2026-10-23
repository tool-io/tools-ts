# Changelog

## 0.1.0-alpha.1 — Unreleased

An early source preview of the portable TypeScript tool library
behind Tool.io. The npm package has not been published. The API
will change, including breaking changes.

- Over 30k independently importable tools with typed results,
  portable contracts, structured errors, and canonical examples.
- Catalog, contract, and example exports for applications and AI
  agents.
- Discovery search with lazy indexes and executable tools loaded
  by canonical ID.
- ESM imports for Node.js and browser bundlers, with individual
  tool subpaths for tree-shaking.
- Node.js 24 or newer and TypeScript 5.7.3 or newer for
  TypeScript consumers. Installing a local archive with npm
  requires npm 11 or newer.

Validation covers contracts, examples, tool-specific tests, and
selected independent reference cases. Coverage depth varies by
tool; passing checks do not establish independent correctness
for every formula or domain.

Tools that need external datasets, devices, or services require
data or adapter results from the consuming application. The
library does not acquire datasets or request application
permissions.
