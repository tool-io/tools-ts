import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ZeroWidthCharInCellsDetectorInput = {
  readonly values: ReadonlyArray<string>;
};
export type ZeroWidthCharInCellsDetectorOutput = {
  readonly locations: ReadonlyArray<{ readonly cell: number; readonly offset: number; readonly codePoint: number; }>;
};
export const zeroWidthCharInCellsDetectorInputSchema = {
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
export const zeroWidthCharInCellsDetectorOutputSchema = {
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
          },
          "codePoint": {
            "type": "integer"
          }
        },
        "required": [
          "cell",
          "offset",
          "codePoint"
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

// Reference: https://www.unicode.org/charts/PDF/U2000.pdf; https://www.unicode.org/faq/utf_bom.html
export const calculateZeroWidthCharInCellsDetector = (rawInput: unknown): ToolResult<ZeroWidthCharInCellsDetectorOutput> => {
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
  const input: ZeroWidthCharInCellsDetectorInput = { values: validatedValues };
  const locations: { cell: number; offset: number; codePoint: number }[] = [];
  input.values.forEach((value, cell) => { for (const match of value.matchAll(/[\u200b\u200c\u200d\u2060\ufeff]/g)) locations.push({ cell, offset: match.index, codePoint: match[0].charCodeAt(0) }); });
  return toolSuccess({ locations });
};
export const example = {
  input: {
    "values": [
      "a​b",
      "﻿id"
    ]
  },
  output: {
    "locations": [
      {
        "cell": 0,
        "offset": 1,
        "codePoint": 8203
      },
      {
        "cell": 1,
        "offset": 0,
        "codePoint": 65279
      }
    ]
  },
} satisfies ToolExample<ZeroWidthCharInCellsDetectorInput, ZeroWidthCharInCellsDetectorOutput>;
export const zeroWidthCharInCellsDetectorTool = defineTool<ZeroWidthCharInCellsDetectorInput, ZeroWidthCharInCellsDetectorOutput>({
  id: "csv/zero-width-char-in-cells-detector",
  title: "Zero-Width Char In Cells Detector",
  description: "Locate the explicit format-character set U+200B, U+200C, U+200D, U+2060, and U+FEFF in cells, reporting UTF-16 offsets and code points; this is not a universal glyph-width test.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: zeroWidthCharInCellsDetectorInputSchema,
  outputSchema: zeroWidthCharInCellsDetectorOutputSchema,
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
  execute: calculateZeroWidthCharInCellsDetector,
});
export const runZeroWidthCharInCellsDetector = zeroWidthCharInCellsDetectorTool.execute;
export default zeroWidthCharInCellsDetectorTool;
