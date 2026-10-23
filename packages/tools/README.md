# @tool.io/tools

> [!WARNING]
>
> **Alpha prerelease: not ready for production use.** Expect
> breaking changes to APIs, tool contracts, and documented
> behavior between previews.

The portable TypeScript tool library behind
[Tool.io](https://tool.io), for your apps and AI agents.

Put **over 30k tools** to work in your next project. Calculate,
convert, validate, and generate data, from a single calculation
to a whole workflow. Each tool comes with typed results, a
machine-readable contract, and an example to get you started.

Pick the tools you need. Bring your own app.

- **Independent:** each tool has its own entry point. Import one
  tool without loading the rest of the collection.
- **Portable:** framework-independent TypeScript for browser
  bundles, Node.js applications, scripts, and AI agents.
- **Tree-shakeable:** your bundler prunes unused tools and
  catalog files. Your application bundle keeps the selected tool
  and the helpers and dependencies it actually uses.

Tests cover contracts, examples, and selected independent
reference cases. Validation depth varies by tool; the collection
is not independently certified for every formula or domain.

## Get started

Follow the
[source setup guide](https://github.com/tool-io/tools-ts/blob/main/CONTRIBUTING.md#build-from-source)
to build and try the library locally.

### Requirements

- Node.js 24 or newer, or an ESM-capable browser bundler
- TypeScript 5.7.3 or newer for TypeScript consumers, with
  NodeNext or Bundler module resolution
- npm 11 or newer when installing a local archive with npm; the
  source checkout uses pnpm 10

### Run a tool

```ts
import { calculateBodyMassIndex } from "@tool.io/tools/body-mass-index";

const result = calculateBodyMassIndex({
  heightM: 1.8,
  weightKg: 70,
});

if (result.ok) {
  console.log(result.output.bmi); // TypeScript knows this is a number.
} else {
  console.error(result.error.code, result.error.issues);
}
```

TypeScript infers the output for you. Expected input errors use
the shared `ToolResult` shape.

Use the individual ESM subpath above with a tree-shaking
bundler. Package installation includes the full collection;
pruning happens when you build your application's bundle.

### Find tools and build workflows

```ts
import {
  getToolMetadata,
  searchTools,
} from "@tool.io/tools/discovery";

const median = getToolMetadata("statistics/median");
const matches = searchTools("median", { limit: 10 });
```

- `@tool.io/tools/catalog`: metadata for the full collection.
- `@tool.io/tools/contracts`: machine-readable contracts and
  ports.
- `@tool.io/tools/examples`: canonical examples as data.
- `@tool.io/tools/registry`: load a tool by its canonical ID.
- `@tool.io/tools/chain`: describe and execute workflows between
  tools.

Each tool keeps its precise input and output types. The common
`ToolDefinition<Input, Output>` and `ToolResult<Output>`
interfaces, shared ports, and portable value descriptors let
generic integrations work across tools. Dynamic chains use
contracts and runtime validation rather than requiring every
tool's TypeScript types.

Pure tools calculate from their input. Tools that need datasets,
device access, or remote services declare those requirements;
your application supplies the data or adapters. Portable
implementations do not fetch data or request permissions
themselves.

## How to contribute

A missing tool, a useful example, a bug fix, or a clearer
explanation: there is plenty to build together. **People and AI
agents are welcome to contribute.**

Start with the
[contribution guide](https://github.com/tool-io/tools-ts/blob/main/CONTRIBUTING.md)
and
[tool authoring guide](https://github.com/tool-io/tools-ts/blob/main/docs/tool-authoring-specification.md).
AI agents should follow the
[AI contribution guidance](https://github.com/tool-io/tools-ts/blob/main/CONTRIBUTING.md#using-ai-assistance);
the same tests, source checks, licensing rules, and review
standards apply.

Report bugs through
[GitHub issues](https://github.com/tool-io/tools-ts/issues) and
vulnerabilities privately through the
[security policy](https://github.com/tool-io/tools-ts/blob/main/SECURITY.md).

## Read more

- [Documentation](https://github.com/tool-io/tools-ts/blob/main/docs/README.md)
- [Portable values and tool chaining](https://github.com/tool-io/tools-ts/blob/main/docs/tool-value-type-specification.md)
- [Compatibility](https://github.com/tool-io/tools-ts/blob/main/docs/consumer-compatibility.md)
- [Versioning](https://github.com/tool-io/tools-ts/blob/main/docs/versioning.md)
- [Changelog](https://github.com/tool-io/tools-ts/blob/main/CHANGELOG.md)

## License

[MIT](https://github.com/tool-io/tools-ts/blob/main/LICENSE).
