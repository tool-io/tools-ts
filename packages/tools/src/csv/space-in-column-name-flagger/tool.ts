import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type SpaceInColumnNameFlaggerInput = {
  readonly headers: ReadonlyArray<string>;
};
export type SpaceInColumnNameFlaggerOutput = {
  readonly indices: ReadonlyArray<number>;
};
export const spaceInColumnNameFlaggerInputSchema = {
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
export const spaceInColumnNameFlaggerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "indices": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 0
      },
      "description": "Indices"
    }
  },
  "required": [
    "indices"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateSpaceInColumnNameFlagger = (rawInput: unknown): ToolResult<SpaceInColumnNameFlaggerOutput> => {
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
  const input: SpaceInColumnNameFlaggerInput = { headers: validatedHeaders };
  return toolSuccess({ indices: input.headers.flatMap((header, index) => header.includes(" ") ? [index] : []) });
};
export const example = {
  input: {
    "headers": [
      "first name",
      "last_name",
      "zip code"
    ]
  },
  output: {
    "indices": [
      0,
      2
    ]
  },
} satisfies ToolExample<SpaceInColumnNameFlaggerInput, SpaceInColumnNameFlaggerOutput>;
export const spaceInColumnNameFlaggerTool = defineTool<SpaceInColumnNameFlaggerInput, SpaceInColumnNameFlaggerOutput>({
  id: "csv/space-in-column-name-flagger",
  title: "Space-In-Column-Name Flagger",
  description: "Find header indices containing ASCII space U+0020 without changing the names; tabs and other Unicode whitespace are separate characters.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: spaceInColumnNameFlaggerInputSchema,
  outputSchema: spaceInColumnNameFlaggerOutputSchema,
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
        "id": "indices",
        "label": "Indices",
        "valueType": {
          "type": "list",
          "items": {
            "type": "integer"
          }
        }
      }
    ]
  },
  execute: calculateSpaceInColumnNameFlagger,
});
export const runSpaceInColumnNameFlagger = spaceInColumnNameFlaggerTool.execute;
export default spaceInColumnNameFlaggerTool;
