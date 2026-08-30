import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type BomRemoverFirstBytesInput = {
  readonly bytes: ReadonlyArray<number>;
};
export type BomRemoverFirstBytesOutput = {
  readonly bytes: ReadonlyArray<number>;
  readonly removed: boolean;
};
export const bomRemoverFirstBytesInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "bytes": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 0,
        "maximum": 255
      },
      "minItems": 0,
      "maxItems": 100000,
      "description": "Byte values"
    }
  },
  "required": [
    "bytes"
  ]
} as const satisfies ToolJsonSchema;
export const bomRemoverFirstBytesOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "bytes": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 0,
        "maximum": 255
      },
      "description": "Byte values"
    },
    "removed": {
      "type": "boolean",
      "description": "Removed"
    }
  },
  "required": [
    "bytes",
    "removed"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc3629.txt
export const calculateBomRemoverFirstBytes = (rawInput: unknown): ToolResult<BomRemoverFirstBytesOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly bytes?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "bytes"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const bytesValue = candidate.bytes;
  if (!Array.isArray(bytesValue)) return issue("bytes", "invalid_type", "Enter a dense array.");
  if (bytesValue.length < 0) return issue("bytes", "out_of_range", "Too few entries.");
  if (bytesValue.length > 100000) return issue("bytes", "resource_limit", "Array exceeds the 100000-entry resource limit.");
  const validatedBytes: number[] = [];
  for (let index = 0; index < bytesValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(bytesValue, index)) return issue(`bytes.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = bytesValue[index];
    if (typeof item !== "number" || !Number.isSafeInteger(item)) return issue(`bytes.${index}`, "invalid_type", "Enter a finite safe integer.");
    if (item < 0) return issue(`bytes.${index}`, "out_of_range", "Value is outside the accepted range.");
    if (item > 255) return issue(`bytes.${index}`, "out_of_range", "Value is outside the accepted range.");
    validatedBytes.push(item);
  }
  const input: BomRemoverFirstBytesInput = { bytes: validatedBytes };
  const removed = input.bytes[0] === 239 && input.bytes[1] === 187 && input.bytes[2] === 191;
  return toolSuccess({ bytes: input.bytes.slice(removed ? 3 : 0), removed });
};
export const example = {
  input: {
    "bytes": [
      239,
      187,
      191,
      65
    ]
  },
  output: {
    "bytes": [
      65
    ],
    "removed": true
  },
} satisfies ToolExample<BomRemoverFirstBytesInput, BomRemoverFirstBytesOutput>;
export const bomRemoverFirstBytesTool = defineTool<BomRemoverFirstBytesInput, BomRemoverFirstBytesOutput>({
  id: "csv/bom-remover-first-bytes",
  title: "BOM Remover First Bytes",
  description: "Remove an initial UTF-8 EF BB BF signature from byte values and preserve every remaining byte, including interior signatures and other encoding BOMs.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: bomRemoverFirstBytesInputSchema,
  outputSchema: bomRemoverFirstBytesOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "bytes",
        "label": "Byte values",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "integer"
          }
        }
      }
    ],
    "outputs": [
      {
        "id": "bytes",
        "label": "Byte values",
        "valueType": {
          "type": "list",
          "items": {
            "type": "integer"
          }
        }
      },
      {
        "id": "removed",
        "label": "Removed",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateBomRemoverFirstBytes,
});
export const runBomRemoverFirstBytes = bomRemoverFirstBytesTool.execute;
export default bomRemoverFirstBytesTool;
