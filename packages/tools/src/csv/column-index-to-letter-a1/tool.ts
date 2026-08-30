import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { columnLetters } from "../column-letter-to-index-a1/tool.js";
export type ColumnIndexToLetterA1Input = {
  readonly column: number;
};
export type ColumnIndexToLetterA1Output = {
  readonly letters: string;
};
export const columnIndexToLetterA1InputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "column": {
      "type": "integer",
      "minimum": 1,
      "maximum": 9007199254740991,
      "description": "Column"
    }
  },
  "required": [
    "column"
  ]
} as const satisfies ToolJsonSchema;
export const columnIndexToLetterA1OutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "letters": {
      "type": "string",
      "description": "Letters"
    }
  },
  "required": [
    "letters"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://support.microsoft.com/en-us/office/overview-of-formulas-in-excel-ecfdc708-9162-49e8-b993-c311f47ca173
export const calculateColumnIndexToLetterA1 = (rawInput: unknown): ToolResult<ColumnIndexToLetterA1Output> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly column?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "column"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const columnValue = candidate.column;
  if (typeof columnValue !== "number" || !Number.isSafeInteger(columnValue)) return issue("column", "invalid_type", "Enter a finite safe integer.");
  if (columnValue < 1) return issue("column", "out_of_range", "Value is outside the accepted range.");
  if (columnValue > 9007199254740991) return issue("column", "out_of_range", "Value is outside the accepted range.");
  const input: ColumnIndexToLetterA1Input = { column: columnValue };
  return toolSuccess({ letters: columnLetters(input.column) });
};
export const example = {
  input: {
    "column": 703
  },
  output: {
    "letters": "AAA"
  },
} satisfies ToolExample<ColumnIndexToLetterA1Input, ColumnIndexToLetterA1Output>;
export const columnIndexToLetterA1Tool = defineTool<ColumnIndexToLetterA1Input, ColumnIndexToLetterA1Output>({
  id: "csv/column-index-to-letter-a1",
  title: "Column Index to Letter (A1 Style)",
  description: "Convert a one-based safe integer column index to ASCII A1 column letters without imposing Excel worksheet width limits.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: columnIndexToLetterA1InputSchema,
  outputSchema: columnIndexToLetterA1OutputSchema,
  ports: {
    "inputs": [
      {
        "id": "column",
        "label": "Column",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      }
    ],
    "outputs": [
      {
        "id": "letters",
        "label": "Letters",
        "valueType": {
          "type": "string"
        }
      }
    ]
  },
  execute: calculateColumnIndexToLetterA1,
});
export const runColumnIndexToLetterA1 = columnIndexToLetterA1Tool.execute;
export default columnIndexToLetterA1Tool;
