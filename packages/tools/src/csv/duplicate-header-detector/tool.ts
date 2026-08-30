import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type DuplicateHeaderDetectorInput = {
  readonly headers: ReadonlyArray<string>;
};
export type DuplicateHeaderDetectorOutput = {
  readonly duplicates: ReadonlyArray<{ readonly header: string; readonly indices: ReadonlyArray<number>; }>;
};
export const duplicateHeaderDetectorInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "headers": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Headers"
    }
  },
  "required": [
    "headers"
  ]
} as const satisfies ToolJsonSchema;
export const duplicateHeaderDetectorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "duplicates": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "header": {
            "type": "string"
          },
          "indices": {
            "type": "array",
            "items": {
              "type": "integer",
              "minimum": 0
            }
          }
        },
        "required": [
          "header",
          "indices"
        ]
      },
      "description": "Duplicates"
    }
  },
  "required": [
    "duplicates"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateDuplicateHeaderDetector = (rawInput: unknown): ToolResult<DuplicateHeaderDetectorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly headers?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "headers"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const headersValue = candidate.headers;
  if (!Array.isArray(headersValue)) return issue("headers", "invalid_type", "Enter a dense array.");
  if (headersValue.length < 0) return issue("headers", "out_of_range", "Too few entries.");
  if (headersValue.length > 10000) return issue("headers", "resource_limit", "Array exceeds the 10000-entry resource limit.");
  const validatedHeaders: string[] = [];
  for (let index = 0; index < headersValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(headersValue, index)) return issue(`headers.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = headersValue[index];
    if (typeof item !== "string") return issue(`headers.${index}`, "invalid_type", "Enter a string value.");
    if (item.length > 10000) return issue(`headers.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
    validatedHeaders.push(item);
  }
  if (validatedHeaders.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("headers", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
  const input: DuplicateHeaderDetectorInput = { headers: validatedHeaders };
  const groups = new Map<string, number[]>();
  input.headers.forEach((header, index) => { const indices = groups.get(header) ?? []; indices.push(index); groups.set(header, indices); });
  return toolSuccess({ duplicates: [...groups].filter(([, indices]) => indices.length > 1).map(([header, indices]) => ({ header, indices })) });
};
export const example = {
  input: {
    "headers": [
      "id",
      "name",
      "id"
    ]
  },
  output: {
    "duplicates": [
      {
        "header": "id",
        "indices": [
          0,
          2
        ]
      }
    ]
  },
} satisfies ToolExample<DuplicateHeaderDetectorInput, DuplicateHeaderDetectorOutput>;
export const duplicateHeaderDetectorTool = defineTool<DuplicateHeaderDetectorInput, DuplicateHeaderDetectorOutput>({
  id: "csv/duplicate-header-detector",
  title: "Duplicate Header Detector",
  description: "Find exact case-sensitive duplicate header names with all zero-based positions, without trimming or changing header text.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: duplicateHeaderDetectorInputSchema,
  outputSchema: duplicateHeaderDetectorOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "headers",
        "label": "Headers",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      }
    ],
    "outputs": [
      {
        "id": "duplicates",
        "label": "Duplicates",
        "valueType": {
          "type": "list",
          "items": {
            "type": "object"
          }
        }
      }
    ]
  },
  execute: calculateDuplicateHeaderDetector,
});
export const runDuplicateHeaderDetector = duplicateHeaderDetectorTool.execute;
export default duplicateHeaderDetectorTool;
