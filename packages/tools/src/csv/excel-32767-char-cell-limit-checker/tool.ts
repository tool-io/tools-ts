import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type Excel32767CharCellLimitCheckerInput = {
  readonly characterCounts: ReadonlyArray<number>;
};
export type Excel32767CharCellLimitCheckerOutput = {
  readonly fits: boolean;
  readonly limit: number;
  readonly overLimitIndices: ReadonlyArray<number>;
};
export const excel32767CharCellLimitCheckerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "characterCounts": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 0,
        "maximum": 9007199254740991
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Character counts"
    }
  },
  "required": [
    "characterCounts"
  ]
} as const satisfies ToolJsonSchema;
export const excel32767CharCellLimitCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "fits": {
      "type": "boolean",
      "description": "Fits"
    },
    "limit": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Limit"
    },
    "overLimitIndices": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 0
      },
      "description": "Over limit indices"
    }
  },
  "required": [
    "fits",
    "limit",
    "overLimitIndices"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://support.microsoft.com/en-us/excel/excel-specifications-and-limits
export const calculateExcel32767CharCellLimitChecker = (rawInput: unknown): ToolResult<Excel32767CharCellLimitCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly characterCounts?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "characterCounts"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const characterCountsValue = candidate.characterCounts;
  if (!Array.isArray(characterCountsValue)) return issue("characterCounts", "invalid_type", "Enter a dense array.");
  if (characterCountsValue.length < 0) return issue("characterCounts", "out_of_range", "Too few entries.");
  if (characterCountsValue.length > 10000) return issue("characterCounts", "resource_limit", "Array exceeds the 10000-entry resource limit.");
  const validatedCharactercounts: number[] = [];
  for (let index = 0; index < characterCountsValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(characterCountsValue, index)) return issue(`characterCounts.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = characterCountsValue[index];
    if (typeof item !== "number" || !Number.isSafeInteger(item)) return issue(`characterCounts.${index}`, "invalid_type", "Enter a finite safe integer.");
    if (item < 0) return issue(`characterCounts.${index}`, "out_of_range", "Value is outside the accepted range.");
    if (item > 9007199254740991) return issue(`characterCounts.${index}`, "out_of_range", "Value is outside the accepted range.");
    validatedCharactercounts.push(item);
  }
  const input: Excel32767CharCellLimitCheckerInput = { characterCounts: validatedCharactercounts };
  const overLimitIndices = input.characterCounts.flatMap((count, index) => count > 32767 ? [index] : []);
  return toolSuccess({ fits: overLimitIndices.length === 0, limit: 32767, overLimitIndices });
};
export const example = {
  input: {
    "characterCounts": [
      12,
      32767,
      32768
    ]
  },
  output: {
    "fits": false,
    "limit": 32767,
    "overLimitIndices": [
      2
    ]
  },
} satisfies ToolExample<Excel32767CharCellLimitCheckerInput, Excel32767CharCellLimitCheckerOutput>;
export const excel32767CharCellLimitCheckerTool = defineTool<Excel32767CharCellLimitCheckerInput, Excel32767CharCellLimitCheckerOutput>({
  id: "csv/excel-32767-char-cell-limit-checker",
  title: "Excel 32,767-Char Cell Limit Check",
  description: "Compare supplied nonnegative cell character counts with Excel’s 32,767-character limit and report zero-based offending indices; the caller selects the character-count convention.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: excel32767CharCellLimitCheckerInputSchema,
  outputSchema: excel32767CharCellLimitCheckerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "characterCounts",
        "label": "Character counts",
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
        "id": "fits",
        "label": "Fits",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "limit",
        "label": "Limit",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "overLimitIndices",
        "label": "Over limit indices",
        "valueType": {
          "type": "list",
          "items": {
            "type": "integer"
          }
        }
      }
    ]
  },
  execute: calculateExcel32767CharCellLimitChecker,
});
export const runExcel32767CharCellLimitChecker = excel32767CharCellLimitCheckerTool.execute;
export default excel32767CharCellLimitCheckerTool;
