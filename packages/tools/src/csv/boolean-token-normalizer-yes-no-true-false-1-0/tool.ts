import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type BooleanTokenNormalizerYesNoTrueFalse10Input = {
  readonly values: ReadonlyArray<string>;
};
export type BooleanTokenNormalizerYesNoTrueFalse10Output = {
  readonly values: ReadonlyArray<boolean>;
};
export const booleanTokenNormalizerYesNoTrueFalse10InputSchema = {
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
export const booleanTokenNormalizerYesNoTrueFalse10OutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "values": {
      "type": "array",
      "items": {
        "type": "boolean"
      },
      "description": "Values"
    }
  },
  "required": [
    "values"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateBooleanTokenNormalizerYesNoTrueFalse10 = (rawInput: unknown): ToolResult<BooleanTokenNormalizerYesNoTrueFalse10Output> => {
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
  const input: BooleanTokenNormalizerYesNoTrueFalse10Input = { values: validatedValues };
  const values: boolean[] = [];
  for (const [index, cell] of input.values.entries()) {
    const token = cell.trim().toLowerCase();
    if (["yes", "true", "1"].includes(token)) values.push(true);
    else if (["no", "false", "0"].includes(token)) values.push(false);
    else return issue(`values.${index}`, "unknown_boolean", "Use yes/no, true/false, or 1/0.");
  }
  return toolSuccess({ values });
};
export const example = {
  input: {
    "values": [
      " YES ",
      "false",
      "1",
      "0"
    ]
  },
  output: {
    "values": [
      true,
      false,
      true,
      false
    ]
  },
} satisfies ToolExample<BooleanTokenNormalizerYesNoTrueFalse10Input, BooleanTokenNormalizerYesNoTrueFalse10Output>;
export const booleanTokenNormalizerYesNoTrueFalse10Tool = defineTool<BooleanTokenNormalizerYesNoTrueFalse10Input, BooleanTokenNormalizerYesNoTrueFalse10Output>({
  id: "csv/boolean-token-normalizer-yes-no-true-false-1-0",
  title: "Boolean Token Normalizer",
  description: "Normalize trimmed case-insensitive yes/no, true/false, and 1/0 column cells into booleans, returning a cell-specific error for unknown tokens.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: booleanTokenNormalizerYesNoTrueFalse10InputSchema,
  outputSchema: booleanTokenNormalizerYesNoTrueFalse10OutputSchema,
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
            "type": "boolean"
          }
        }
      }
    ]
  },
  execute: calculateBooleanTokenNormalizerYesNoTrueFalse10,
});
export const runBooleanTokenNormalizerYesNoTrueFalse10 = booleanTokenNormalizerYesNoTrueFalse10Tool.execute;
export default booleanTokenNormalizerYesNoTrueFalse10Tool;
