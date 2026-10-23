# Tool contracts

> [!WARNING]
>
> **Alpha prerelease: not ready for production use.** Expect
> breaking changes to APIs, tool contracts, and documented
> behavior between previews.

Tool contracts provide language-neutral descriptions of tool.io
tools. The normative authoring rules live in
[`docs/tool-authoring-specification.md`](../docs/tool-authoring-specification.md).

A version 1 contract describes a stable identifier, input and
output schemas, ports, execution kind, dataset and capability
requirements, discovery metadata, and contract version.
Application permissions, platform availability, lifecycle state,
UI controls, and renderers are surface metadata and are not
currently part of the portable tool contract.

- [`tool-contract.schema.json`](tool-contract.schema.json)
  validates one serializable contract.
- [`capability-contract.schema.json`](capability-contract.schema.json)
  describes a versioned network, browser, OS, or device
  capability that app surfaces can implement independently.
- [`tool-contract-collection.schema.json`](tool-contract-collection.schema.json)
  validates the generated package collection.
- [`tool-example-collection.schema.json`](tool-example-collection.schema.json)
  validates data-only authored examples, bound to catalog and
  contract identities. The package exports this collection as
  `@tool.io/tools/examples` and its schema as
  `@tool.io/tools/examples/schema`. These exports do not load
  implementations; tool-specific input/output schemas remain
  authoritative.
- [`tool-conformance.schema.json`](tool-conformance.schema.json)
  validates portable behavioral fixtures.
- [`table-data.schema.json`](table-data.schema.json) defines the
  canonical materialized tabular value shared by converters,
  data tools, tables, charts, and dataset views.
- [`tabular-presentation.schema.json`](tabular-presentation.schema.json)
  defines portable Table and Chart specifications and normalized
  documents.
