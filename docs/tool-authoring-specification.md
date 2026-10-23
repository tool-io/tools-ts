# tool.io TypeScript Tool Authoring Specification

> [!WARNING]
>
> **Alpha prerelease: not ready for production use.** Expect
> breaking changes to APIs, tool contracts, and documented
> behavior between previews.

Status: Version 1

This document is the normative entry point for adding a public
tool to `@tool.io/tools`. The words **MUST**, **MUST NOT**,
**SHOULD**, and **MAY** are requirements with their usual
standards meaning.

## Package boundary

`tools-ts` owns portable contracts and framework-independent
TypeScript implementations. It MUST NOT own Svelte components,
page layouts, browser storage, provider authentication, user
data, or application routing.

Small, rarely changing reference data MAY accompany a tool when
its license permits distribution with the package. Larger or
independently updated datasets and provider responses MUST be
supplied by the consuming application. Preserve their source and
license metadata. Application UI, localized content,
authentication, permissions, caching, and resource access belong
to the consuming application.

## Required public source layout

The canonical tool ID and its directory path MUST match exactly:

```text
packages/tools/src/<tool-id>/
├── tool.ts
├── index.ts
└── tool.spec.ts
```

Nested IDs use nested directories, for example
`statistics/standard-deviation`. `tool.ts` MUST default-export
its executable definition. `index.ts` MUST re-export that
default and the independently useful calculation, types,
schemas, and canonical example.

A generated family of declarative wrappers MAY use one
family-level test when that test enumerates every public wrapper
and verifies its contract and behavior. New tools otherwise MUST
have a colocated `tool.spec.ts`.

Do not add a hand-maintained root export or registry entry.
Package exports, the registry, catalogs, and contract artifacts
are generated from public `tool.ts` files.

## Identifiers and user-facing metadata

- `id` MUST use lowercase kebab-case path segments.
- A published ID is stable. Renaming or changing its meaning is
  a breaking change.
- `title` and the short `description` MUST use clear US English
  unless the tool is explicitly language- or country-specific.
- `description` explains the operation in one concise sentence.
  Long-form SEO, tutorial, citation, and localized content
  belongs to an application or data content layer.
- `discovery.aliases` MAY contain common abbreviations,
  international terms, and alternate spellings.
- Discovery lists MUST NOT be used as a second registry or as an
  authorization boundary.

Before creating an ID, search the generated catalog and existing
package exports for an existing tool, alias, or overlapping
operation.

## Portable contract and executable definition

`ToolContract` is the JSON-compatible, language-neutral source
of truth for a tool's metadata. `ToolDefinition` adds the
TypeScript executor:

```ts
type ToolDefinition<Input, Output> = ToolContract & {
  execute(
    input: unknown,
    context?: ToolExecutionContext,
  ): ToolResult<Output>;
};
```

The canonical type is defined in
`packages/tools/src/core/definition.ts`. Its machine-readable
representation is `contracts/tool-contract.schema.json`. The
generated `packages/tools/contracts.generated.json` publishes
every contract without executable code.

The lightweight catalog is for discovery. The full contract
collection is for REST, MCP, CLI, native bindings, validation,
and code generation.

## Runtime schemas

`inputSchema` and `outputSchema` use the deliberately small
`ToolJsonSchema` subset, not arbitrary JSON Schema. Supported
keywords are:

```text
additionalProperties, anyOf, const, default, description, enum,
exclusiveMaximum, exclusiveMinimum, items, maximum, maxItems, maxLength,
minimum, minItems, minLength, pattern, properties, required, type
```

Supported types are `array`, `boolean`, `integer`, `null`,
`number`, `object`, and `string`.

- Every schema MUST declare `type`, `anyOf`, `const`, or `enum`.
- Array schemas MUST declare `items`.
- Object schemas MUST state `additionalProperties` explicitly.
- Every required property MUST also exist in `properties`.
- Runtime input validation MUST agree with `inputSchema`.
- Successful output MUST agree with `outputSchema`.
- An explicitly optional output field (`required: false`) may be
  omitted, but any present value MUST still validate. An output
  default does not make a required field optional, and
  explicitly returning `undefined` is invalid.
- Known nested output structures MUST declare their properties
  and item types, rather than using an unqualified open object.
  `createSimpleTool` object fields support an explicit `schema`,
  which is published and enforced at execution. Preserve
  concrete output types through shared helpers. Do not infer a
  full contract from a single example, especially for nullable
  or conditional fields.
- `undefined`, `NaN`, and infinities are not portable values.
- Safe integers use `integer`. Larger integers use a string and
  an explicit format.

This subset keeps contracts portable across TypeScript, JSON,
Kotlin, Swift, Rust, REST, MCP, and CLI implementations without
requiring a runtime schema package in the calculation library.

## Ports and value types

Every public input and output intended for chaining MUST have a
port. A port:

- has a lower-camel-case `id`;
- maps to a real schema property through `path`, defaulting to
  `[id]`;
- MAY use `path: []` when the port intentionally represents the
  complete input or output object;
- has a concise human-readable label;
- declares one portable `valueType`;
- marks an input `required` only when the entire schema path is
  required.

Value types follow the separate
[tool.io Value Type Specification](tool-value-type-specification.md).
`format` and `unit` are open metadata used for discovery and
connector ranking. They do not prevent arbitrary tool
connections and MUST NOT duplicate conversion tables owned by
converter tools.

## Execution and results

Version 1 executors are synchronous. Applications MAY perform
asynchronous data or capability acquisition before calling a
portable calculation.

Expected invalid input MUST return `ToolResult` with
`ok: false`; it MUST NOT throw and MUST NOT return `undefined`.
Unexpected programming failures MAY throw so they are not
misreported as user input errors.

Stable error and issue codes are machine-facing identifiers.
Messages are concise default English text and MAY be replaced by
localized surface text. Field paths MUST identify the failing
input when possible.

Execution kinds mean:

- `pure`: deterministic from input and injected context, with no
  datasets or capabilities;
- `data`: calculation requires a declared, normalized dataset
  supplied by the caller;
- `device`: execution requires a declared platform capability;
- `remote`: execution depends on a remote service or provider
  adapter.

Device and remote tools MUST declare every external requirement
as a versioned capability object:

```ts
execution: {
  kind: "device",
  capabilities: [
    {
      id: "device/sensors/enumerate",
      required: true,
      schemaVersion: 1,
    },
  ],
}
```

Capability IDs are open, lowercase, slash-separated identifiers.
The schema version identifies the request and response contract,
not a particular Android, iOS, browser, or desktop
implementation. `required: false` means that execution can still
produce a useful result when the capability is absent.

Device and remote tools MUST NOT call browser, Node, network, or
native APIs from the portable calculation. Version 1
applications acquire a capability result through a surface
adapter, normalize it according to the capability contract, and
pass that normalized value into the synchronous portable
calculation. Streaming sessions remain surface-owned until a
portable session contract is standardized.

Time and randomness MUST come from explicit input or
`ToolExecutionContext`. Long-running tools SHOULD use execution
checkpoints, cancellation, progress, and the shared resource
limits.

## Capability-backed tools

A capability-backed tool is a portable orchestration contract,
not a bundled platform implementation. It SHOULD be separated
into narrow reusable layers:

1. a capability contract under `contracts/capabilities/`;
2. a portable calculation or normalizer in tools-ts;
3. one adapter per supported app surface;
4. an application renderer and permission flow.

For example, a public-IP tool uses `network/public-ip` to
acquire the caller's address, then delegates address validation
and classification to a pure network tool. A sensor-inventory
tool uses `device/sensors/enumerate` and optionally
`device/sensors/read`, while Android, iOS, watchOS, browser,
extension, and Tauri adapters obtain those values differently.

Do not create separate portable tools named after `smartphone`,
`desktop`, or `smartwatch` when they perform the same semantic
operation. Declare one tool and let surface capability support
determine availability. Create a separate tool only when its
inputs, outputs, or operation genuinely differ.

Every capability contract MUST define:

- stable ID and positive schema version;
- snapshot or streaming mode;
- JSON-portable request and response schemas;
- public, personal, or sensitive data classification;
- normalized units and timestamps where applicable;
- stable failure semantics documented for adapters.

Surface adapters own browser permission prompts, extension
manifests, Android permissions, Apple usage descriptions and
entitlements, Tauri capabilities, and OS-specific fallbacks.
They MUST request the least privilege needed, MUST NOT collect
data before the user invokes the tool unless the surface clearly
documents that behavior, and MUST distinguish these failures:

- `capability_unavailable`;
- `capability_not_supported`;
- `permission_required`;
- `permission_denied`;
- `provider_unavailable`;
- `provider_failed`;
- `offline`;
- `aborted`.

Unit tests use deterministic fake adapter results. They MUST NOT
access a live network, camera, microphone, location, sensor,
file system, or clipboard. A canonical example SHOULD include a
stable normalized capability result so CLI, REST, MCP, and UI
surfaces can render useful documentation without hardware.

## Canonical example

Every new public tool MUST export exactly one canonical
`example` from its package subpath. The example is separate from
ports and schemas so consumers may tree-shake it.

```ts
export const example = {
  input: { values: [1, 2, 3] },
  output: { sum: 6 },
} satisfies ToolExample<Input, Output>;
```

- Input and output MUST survive a JSON round trip unchanged.
- Input MUST execute successfully.
- A deterministic tool MUST include its exact expected output.
- A context-sensitive tool MAY omit output only when a
  deterministic seed, clock, fixture, or normalized input cannot
  reasonably make it stable.
- Examples are user-facing and SHOULD be small, recognizable,
  and useful for form prefilling, help text, docs, REST
  examples, MCP examples, and CLI help.

A compatibility exception in an earlier package revision is not
precedent for new tools.

## Tests and conformance

Every new calculation MUST have Vitest coverage for:

- the canonical example;
- representative valid inputs;
- missing, malformed, and non-finite inputs where applicable;
- mathematical or domain boundaries;
- stable structured errors;
- deterministic injected time or randomness where applicable;
- behavior delegated to another tool.

Cross-language behavior SHOULD also be expressed as a fixture
conforming to `contracts/tool-conformance.schema.json` when
another runtime will implement the tool.

Run before review:

```sh
pnpm check
pnpm test:unit
pnpm check:generated
pnpm validate
```

Generated files MUST be regenerated through repository commands
and MUST NOT be edited by hand.

## Dependencies and portability

- Import individual tools through their package subpaths.
- Tool modules MUST remain side-effect free and tree-shakeable.
- Core tools MUST NOT import Svelte or application code.
- Prefer tool.io-owned TypeScript and platform standard
  libraries.
- A new runtime dependency requires an explicit need, FOSS
  license review, provenance review, and bundle-size review.
- Do not introduce native binaries or install-time scripts for
  ordinary pure tools.

## Data-backed tools

A data-backed tool MUST declare each dataset by stable ID and
data schema version. It receives normalized data; it MUST NOT
call `fetch`, IndexedDB, SQLite, provider SDKs, or application
caches itself.

Dataset metadata SHOULD identify its version, schema, integrity,
provenance, and license. The consuming application acquires
frequently changing data through a provider adapter and handles
caching and availability.

## Contract evolution

- Additive documentation and discovery changes do not require a
  contract version change.
- A change to input/output meaning, schema, ports, units, result
  semantics, or stable errors requires review and normally
  increments `contractVersion`.
- Removing or changing a published package subpath is a breaking
  package release.
- Consumers MUST ignore unknown additive metadata properties.

## New-tool acceptance checklist

- [ ] Existing tools, aliases, overlaps, and datasets were
      searched.
- [ ] Directory, ID, and package subpath match.
- [ ] Calculation is framework-independent and side-effect free.
- [ ] Input and output schemas are complete.
- [ ] Ports resolve to schemas and use portable value types.
- [ ] Expected failures return structured errors and never
      `undefined`.
- [ ] Exactly one JSON-portable canonical example is exported.
- [ ] Vitest covers examples, invalid input, and boundaries.
- [ ] Data and capability requirements are declared and owned
      elsewhere.
- [ ] Capability requirements use versioned objects and have
      matching contracts.
- [ ] Device/network access is implemented by surface adapters,
      not imported by the tool.
- [ ] Capability tests use deterministic fixtures and cover
      unavailable/denied states.
- [ ] New data has provenance, license, version, and integrity
      metadata.
- [ ] No application UI or provider access leaked into the tool.
- [ ] Check, unit tests, generated checks, and validation pass.
