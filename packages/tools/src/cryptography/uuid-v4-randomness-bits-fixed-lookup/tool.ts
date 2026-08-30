import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type UuidV4RandomnessBitsFixedLookupInput = {
  readonly uuid: string;
};
export type UuidV4RandomnessBitsFixedLookupOutput = {
  readonly randomBits: number;
  readonly fixedBits: number;
};
export const uuidV4RandomnessBitsFixedLookupInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "uuid": {
      "type": "string",
      "maxLength": 36,
      "pattern": "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89aAbB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$(?![\\s\\S])",
      "description": "UUIDv4 text"
    }
  },
  "required": [
    "uuid"
  ]
} as const satisfies ToolJsonSchema;
export const uuidV4RandomnessBitsFixedLookupOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "randomBits": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Available random bit positions"
    },
    "fixedBits": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Version and variant bit count"
    }
  },
  "required": [
    "randomBits",
    "fixedBits"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc9562#section-5.4
export const calculateUuidV4RandomnessBitsFixedLookup = (rawInput: unknown): ToolResult<UuidV4RandomnessBitsFixedLookupOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly uuid?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "uuid"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const uuidValue = candidate.uuid;
if (typeof uuidValue !== "string") return issue("uuid", "invalid_type", "Enter a string value.");
if (uuidValue.length > 36) return issue("uuid", "resource_limit", "Text exceeds the 36-character resource limit.");
if (!(new RegExp("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89aAbB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$(?![\\s\\S])")).test(uuidValue)) return issue("uuid", "invalid_format", "Text does not match the accepted syntax.");
  const input: UuidV4RandomnessBitsFixedLookupInput = { uuid: uuidValue };
  return toolSuccess({ randomBits: 122, fixedBits: 6 });
};
export const example = {
  "input": {
    "uuid": "550e8400-e29b-41d4-a716-446655440000"
  },
  "output": {
    "randomBits": 122,
    "fixedBits": 6
  }
} satisfies ToolExample<UuidV4RandomnessBitsFixedLookupInput, UuidV4RandomnessBitsFixedLookupOutput>;
export const uuidV4RandomnessBitsFixedLookupTool = defineTool<UuidV4RandomnessBitsFixedLookupInput, UuidV4RandomnessBitsFixedLookupOutput>({
  id: "cryptography/uuid-v4-randomness-bits-fixed-lookup",
  title: "UUID v4 Fixed Randomness Bits Lookup",
  description: "Report the 122 available random bits of a UUIDv4 after validating its canonical version and variant syntax.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: uuidV4RandomnessBitsFixedLookupInputSchema,
  outputSchema: uuidV4RandomnessBitsFixedLookupOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "uuid",
        "label": "UUIDv4 text",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "randomBits",
        "label": "Available random bit positions",
        "valueType": {
          "type": "integer",
          "unit": "bit"
        }
      },
      {
        "id": "fixedBits",
        "label": "Version and variant bit count",
        "valueType": {
          "type": "integer",
          "unit": "bit"
        }
      }
    ]
  },
  execute: calculateUuidV4RandomnessBitsFixedLookup,
});
export const runUuidV4RandomnessBitsFixedLookup = uuidV4RandomnessBitsFixedLookupTool.execute;
export default uuidV4RandomnessBitsFixedLookupTool;
