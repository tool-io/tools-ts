import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type Latin1ExportCompatibilityWarningInput = {
  readonly values: ReadonlyArray<string>;
};
export type Latin1ExportCompatibilityWarningOutput = {
  readonly compatible: boolean;
  readonly incompatibleIndices: ReadonlyArray<number>;
};
export const latin1ExportCompatibilityWarningInputSchema = {
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
export const latin1ExportCompatibilityWarningOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "compatible": {
      "type": "boolean",
      "description": "Compatible"
    },
    "incompatibleIndices": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 0
      },
      "description": "Incompatible indices"
    }
  },
  "required": [
    "compatible",
    "incompatibleIndices"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.unicode.org/Public/MAPPINGS/ISO8859/8859-1.TXT
export const calculateLatin1ExportCompatibilityWarning = (rawInput: unknown): ToolResult<Latin1ExportCompatibilityWarningOutput> => {
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
  const input: Latin1ExportCompatibilityWarningInput = { values: validatedValues };
  const incompatibleIndices = input.values.flatMap((value, index) => /[^\u0000-\u00ff]/.test(value) ? [index] : []);
  return toolSuccess({ compatible: incompatibleIndices.length === 0, incompatibleIndices });
};
export const example = {
  input: {
    "values": [
      "café",
      "€",
      "😀"
    ]
  },
  output: {
    "compatible": false,
    "incompatibleIndices": [
      1,
      2
    ]
  },
} satisfies ToolExample<Latin1ExportCompatibilityWarningInput, Latin1ExportCompatibilityWarningOutput>;
export const latin1ExportCompatibilityWarningTool = defineTool<Latin1ExportCompatibilityWarningInput, Latin1ExportCompatibilityWarningOutput>({
  id: "csv/latin1-export-compatibility-warning",
  title: "Latin-1 Export Compatibility Warning",
  description: "Report cells containing characters outside ISO-8859-1’s U+0000–U+00FF repertoire; Windows-1252 substitutions such as the euro sign are not accepted as Latin-1.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: latin1ExportCompatibilityWarningInputSchema,
  outputSchema: latin1ExportCompatibilityWarningOutputSchema,
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
        "id": "compatible",
        "label": "Compatible",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "incompatibleIndices",
        "label": "Incompatible indices",
        "valueType": {
          "type": "list",
          "items": {
            "type": "integer"
          }
        }
      }
    ]
  },
  execute: calculateLatin1ExportCompatibilityWarning,
});
export const runLatin1ExportCompatibilityWarning = latin1ExportCompatibilityWarningTool.execute;
export default latin1ExportCompatibilityWarningTool;
