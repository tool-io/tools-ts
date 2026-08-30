import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type TautologyAllTrueCheckerInput = {
  readonly values: ReadonlyArray<boolean>;
};
export type TautologyAllTrueCheckerOutput = {
  readonly tautology: boolean;
};
export const tautologyAllTrueCheckerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "values": {
      "type": "array",
      "items": {
        "type": "boolean"
      },
      "minItems": 1,
      "maxItems": 4096,
      "description": "Complete truth column"
    }
  },
  "required": [
    "values"
  ]
} as const satisfies ToolJsonSchema;
export const tautologyAllTrueCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "tautology": {
      "type": "boolean",
      "description": "Tautology"
    }
  },
  "required": [
    "tautology"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);
export const truthColumnSize = (length: number): boolean => length > 0 && (length & (length - 1)) === 0;
// Reference: https://forallx.openlogicproject.org/html/Ch11.html; https://forallx.openlogicproject.org/html/Ch19.html
export const calculateTautologyAllTrueChecker = (rawInput: unknown): ToolResult<TautologyAllTrueCheckerOutput> => {
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
  if (valuesValue.length < 1) return issue("values", "out_of_range", "Too few entries.");
  if (valuesValue.length > 4096) return issue("values", "resource_limit", "Array exceeds the 4096-entry resource limit.");
  const validatedValues: boolean[] = [];
  for (let index = 0; index < valuesValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(valuesValue, index)) return issue(`values.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = valuesValue[index];
    if (typeof item !== "boolean") return issue(`values.${index}`, "invalid_type", "Enter a boolean value.");
    validatedValues.push(item);
  }

  const input: TautologyAllTrueCheckerInput = { values: validatedValues };
  if (!truthColumnSize(input.values.length)) return issue("values", "incomplete_table", "A complete truth column has a positive power-of-two row count.");
  return toolSuccess({ tautology: input.values.every((value) => value) });
};
export const example = {
  input: {
    "values": [
      true,
      true,
      true,
      true
    ]
  },
  output: {
    "tautology": true
  },
} satisfies ToolExample<TautologyAllTrueCheckerInput, TautologyAllTrueCheckerOutput>;
export const tautologyAllTrueCheckerTool = defineTool<TautologyAllTrueCheckerInput, TautologyAllTrueCheckerOutput>({
  id: "logic/tautology-all-true-checker",
  title: "Tautology All-Rows-True Checker",
  description: "Check whether every row in a complete ordered Boolean truth column is true.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: tautologyAllTrueCheckerInputSchema,
  outputSchema: tautologyAllTrueCheckerOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "values",
        "label": "Complete truth column",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "boolean"
          }
        }
      }
    ],
    "outputs": [
      {
        "id": "tautology",
        "label": "Tautology",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateTautologyAllTrueChecker,
});
export const runTautologyAllTrueChecker = tautologyAllTrueCheckerTool.execute;
export default tautologyAllTrueCheckerTool;
