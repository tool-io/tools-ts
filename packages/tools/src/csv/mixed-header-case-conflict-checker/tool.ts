import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type MixedHeaderCaseConflictCheckerInput = {
  readonly headers: ReadonlyArray<string>;
};
export type MixedHeaderCaseConflictCheckerOutput = {
  readonly conflicts: ReadonlyArray<{ readonly folded: string; readonly indices: ReadonlyArray<number>; }>;
};
export const mixedHeaderCaseConflictCheckerInputSchema = {
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
export const mixedHeaderCaseConflictCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "conflicts": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "folded": {
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
          "folded",
          "indices"
        ]
      },
      "description": "Conflicts"
    }
  },
  "required": [
    "conflicts"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateMixedHeaderCaseConflictChecker = (rawInput: unknown): ToolResult<MixedHeaderCaseConflictCheckerOutput> => {
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
  const input: MixedHeaderCaseConflictCheckerInput = { headers: validatedHeaders };
  const groups = new Map<string, number[]>();
  input.headers.forEach((header, index) => { const key = header.toLowerCase(); const indices = groups.get(key) ?? []; indices.push(index); groups.set(key, indices); });
  return toolSuccess({ conflicts: [...groups].filter(([, indices]) => indices.length > 1).map(([folded, indices]) => ({ folded, indices })) });
};
export const example = {
  input: {
    "headers": [
      "Name",
      "age",
      "name"
    ]
  },
  output: {
    "conflicts": [
      {
        "folded": "name",
        "indices": [
          0,
          2
        ]
      }
    ]
  },
} satisfies ToolExample<MixedHeaderCaseConflictCheckerInput, MixedHeaderCaseConflictCheckerOutput>;
export const mixedHeaderCaseConflictCheckerTool = defineTool<MixedHeaderCaseConflictCheckerInput, MixedHeaderCaseConflictCheckerOutput>({
  id: "csv/mixed-header-case-conflict-checker",
  title: "Mixed Header Case Conflict Check",
  description: "Find header groups that collide after locale-independent lowercase conversion; preserve original spelling and report zero-based indices.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: mixedHeaderCaseConflictCheckerInputSchema,
  outputSchema: mixedHeaderCaseConflictCheckerOutputSchema,
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
        "id": "conflicts",
        "label": "Conflicts",
        "valueType": {
          "type": "list",
          "items": {
            "type": "object"
          }
        }
      }
    ]
  },
  execute: calculateMixedHeaderCaseConflictChecker,
});
export const runMixedHeaderCaseConflictChecker = mixedHeaderCaseConflictCheckerTool.execute;
export default mixedHeaderCaseConflictCheckerTool;
