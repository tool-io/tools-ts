import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type RtlOverrideU202eHiddenCharDetectorInput = {
  readonly values: ReadonlyArray<string>;
};
export type RtlOverrideU202eHiddenCharDetectorOutput = {
  readonly locations: ReadonlyArray<{ readonly cell: number; readonly offset: number; }>;
};
export const rtlOverrideU202eHiddenCharDetectorInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "values": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Values"
    }
  },
  "required": [
    "values"
  ]
} as const satisfies ToolJsonSchema;
export const rtlOverrideU202eHiddenCharDetectorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "locations": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "cell": {
            "type": "integer"
          },
          "offset": {
            "type": "integer"
          }
        },
        "required": [
          "cell",
          "offset"
        ]
      },
      "description": "Locations"
    }
  },
  "required": [
    "locations"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.unicode.org/reports/tr9/
export const calculateRtlOverrideU202eHiddenCharDetector = (rawInput: unknown): ToolResult<RtlOverrideU202eHiddenCharDetectorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly values?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "values"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const valuesValue = candidate.values;
  if (!Array.isArray(valuesValue)) return issue("values", "invalid_type", "Enter a dense array.");
  if (valuesValue.length < 0) return issue("values", "out_of_range", "Too few entries.");
  if (valuesValue.length > 10000) return issue("values", "resource_limit", "Array exceeds the 10000-entry resource limit.");
  const validatedValues: string[] = [];
  for (let index = 0; index < valuesValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(valuesValue, index)) return issue(`values.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = valuesValue[index];
    if (typeof item !== "string") return issue(`values.${index}`, "invalid_type", "Enter a string value.");
    if (item.length > 10000) return issue(`values.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
    validatedValues.push(item);
  }
  if (validatedValues.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("values", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
  const input: RtlOverrideU202eHiddenCharDetectorInput = { values: validatedValues };
  const locations: { cell: number; offset: number }[] = [];
  input.values.forEach((value, cell) => { for (const match of value.matchAll(/\u202e/g)) locations.push({ cell, offset: match.index }); });
  return toolSuccess({ locations });
};
export const example = {
  input: {
    "values": [
      "invoice‮csv",
      "plain"
    ]
  },
  output: {
    "locations": [
      {
        "cell": 0,
        "offset": 7
      }
    ]
  },
} satisfies ToolExample<RtlOverrideU202eHiddenCharDetectorInput, RtlOverrideU202eHiddenCharDetectorOutput>;
export const rtlOverrideU202eHiddenCharDetectorTool = defineTool<RtlOverrideU202eHiddenCharDetectorInput, RtlOverrideU202eHiddenCharDetectorOutput>({
  id: "csv/rtl-override-u202e-hidden-char-detector",
  title: "RTL Override U+202E Hidden Char Detector",
  description: "Locate every RIGHT-TO-LEFT OVERRIDE U+202E in cell strings with zero-based cell indices and UTF-16 offsets, without changing text or inferring visual order.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: rtlOverrideU202eHiddenCharDetectorInputSchema,
  outputSchema: rtlOverrideU202eHiddenCharDetectorOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "values",
        "label": "Values",
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
        "id": "locations",
        "label": "Locations",
        "valueType": {
          "type": "list",
          "items": {
            "type": "object"
          }
        }
      }
    ]
  },
  execute: calculateRtlOverrideU202eHiddenCharDetector,
});
export const runRtlOverrideU202eHiddenCharDetector = rtlOverrideU202eHiddenCharDetectorTool.execute;
export default rtlOverrideU202eHiddenCharDetectorTool;
