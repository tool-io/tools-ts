import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type Utf8BomDetectorInput = {
  readonly bytes: ReadonlyArray<number>;
};
export type Utf8BomDetectorOutput = {
  readonly hasBom: boolean;
};
export const utf8BomDetectorInputSchema = {
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
export const utf8BomDetectorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "hasBom": {
      "type": "boolean",
      "description": "Has bom"
    }
  },
  "required": [
    "hasBom"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc3629.txt
export const calculateUtf8BomDetector = (rawInput: unknown): ToolResult<Utf8BomDetectorOutput> => {
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
  const input: Utf8BomDetectorInput = { bytes: validatedBytes };
  return toolSuccess({ hasBom: input.bytes[0] === 239 && input.bytes[1] === 187 && input.bytes[2] === 191 });
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
    "hasBom": true
  },
} satisfies ToolExample<Utf8BomDetectorInput, Utf8BomDetectorOutput>;
export const utf8BomDetectorTool = defineTool<Utf8BomDetectorInput, Utf8BomDetectorOutput>({
  id: "csv/utf8-bom-detector",
  title: "UTF-8 BOM Detector",
  description: "Detect only an initial EF BB BF byte sequence; the rest of the input is not decoded or validated as UTF-8.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: utf8BomDetectorInputSchema,
  outputSchema: utf8BomDetectorOutputSchema,
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
        "id": "hasBom",
        "label": "Has bom",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateUtf8BomDetector,
});
export const runUtf8BomDetector = utf8BomDetectorTool.execute;
export default utf8BomDetectorTool;
