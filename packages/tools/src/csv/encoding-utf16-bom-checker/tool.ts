import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type EncodingUtf16BomCheckerInput = {
  readonly bytes: ReadonlyArray<number>;
};
export type EncodingUtf16BomCheckerOutput = {
  readonly encodingHint: "utf16-le" | "utf16-be" | "utf32-le" | "utf32-be" | "unknown";
  readonly ambiguous: boolean;
};
export const encodingUtf16BomCheckerInputSchema = {
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
      "description": "Bytes"
    }
  },
  "required": [
    "bytes"
  ]
} as const satisfies ToolJsonSchema;
export const encodingUtf16BomCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "encodingHint": {
      "type": "string",
      "enum": [
        "utf16-le",
        "utf16-be",
        "utf32-le",
        "utf32-be",
        "unknown"
      ],
      "description": "Encoding hint"
    },
    "ambiguous": {
      "type": "boolean",
      "description": "Prefix can have multiple interpretations"
    }
  },
  "required": [
    "encodingHint",
    "ambiguous"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.unicode.org/faq/utf_bom.html
export const calculateEncodingUtf16BomChecker = (rawInput: unknown): ToolResult<EncodingUtf16BomCheckerOutput> => {
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
  const input: EncodingUtf16BomCheckerInput = { bytes: validatedBytes };
  const b = input.bytes;
  const encoding = b[0] === 255 && b[1] === 254 && b[2] === 0 && b[3] === 0 ? "utf32-le" : b[0] === 0 && b[1] === 0 && b[2] === 254 && b[3] === 255 ? "utf32-be" : b[0] === 255 && b[1] === 254 ? "utf16-le" : b[0] === 254 && b[1] === 255 ? "utf16-be" : "unknown";
  return toolSuccess({ encodingHint: encoding, ambiguous: encoding === "utf32-le" });
};
export const example = {
  input: {
    "bytes": [
      255,
      254,
      65,
      0
    ]
  },
  output: {
    "encodingHint": "utf16-le",
    "ambiguous": false
  },
} satisfies ToolExample<EncodingUtf16BomCheckerInput, EncodingUtf16BomCheckerOutput>;
export const encodingUtf16BomCheckerTool = defineTool<EncodingUtf16BomCheckerInput, EncodingUtf16BomCheckerOutput>({
  id: "csv/encoding-utf16-bom-checker",
  title: "UTF-16 BOM Encoding Check",
  description: "Match initial UTF-16 and UTF-32 BOM byte prefixes as encoding hints, preferring the longest signature; FF FE 00 00 remains ambiguous with UTF-16 LE followed by NUL.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: encodingUtf16BomCheckerInputSchema,
  outputSchema: encodingUtf16BomCheckerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "bytes",
        "label": "Bytes",
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
        "id": "encodingHint",
        "label": "Encoding hint",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "ambiguous",
        "label": "Prefix can have multiple interpretations",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateEncodingUtf16BomChecker,
});
export const runEncodingUtf16BomChecker = encodingUtf16BomCheckerTool.execute;
export default encodingUtf16BomCheckerTool;
