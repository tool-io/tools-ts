import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { parseDecimal } from "../currency-symbol-strip-to-number/tool.js";
export type DecimalSeparatorDotVsCommaDetectorInput = {
  readonly values: ReadonlyArray<string>;
};
export type DecimalSeparatorDotVsCommaDetectorOutput = {
  readonly decimalSeparators: ReadonlyArray<string>;
  readonly ambiguous: boolean;
};
export const decimalSeparatorDotVsCommaDetectorInputSchema = {
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
export const decimalSeparatorDotVsCommaDetectorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "decimalSeparators": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Decimal separators"
    },
    "ambiguous": {
      "type": "boolean",
      "description": "Ambiguous"
    }
  },
  "required": [
    "decimalSeparators",
    "ambiguous"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateDecimalSeparatorDotVsCommaDetector = (rawInput: unknown): ToolResult<DecimalSeparatorDotVsCommaDetectorOutput> => {
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
  const input: DecimalSeparatorDotVsCommaDetectorInput = { values: validatedValues };
  const values = input.values.filter((value) => value.trim() !== "");
  const decimalSeparators = values.length === 0 ? [] : [".", ","].filter((separator) => values.every((value) => parseDecimal(value, separator, separator === "." ? "," : ".") !== undefined));
  return toolSuccess({ decimalSeparators, ambiguous: decimalSeparators.length !== 1 });
};
export const example = {
  input: {
    "values": [
      "1.234,50",
      "25,75"
    ]
  },
  output: {
    "decimalSeparators": [
      ","
    ],
    "ambiguous": false
  },
} satisfies ToolExample<DecimalSeparatorDotVsCommaDetectorInput, DecimalSeparatorDotVsCommaDetectorOutput>;
export const decimalSeparatorDotVsCommaDetectorTool = defineTool<DecimalSeparatorDotVsCommaDetectorInput, DecimalSeparatorDotVsCommaDetectorOutput>({
  id: "csv/decimal-separator-dot-vs-comma-detector",
  title: "Decimal Separator Dot vs Comma Detector",
  description: "List decimal separator profiles compatible with all nonblank cells, allowing opposite-character thousands grouping; ambiguous values such as 1,234 keep both interpretations.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: decimalSeparatorDotVsCommaDetectorInputSchema,
  outputSchema: decimalSeparatorDotVsCommaDetectorOutputSchema,
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
        "id": "decimalSeparators",
        "label": "Decimal separators",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      },
      {
        "id": "ambiguous",
        "label": "Ambiguous",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateDecimalSeparatorDotVsCommaDetector,
});
export const runDecimalSeparatorDotVsCommaDetector = decimalSeparatorDotVsCommaDetectorTool.execute;
export default decimalSeparatorDotVsCommaDetectorTool;
