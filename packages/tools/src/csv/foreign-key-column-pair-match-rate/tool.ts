import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ForeignKeyColumnPairMatchRateInput = {
  readonly parentKeys: ReadonlyArray<string>;
  readonly childKeys: ReadonlyArray<string>;
};
export type ForeignKeyColumnPairMatchRateOutput = {
  readonly matchedCount: number;
  readonly childCount: number;
  readonly matchRate: number;
  readonly hasChildren: boolean;
};
export const foreignKeyColumnPairMatchRateInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "parentKeys": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Parent keys"
    },
    "childKeys": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Child keys"
    }
  },
  "required": [
    "parentKeys",
    "childKeys"
  ]
} as const satisfies ToolJsonSchema;
export const foreignKeyColumnPairMatchRateOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "matchedCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Matched count"
    },
    "childCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Child count"
    },
    "matchRate": {
      "type": "number",
      "minimum": 0,
      "maximum": 1,
      "description": "Match rate"
    },
    "hasChildren": {
      "type": "boolean",
      "description": "Has children"
    }
  },
  "required": [
    "matchedCount",
    "childCount",
    "matchRate",
    "hasChildren"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateForeignKeyColumnPairMatchRate = (rawInput: unknown): ToolResult<ForeignKeyColumnPairMatchRateOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly parentKeys?: unknown; readonly childKeys?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "parentKeys",
  "childKeys"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const parentKeysValue = candidate.parentKeys;
  if (!Array.isArray(parentKeysValue)) return issue("parentKeys", "invalid_type", "Enter a dense array.");
  if (parentKeysValue.length < 0) return issue("parentKeys", "out_of_range", "Too few entries.");
  if (parentKeysValue.length > 10000) return issue("parentKeys", "resource_limit", "Array exceeds the 10000-entry resource limit.");
  const validatedParentkeys: string[] = [];
  for (let index = 0; index < parentKeysValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(parentKeysValue, index)) return issue(`parentKeys.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = parentKeysValue[index];
    if (typeof item !== "string") return issue(`parentKeys.${index}`, "invalid_type", "Enter a string value.");
    if (item.length > 10000) return issue(`parentKeys.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
    validatedParentkeys.push(item);
  }
  if (validatedParentkeys.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("parentKeys", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
  const childKeysValue = candidate.childKeys;
  if (!Array.isArray(childKeysValue)) return issue("childKeys", "invalid_type", "Enter a dense array.");
  if (childKeysValue.length < 0) return issue("childKeys", "out_of_range", "Too few entries.");
  if (childKeysValue.length > 10000) return issue("childKeys", "resource_limit", "Array exceeds the 10000-entry resource limit.");
  const validatedChildkeys: string[] = [];
  for (let index = 0; index < childKeysValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(childKeysValue, index)) return issue(`childKeys.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = childKeysValue[index];
    if (typeof item !== "string") return issue(`childKeys.${index}`, "invalid_type", "Enter a string value.");
    if (item.length > 10000) return issue(`childKeys.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
    validatedChildkeys.push(item);
  }
  if (validatedChildkeys.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("childKeys", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
  const input: ForeignKeyColumnPairMatchRateInput = { parentKeys: validatedParentkeys, childKeys: validatedChildkeys };
  const parents = new Set(input.parentKeys);
  const matchedCount = input.childKeys.filter((key) => parents.has(key)).length;
  const childCount = input.childKeys.length;
  return toolSuccess({ matchedCount, childCount, matchRate: childCount === 0 ? 0 : matchedCount / childCount, hasChildren: childCount > 0 });
};
export const example = {
  input: {
    "parentKeys": [
      "a",
      "b"
    ],
    "childKeys": [
      "a",
      "a",
      "c"
    ]
  },
  output: {
    "matchedCount": 2,
    "childCount": 3,
    "matchRate": 0.6666666666666666,
    "hasChildren": true
  },
} satisfies ToolExample<ForeignKeyColumnPairMatchRateInput, ForeignKeyColumnPairMatchRateOutput>;
export const foreignKeyColumnPairMatchRateTool = defineTool<ForeignKeyColumnPairMatchRateInput, ForeignKeyColumnPairMatchRateOutput>({
  id: "csv/foreign-key-column-pair-match-rate",
  title: "Foreign-Key Pair Match Rate",
  description: "Measure the fraction of child key occurrences present in an exact parent-key set, counting repeated children individually and treating empty strings literally; no children returns hasChildren false and rate zero.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: foreignKeyColumnPairMatchRateInputSchema,
  outputSchema: foreignKeyColumnPairMatchRateOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "parentKeys",
        "label": "Parent keys",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      },
      {
        "id": "childKeys",
        "label": "Child keys",
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
        "id": "matchedCount",
        "label": "Matched count",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "childCount",
        "label": "Child count",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "matchRate",
        "label": "Match rate",
        "valueType": {
          "type": "number"
        }
      },
      {
        "id": "hasChildren",
        "label": "Has children",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateForeignKeyColumnPairMatchRate,
});
export const runForeignKeyColumnPairMatchRate = foreignKeyColumnPairMatchRateTool.execute;
export default foreignKeyColumnPairMatchRateTool;
