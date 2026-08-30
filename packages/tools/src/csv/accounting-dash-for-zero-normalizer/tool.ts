import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type AccountingDashForZeroNormalizerInput = {
  readonly values: ReadonlyArray<string>;
};
export type AccountingDashForZeroNormalizerOutput = {
  readonly values: ReadonlyArray<string>;
};
export const accountingDashForZeroNormalizerInputSchema = {
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
export const accountingDashForZeroNormalizerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "values": {
      "type": "array",
      "items": {
        "type": "string"
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

// Reference: https://support.microsoft.com/en-us/excel/format-numbers-as-currency-in-excel
export const calculateAccountingDashForZeroNormalizer = (rawInput: unknown): ToolResult<AccountingDashForZeroNormalizerOutput> => {
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
  const input: AccountingDashForZeroNormalizerInput = { values: validatedValues };
  return toolSuccess({ values: input.values.map((value) => value.trim() === "-" ? "0" : value) });
};
export const example = {
  input: {
    "values": [
      " - ",
      "-12",
      "—",
      ""
    ]
  },
  output: {
    "values": [
      "0",
      "-12",
      "—",
      ""
    ]
  },
} satisfies ToolExample<AccountingDashForZeroNormalizerInput, AccountingDashForZeroNormalizerOutput>;
export const accountingDashForZeroNormalizerTool = defineTool<AccountingDashForZeroNormalizerInput, AccountingDashForZeroNormalizerOutput>({
  id: "csv/accounting-dash-for-zero-normalizer",
  title: "Accounting Dash-for-Zero Normalizer",
  description: "Replace cells consisting of a trimmed ASCII accounting dash with the exact string 0, preserving all other cell text including numeric signs and Unicode dashes.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: accountingDashForZeroNormalizerInputSchema,
  outputSchema: accountingDashForZeroNormalizerOutputSchema,
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
      }
    ]
  },
  execute: calculateAccountingDashForZeroNormalizer,
});
export const runAccountingDashForZeroNormalizer = accountingDashForZeroNormalizerTool.execute;
export default accountingDashForZeroNormalizerTool;
