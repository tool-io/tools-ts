import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ColumnTypeInferenceSampleIntFloatStringInput = {
  readonly values: ReadonlyArray<string>;
};
export type ColumnTypeInferenceSampleIntFloatStringOutput = {
  readonly kind: "empty" | "integer" | "decimal" | "string";
  readonly observedCount: number;
};
export const columnTypeInferenceSampleIntFloatStringInputSchema = {
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
export const columnTypeInferenceSampleIntFloatStringOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "kind": {
      "type": "string",
      "enum": [
        "empty",
        "integer",
        "decimal",
        "string"
      ],
      "description": "Kind"
    },
    "observedCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Observed count"
    }
  },
  "required": [
    "kind",
    "observedCount"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

export const cellTokenType = (cell: string): "empty" | "integer" | "decimal" | "text" => {
  const token = cell.trim();
  if (token === "") return "empty";
  if (/^[+-]?(0|[1-9][0-9]*)$/.test(token)) return "integer";
  if (/^[+-]?(0|[1-9][0-9]*)\.[0-9]+$/.test(token)) return "decimal";
  return "text";
};

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateColumnTypeInferenceSampleIntFloatString = (rawInput: unknown): ToolResult<ColumnTypeInferenceSampleIntFloatStringOutput> => {
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
  const input: ColumnTypeInferenceSampleIntFloatStringInput = { values: validatedValues };
  const types = input.values.map(cellTokenType).filter((kind) => kind !== "empty");
  const kind = types.length === 0 ? "empty" : types.includes("text") ? "string" : types.includes("decimal") ? "decimal" : "integer";
  return toolSuccess({ kind, observedCount: types.length });
};
export const example = {
  input: {
    "values": [
      "12",
      "3.5",
      ""
    ]
  },
  output: {
    "kind": "decimal",
    "observedCount": 2
  },
} satisfies ToolExample<ColumnTypeInferenceSampleIntFloatStringInput, ColumnTypeInferenceSampleIntFloatStringOutput>;
export const columnTypeInferenceSampleIntFloatStringTool = defineTool<ColumnTypeInferenceSampleIntFloatStringInput, ColumnTypeInferenceSampleIntFloatStringOutput>({
  id: "csv/column-type-inference-sample-int-float-string",
  title: "Column Type Inference From Sample",
  description: "Infer empty, integer, decimal, or string from a column sample using ASCII decimal token syntax; blanks are ignored and leading-zero identifiers remain strings.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: columnTypeInferenceSampleIntFloatStringInputSchema,
  outputSchema: columnTypeInferenceSampleIntFloatStringOutputSchema,
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
        "id": "kind",
        "label": "Kind",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "observedCount",
        "label": "Observed count",
        "valueType": {
          "type": "integer"
        }
      }
    ]
  },
  execute: calculateColumnTypeInferenceSampleIntFloatString,
});
export const runColumnTypeInferenceSampleIntFloatString = columnTypeInferenceSampleIntFloatStringTool.execute;
export default columnTypeInferenceSampleIntFloatStringTool;
