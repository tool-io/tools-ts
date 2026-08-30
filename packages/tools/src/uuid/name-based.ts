import type { CHash } from "@noble/hashes/utils.js";

import { defineTool, type ToolDefinition } from "../core/definition.js";
import { utf8Encode } from "../core/encoding.js";
import type { ToolExample } from "../core/example.js";
import { invalidInput, toolSuccess } from "../core/result.js";
import { formatUuid, isRecord, parseUuidBytes } from "./shared.js";

export type NameBasedUuidInput = {
  readonly name: string;
  readonly namespace: string;
};
export type NameBasedUuidOutput = { readonly identifier: string };

type Definition = {
  readonly algorithm: CHash;
  readonly description: string;
  readonly id: string;
  readonly title: string;
  readonly version: 3 | 5;
};

export const calculateNameBasedUuid = (
  input: unknown,
  algorithm: CHash,
  version: 3 | 5,
) => {
  if (
    !isRecord(input) ||
    typeof input.name !== "string" ||
    typeof input.namespace !== "string"
  )
    return invalidInput([
      {
        code: "name_and_namespace_required",
        field: "",
        message: "Name and namespace UUID are required.",
      },
    ]);
  if (
    Object.keys(input).some(
      (field) => field !== "name" && field !== "namespace",
    )
  )
    return invalidInput([
      {
        code: "unknown_field",
        field: "",
        message: "Only name and namespace are supported.",
      },
    ]);
  const namespace = parseUuidBytes(input.namespace);
  if (!namespace)
    return invalidInput([
      {
        code: "namespace_invalid",
        field: "namespace",
        message: "Namespace must be a UUID.",
      },
    ]);
  const name = utf8Encode(input.name);
  const source = new Uint8Array(namespace.length + name.length);
  source.set(namespace);
  source.set(name, namespace.length);
  const bytes = algorithm(source).slice(0, 16);
  bytes[6] = (bytes[6]! & 0x0f) | (version << 4);
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  return toolSuccess({ identifier: formatUuid(bytes) });
};

export const createNameBasedUuidTool = (
  definition: Definition,
): ToolDefinition<NameBasedUuidInput, NameBasedUuidOutput> =>
  defineTool<NameBasedUuidInput, NameBasedUuidOutput>({
    contractVersion: 1,
    description: definition.description,
    discovery: {
      aliases: [`uuid v${definition.version}`, `uuid${definition.version}`],
      keywords: ["deterministic", "identifier", "namespace", "uuid"],
    },
    execute: (input) =>
      calculateNameBasedUuid(input, definition.algorithm, definition.version),
    execution: { kind: "pure" },
    id: definition.id,
    inputSchema: {
      additionalProperties: false,
      properties: {
        name: { type: "string" },
        namespace: { pattern: "^[0-9a-fA-F-]{36}$", type: "string" },
      },
      required: ["namespace", "name"],
      type: "object",
    },
    outputSchema: {
      additionalProperties: false,
      properties: { identifier: { format: "uuid", type: "string" } },
      required: ["identifier"],
      type: "object",
    },
    ports: {
      inputs: [
        {
          id: "namespace",
          label: "Namespace UUID",
          required: true,
          valueType: { format: "uuid", type: "string" },
        },
        {
          id: "name",
          label: "Name",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "identifier",
          label: "UUID",
          valueType: { format: "uuid", type: "string" },
        },
      ],
    },
    title: definition.title,
  });

export const createNameBasedUuidExample = (
  algorithm: CHash,
  version: 3 | 5,
): ToolExample<NameBasedUuidInput, NameBasedUuidOutput> => {
  const input = {
    name: "tool.io",
    namespace: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  };
  const result = calculateNameBasedUuid(input, algorithm, version);
  if (!result.ok) throw new Error("Canonical UUID example must be valid.");
  return { input, output: result.output };
};
