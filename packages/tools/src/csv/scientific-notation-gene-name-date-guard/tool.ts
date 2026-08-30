import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ScientificNotationGeneNameDateGuardInput = {
  readonly values: ReadonlyArray<string>;
};
export type ScientificNotationGeneNameDateGuardOutput = {
  readonly risks: ReadonlyArray<{ readonly cell: number; readonly reason: string; }>;
};
export const scientificNotationGeneNameDateGuardInputSchema = {
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
export const scientificNotationGeneNameDateGuardOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "risks": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "cell": {
            "type": "integer"
          },
          "reason": {
            "type": "string"
          }
        },
        "required": [
          "cell",
          "reason"
        ]
      },
      "description": "Risks"
    }
  },
  "required": [
    "risks"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://blog.genenames.org/newsletters/2020/08/28/Summer_newsletter/
export const calculateScientificNotationGeneNameDateGuard = (rawInput: unknown): ToolResult<ScientificNotationGeneNameDateGuardOutput> => {
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
  const input: ScientificNotationGeneNameDateGuardInput = { values: validatedValues };
  const risks: { cell: number; reason: string }[] = [];
  input.values.forEach((value, cell) => {
    const token = value.trim();
    if (/^(MARCH[0-9]+|MARC[12]|SEPT[0-9]+|DEC1)$/i.test(token)) risks.push({ cell, reason: "legacy_date_like_symbol" });
    if (/^[+-]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)[eE][+-]?[0-9]+$/.test(token)) risks.push({ cell, reason: "scientific_notation_shape" });
  });
  return toolSuccess({ risks });
};
export const example = {
  input: {
    "values": [
      "SEPT1",
      "MARCHF1",
      "1E10"
    ]
  },
  output: {
    "risks": [
      {
        "cell": 0,
        "reason": "legacy_date_like_symbol"
      },
      {
        "cell": 2,
        "reason": "scientific_notation_shape"
      }
    ]
  },
} satisfies ToolExample<ScientificNotationGeneNameDateGuardInput, ScientificNotationGeneNameDateGuardOutput>;
export const scientificNotationGeneNameDateGuardTool = defineTool<ScientificNotationGeneNameDateGuardInput, ScientificNotationGeneNameDateGuardOutput>({
  id: "csv/scientific-notation-gene-name-date-guard",
  title: "Scientific-Notation Gene-Name Date Guard",
  description: "Flag legacy MARCH#, MARC1/2, SEPT#, or DEC1 symbols and ASCII scientific-notation-shaped cells as spreadsheet import risks; the rule is a heuristic, not a gene registry lookup.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: scientificNotationGeneNameDateGuardInputSchema,
  outputSchema: scientificNotationGeneNameDateGuardOutputSchema,
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
        "id": "risks",
        "label": "Risks",
        "valueType": {
          "type": "list",
          "items": {
            "type": "object"
          }
        }
      }
    ]
  },
  execute: calculateScientificNotationGeneNameDateGuard,
});
export const runScientificNotationGeneNameDateGuard = scientificNotationGeneNameDateGuardTool.execute;
export default scientificNotationGeneNameDateGuardTool;
