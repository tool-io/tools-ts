import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type LeadingZeroZipCodeLossWarnerInput = {
  readonly values: ReadonlyArray<string>;
};
export type LeadingZeroZipCodeLossWarnerOutput = {
  readonly atRiskIndices: ReadonlyArray<number>;
};
export const leadingZeroZipCodeLossWarnerInputSchema = {
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
export const leadingZeroZipCodeLossWarnerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "atRiskIndices": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 0
      },
      "description": "At risk indices"
    }
  },
  "required": [
    "atRiskIndices"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://support.microsoft.com/en-us/office/keeping-leading-zeros-and-large-numbers-1bf7b935-36e1-4985-842f-5dfa51f85fe7
export const calculateLeadingZeroZipCodeLossWarner = (rawInput: unknown): ToolResult<LeadingZeroZipCodeLossWarnerOutput> => {
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
  const input: LeadingZeroZipCodeLossWarnerInput = { values: validatedValues };
  return toolSuccess({ atRiskIndices: input.values.flatMap((value, index) => /^0[0-9]{4}(?:-[0-9]{4})?$/.test(value.trim()) ? [index] : []) });
};
export const example = {
  input: {
    "values": [
      "02108",
      "10001",
      "00501-1234"
    ]
  },
  output: {
    "atRiskIndices": [
      0,
      2
    ]
  },
} satisfies ToolExample<LeadingZeroZipCodeLossWarnerInput, LeadingZeroZipCodeLossWarnerOutput>;
export const leadingZeroZipCodeLossWarnerTool = defineTool<LeadingZeroZipCodeLossWarnerInput, LeadingZeroZipCodeLossWarnerOutput>({
  id: "csv/leading-zero-zip-code-loss-warner",
  title: "Leading-Zero ZIP Code Loss Warner",
  description: "Flag original five-digit or ZIP+4-shaped cells beginning with zero as susceptible to numeric-import loss; this is a spelling warning rather than postal-code assignment validation.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: leadingZeroZipCodeLossWarnerInputSchema,
  outputSchema: leadingZeroZipCodeLossWarnerOutputSchema,
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
        "id": "atRiskIndices",
        "label": "At risk indices",
        "valueType": {
          "type": "list",
          "items": {
            "type": "integer"
          }
        }
      }
    ]
  },
  execute: calculateLeadingZeroZipCodeLossWarner,
});
export const runLeadingZeroZipCodeLossWarner = leadingZeroZipCodeLossWarnerTool.execute;
export default leadingZeroZipCodeLossWarnerTool;
