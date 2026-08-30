import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type BomTrimFromFirstCellInput = {
  readonly values: ReadonlyArray<string>;
};
export type BomTrimFromFirstCellOutput = {
  readonly values: ReadonlyArray<string>;
  readonly removed: boolean;
};
export const bomTrimFromFirstCellInputSchema = {
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
export const bomTrimFromFirstCellOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "values": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Values"
    },
    "removed": {
      "type": "boolean",
      "description": "Removed"
    }
  },
  "required": [
    "values",
    "removed"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.unicode.org/faq/utf_bom.html
export const calculateBomTrimFromFirstCell = (rawInput: unknown): ToolResult<BomTrimFromFirstCellOutput> => {
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
  const input: BomTrimFromFirstCellInput = { values: validatedValues };
  const removed = input.values[0]?.startsWith("﻿") ?? false;
  return toolSuccess({ values: input.values.map((value, index) => removed && index === 0 ? value.slice(1) : value), removed });
};
export const example = {
  input: {
    "values": [
      "﻿id",
      "﻿name"
    ]
  },
  output: {
    "values": [
      "id",
      "﻿name"
    ],
    "removed": true
  },
} satisfies ToolExample<BomTrimFromFirstCellInput, BomTrimFromFirstCellOutput>;
export const bomTrimFromFirstCellTool = defineTool<BomTrimFromFirstCellInput, BomTrimFromFirstCellOutput>({
  id: "csv/bom-trim-from-first-cell",
  title: "BOM Trim From First Cell",
  description: "Remove exactly one initial U+FEFF from the first decoded cell only, preserving interior marks and all subsequent cells.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: bomTrimFromFirstCellInputSchema,
  outputSchema: bomTrimFromFirstCellOutputSchema,
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
        "id": "values",
        "label": "Values",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
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
  execute: calculateBomTrimFromFirstCell,
});
export const runBomTrimFromFirstCell = bomTrimFromFirstCellTool.execute;
export default bomTrimFromFirstCellTool;
