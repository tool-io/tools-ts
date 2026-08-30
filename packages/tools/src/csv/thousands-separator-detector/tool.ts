import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { parseDecimal } from "../currency-symbol-strip-to-number/tool.js";
export type ThousandsSeparatorDetectorInput = {
  readonly values: ReadonlyArray<string>;
};
export type ThousandsSeparatorDetectorOutput = {
  readonly groupingSeparators: ReadonlyArray<string>;
  readonly mayBeDecimal: boolean;
};
export const thousandsSeparatorDetectorInputSchema = {
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
export const thousandsSeparatorDetectorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "groupingSeparators": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Grouping separators"
    },
    "mayBeDecimal": {
      "type": "boolean",
      "description": "May be decimal"
    }
  },
  "required": [
    "groupingSeparators",
    "mayBeDecimal"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateThousandsSeparatorDetector = (rawInput: unknown): ToolResult<ThousandsSeparatorDetectorOutput> => {
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
  const input: ThousandsSeparatorDetectorInput = { values: validatedValues };
  const values = input.values.map((value) => value.trim()).filter((value) => value !== "");
  const groupingSeparators = [",", ".", " "].filter((separator) => {
    const decimal = separator === "." ? "," : ".";
    return values.some((value) => (value.split(decimal)[0] ?? "").includes(separator)) && values.every((value) => parseDecimal(value, decimal, separator) !== undefined);
  });
  const mayBeDecimal = groupingSeparators.some((separator) => separator !== " " && values.every((value) => parseDecimal(value, separator, "") !== undefined));
  return toolSuccess({ groupingSeparators, mayBeDecimal });
};
export const example = {
  input: {
    "values": [
      "12,345,678",
      "1,234"
    ]
  },
  output: {
    "groupingSeparators": [
      ","
    ],
    "mayBeDecimal": false
  },
} satisfies ToolExample<ThousandsSeparatorDetectorInput, ThousandsSeparatorDetectorOutput>;
export const thousandsSeparatorDetectorTool = defineTool<ThousandsSeparatorDetectorInput, ThousandsSeparatorDetectorOutput>({
  id: "csv/thousands-separator-detector",
  title: "Thousands Separator Detector",
  description: "List comma, dot, or ASCII-space grouping profiles observed in a numeric column sample, requiring groups of three digits; report when the same sample also permits a decimal-only interpretation.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: thousandsSeparatorDetectorInputSchema,
  outputSchema: thousandsSeparatorDetectorOutputSchema,
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
        "id": "groupingSeparators",
        "label": "Grouping separators",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      },
      {
        "id": "mayBeDecimal",
        "label": "May be decimal",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateThousandsSeparatorDetector,
});
export const runThousandsSeparatorDetector = thousandsSeparatorDetectorTool.execute;
export default thousandsSeparatorDetectorTool;
