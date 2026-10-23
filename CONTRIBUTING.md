# Contributing to tools-ts

Thank you for improving the portable tool.io library.
Contributions should be small enough to review, independently
testable, and compatible with the public contracts used by
applications, command-line clients, and agents.

By submitting a contribution, you agree that your contribution
is provided under this repository's MIT license. Only submit
work you have the right to license, preserve required
third-party notices, and identify copied or adapted material and
its source. Public availability alone is not permission to copy.

Report vulnerabilities privately as described in
[SECURITY.md](SECURITY.md).

## Before changing a tool

Read the normative
[Tool Authoring Specification](docs/tool-authoring-specification.md)
and search the generated catalog for an existing tool, alias, or
overlapping operation. New tools require a matching directory
and ID, a default-exported definition, an independent package
subpath, one canonical example, and Vitest coverage.

Do not hand-edit generated registries, catalogs, contracts,
package exports, or public-tool lists. Run the repository
generators through the documented commands instead.

## Build from source

Repository development requires Node.js 24 or newer and pnpm 10.
The repository pins its package-manager version in
`package.json`.

```sh
git clone https://github.com/tool-io/tools-ts.git
cd tools-ts
pnpm install --frozen-lockfile
pnpm build
```

To try the package in a separate application, run
`npm pack --ignore-scripts` from `packages/tools` after
building, then install the resulting `.tgz` file. Use the
generated archive filename when installing it. You do not need
to publish a package to contribute.

## Repository layout

```text
contracts/                 language-neutral schemas
docs/                      specifications and contributor guides
fixtures/                  cross-runtime conformance fixtures
packages/tools/src/        implementations and colocated tests
scripts/                   generation and validation commands
tests/                     repository-level compatibility tests
```

## Making a change

1. Install the locked dependencies with
   `pnpm install --frozen-lockfile`.
2. Add or update the implementation and its colocated tests.
3. Run the nearest test file while iterating.
4. Regenerate derived files with `pnpm generate` when the source
   structure changes.
5. Run the checks below before opening a pull request.

```sh
pnpm check
pnpm test:unit
pnpm check:generated
pnpm validate
```

Full-collection checks can be resource intensive. Use the
provided pnpm commands, which run checks in bounded batches, and
start with the nearest colocated test while iterating.

A pull request should explain the behavior change, its
compatibility impact, the validation performed, and any source
used to verify domain behavior. Apply the
[compatibility policy](docs/versioning.md) to exported types,
tool contracts and documented behavior as well as code. New
commands or tools are features; a breaking behavioral correction
must not be hidden in a patch release. Package versions and
per-tool contract versions must both reflect their respective
compatibility rules.

## Tests and reference material

Verify expected results using an independent calculation, an
authoritative reference, or a useful invariant. A canonical
example or a round-trip test alone can miss an incorrect
implementation. Include malformed inputs and boundary cases, and
explain numerical tolerances where they apply.

Record the source, version, units, and conventions needed to
reproduce a reference result. Keep fixtures small and
deterministic. Preserve attribution and license notices for
copied or adapted material; the package's MIT license does not
relicense external datasets or provider responses.

`pnpm check:reference` runs the additional independent reference
cases, and `pnpm check:browser` checks representative browser
imports and bundle boundaries. These checks supplement
tool-specific tests; they do not certify every formula or domain
in the collection.

## Dependencies

Do not add a runtime dependency without explaining why platform
APIs and existing tool.io code are insufficient. Review the
dependency's provenance, maintainer and release history, FOSS
license, install scripts, transitive dependencies, known
vulnerabilities, and effect on individual-tool bundles.
Dependencies must be pinned through the lockfile and must not
introduce native binaries or install-time execution for ordinary
portable tools.

## Using AI assistance

Contributions from people and AI agents are welcome. AI-authored
changes follow the same licensing, testing, and review standards
as other contributions. The person submitting a contribution
remains responsible for every submitted line and claim. A coding
agent working in this repository should be instructed to:

- read this guide, the authoring specification, and the relevant
  existing tool before editing;
- preserve the package boundary, stable tool IDs, schemas,
  structured errors, and tree-shakable subpath imports;
- verify formulas, standards, units, citations, licenses, and
  examples against authoritative sources instead of inventing
  them;
- add focused tests for valid, invalid, boundary, and
  canonical-example cases;
- never weaken or delete a failing test merely to make a change
  pass;
- never edit generated artifacts directly or claim that an unrun
  command passed;
- avoid credentials, personal data, proprietary material,
  private endpoints, and unrelated repository files;
- propose new dependencies for human review before installing
  them.

Review AI-generated changes as carefully as any other
contribution. Run the same validation commands, inspect the
final diff, and disclose substantial AI assistance in the pull
request when it helps reviewers understand how the change was
produced. AI output does not replace domain, security,
licensing, or accessibility review.

## Commit and pull-request scope

Keep unrelated changes separate. Do not include local caches,
editor state, private planning notes, generated reports,
environment files, or credentials. Use clear commit messages
that describe the behavior added or corrected.
