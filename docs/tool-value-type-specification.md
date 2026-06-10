# Tool.io Value Type Specification

Status: Version 1

## Purpose

The Tool.io value type describes the portable runtime representation of a
tool input or output. It is shared by TypeScript tools, web applications,
native applications, REST APIs, MCP servers, command-line clients, saved
chains, and generated catalogs.

The descriptor is advisory. It improves tool search, connector discovery,
default selection, and documentation. It MUST NOT prevent a user from
connecting any output to any input.

The descriptor is static JSON-compatible metadata. It MUST be represented as
a plain object. Implementations MUST NOT require factory or convenience
functions to construct it.

## Version 1 data model

```ts
type ToolValuePrimitive =
  | 'null'
  | 'boolean'
  | 'integer'
  | 'number'
  | 'string'
  | 'bytes'
  | 'list'
  | 'object';

type ToolValueType = {
  type: ToolValuePrimitive;
  items?: ToolValueType;
  format?: string;
  unit?: string;
};
```

`type` is the only required property.

`items` recursively describes list members. It is meaningful only when
`type` is `list`. A list without `items` has unknown or heterogeneous member
types.

`format` is an optional, open identifier describing an interpretation,
encoding, shape, or domain. Tool.io does not maintain a closed format enum.

`unit` is an optional, open identifier providing additional unit or scale
metadata. Tool.io does not maintain a closed unit enum.

Format and unit identifiers MUST be non-empty strings. Consumers MUST accept
previously unknown identifiers. Consumers SHOULD ignore properties they do
not understand so that additive revisions remain forward-compatible.

## Core carriers

### `null`

Represents the explicit JSON `null` value. It is distinct from a missing
optional property. `undefined` is not a portable Tool.io value.

### `boolean`

Represents `true` or `false`.

### `integer`

Represents an integer that can be transported without loss across supported
Tool.io surfaces. TypeScript implementations MUST initially restrict this to
JavaScript safe integers. Arbitrary-precision integers SHOULD use a string
with an explicit format until a separately versioned portable representation
is required.

```json
{ "type": "string", "format": "integer/arbitrary" }
```

### `number`

Represents a finite real number. `NaN`, positive infinity, and negative
infinity are not portable Tool.io values.

### `string`

Represents Unicode text.

### `bytes`

Represents an ordered byte sequence. In-memory representations are native to
each surface, such as `Uint8Array`, `Vec<u8>`, `ByteArray`, or `Data`.
Transport adapters define the wire encoding. JSON-based transports SHOULD
use Base64 while retaining `bytes` as the value type; Base64 text produced by
a Base64 tool remains a `string` with a Base64 format.

### `list`

Represents an ordered collection. Lists are recursive and are the only core
collection carrier required for arrays, datasets, matrices, tensors, tuples,
sets, and map-entry sequences. Additional meaning is expressed with `items`
and `format`.

### `object`

Represents a string-keyed structured object. Detailed field validation belongs
to the owning tool's runtime input and output schemas rather than this compact
descriptor.

## Examples

Plain text:

```json
{ "type": "string" }
```

Base64 text:

```json
{ "type": "string", "format": "base64" }
```

PNG bytes:

```json
{ "type": "bytes", "format": "image/png" }
```

Length in centimeters:

```json
{ "type": "number", "format": "length", "unit": "cm" }
```

Numeric dataset:

```json
{
  "type": "list",
  "items": { "type": "number" },
  "format": "dataset"
}
```

Numeric matrix:

```json
{
  "type": "list",
  "items": {
    "type": "list",
    "items": { "type": "number" }
  },
  "format": "matrix"
}
```

Resource reference:

```json
{ "type": "object", "format": "resource/reference" }
```

## Historical and fictional values

Historical, fictional, product-specific, and user-defined units are first-class
open identifiers. Adding one MUST NOT require changing this specification or
the core Tool.io packages.

```json
{
  "type": "number",
  "format": "length",
  "unit": "historical/rome/pes"
}
```

```json
{
  "type": "number",
  "format": "length",
  "unit": "fictional/star-trek/enterprise-d"
}
```

Identifiers SHOULD be namespaced when a short name is ambiguous. The owning
conversion tool remains the sole authority for definitions, factors, formulas,
uncertainty, provenance, supported identifiers, and citations. The chain
system MUST NOT maintain a duplicate unit or conversion-factor catalog.

## Relationship to web input types

The web `TypeToolInput.type` describes the UI control, such as `number`,
`text`, or `select`. It is not this portable value type. Web tools may attach
the descriptor separately:

```ts
{
  id: 'height',
  label: 'Height',
  type: 'number',
  valueType: {
    type: 'number',
    format: 'length',
    unit: 'cm'
  }
}
```

This separation allows a `select` control to produce a string, integer, or
another portable value without overloading HTML input metadata.

## Chaining rules

Any tool output MAY connect to any tool input. Primitive, format, unit, and
item metadata MUST NOT serve as an authorization or validation boundary for
creating a connection.

The chain system uses descriptors only to:

- rank possible destination tools;
- recommend explicit connector tools;
- prefill connector inputs where supported;
- explain representations and transformations;
- index tools without eagerly loading their implementations.

When no matching connector is known, the chain system MUST retain direct
connection as an option. The destination tool then applies its ordinary input
handling and returns its ordinary result or error.

Connectors are ordinary tools. A tool acts as a connector when it is placed
between two other nodes. No separate connector registry is a source of truth.

## Connector ownership and discovery

A conversion tool owns its supported formats, units, conversion data, and
behavior. For example, `convert/length` owns its factors and unit options. A
generated search index may reference that tool, but MUST NOT reproduce its
factors.

Indexes SHOULD be generated from normal tool specifications. Implementations
may maintain hash maps for:

- inputs by primitive type;
- outputs by primitive type;
- tools by exact value-type signature;
- transformations by format pair;
- converters by supported unit or format.

Index construction is linear in the indexed tool metadata. Exact lookups are
expected to be average constant time plus the cost of returning and ranking
the matching candidates.

An exact descriptor key MUST use an unambiguous canonical serialization rather
than concatenating unescaped identifiers. Version 1 uses this recursive tuple:

```ts
JSON.stringify([
  valueType.type,
  valueType.format ?? null,
  valueType.unit ?? null,
  valueType.items ? canonicalTuple(valueType.items) : null
]);
```

New, previously unknown formats and units become discoverable when a normal
tool advertises them. No core enum update is required.

## Compatibility and evolution

Tool contracts carry their own contract version. Version 1 value descriptors
therefore do not repeat a version on every recursive list item.

The eight core carriers are intended to remain stable. New domains SHOULD use
open `format` and `unit` values or recursive `list` and `object` structures
rather than adding carriers.

Consumers MUST ignore unknown additive descriptor properties. A future change
that alters the meaning of an existing property or carrier requires a new tool
contract version and an explicit migration.
