import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type IdColumnUniquenessCheckerInput = {
  readonly values: ReadonlyArray<string>;
};
export type IdColumnUniquenessCheckerOutput = {
  readonly unique: boolean;
  readonly distinctCount: number;
  readonly duplicateIndices: ReadonlyArray<number>;
};
export const idColumnUniquenessCheckerInputSchema = {
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
export const idColumnUniquenessCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "unique": {
      "type": "boolean",
      "description": "Unique"
    },
    "distinctCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Distinct count"
    },
    "duplicateIndices": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 0
      },
      "description": "Duplicate indices"
    }
  },
  "required": [
    "unique",
    "distinctCount",
    "duplicateIndices"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateIdColumnUniquenessChecker = (rawInput: unknown): ToolResult<IdColumnUniquenessCheckerOutput> => {
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
  const input: IdColumnUniquenessCheckerInput = { values: validatedValues };
  const seen = new Set<string>();
  const duplicateIndices: number[] = [];
  input.values.forEach((value, index) => { if (seen.has(value)) duplicateIndices.push(index); else seen.add(value); });
  return toolSuccess({ unique: duplicateIndices.length === 0, distinctCount: seen.size, duplicateIndices });
};
export const example = {
  input: {
    "values": [
      "001",
      "1",
      "001"
    ]
  },
  output: {
    "unique": false,
    "distinctCount": 2,
    "duplicateIndices": [
      2
    ]
  },
} satisfies ToolExample<IdColumnUniquenessCheckerInput, IdColumnUniquenessCheckerOutput>;
export const idColumnUniquenessCheckerTool = defineTool<IdColumnUniquenessCheckerInput, IdColumnUniquenessCheckerOutput>({
  id: "csv/id-column-uniqueness-checker",
  title: "ID Column Uniqueness Check",
  description: "Check exact string ID uniqueness in a supplied column, treating empty strings and leading zeros literally; report indices of occurrences after each first occurrence.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: idColumnUniquenessCheckerInputSchema,
  outputSchema: idColumnUniquenessCheckerOutputSchema,
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
        "id": "unique",
        "label": "Unique",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "distinctCount",
        "label": "Distinct count",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "duplicateIndices",
        "label": "Duplicate indices",
        "valueType": {
          "type": "list",
          "items": {
            "type": "integer"
          }
        }
      }
    ]
  },
  execute: calculateIdColumnUniquenessChecker,
});
export const runIdColumnUniquenessChecker = idColumnUniquenessCheckerTool.execute;
export default idColumnUniquenessCheckerTool;
