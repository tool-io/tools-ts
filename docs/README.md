# tools-ts documentation

Start with the [quick start](../README.md#how-to-use-it) to run
a tool, search the catalog, and build workflows.

## Using the library

- [Consumer compatibility](consumer-compatibility.md): runtimes,
  TypeScript, and module resolution.
- [Versioning and compatibility](versioning.md): prerelease
  versions and compatibility expectations.
- [Tool contracts](../contracts/README.md): machine-readable
  schemas and examples.
- [Portable value types](tool-value-type-specification.md):
  values, ports, units, and tool chaining.

## Contributing

- [Contribution guide](../CONTRIBUTING.md): setup, testing,
  reference material, and contributions from people and AI
  agents.
- [Tool authoring specification](tool-authoring-specification.md):
  source layout, contracts, execution, canonical examples, and
  tests.
- [Security policy](../SECURITY.md): private vulnerability
  reporting.

## Reference implementations

- [`body-mass-index`](../packages/tools/src/body-mass-index/tool.ts)
  uses an explicit contract.
- [`arithmetic/add-two-numbers`](../packages/tools/src/arithmetic/add-two-numbers/tool.ts)
  uses `createSimpleTool`.
