import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ColumnLetterToIndexA1Input = {
  readonly letters: string;
};
export type ColumnLetterToIndexA1Output = {
  readonly column: number;
};
export const columnLetterToIndexA1InputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "letters": {
      "type": "string",
      "maxLength": 12,
      "description": "Letters"
    }
  },
  "required": [
    "letters"
  ]
} as const satisfies ToolJsonSchema;
export const columnLetterToIndexA1OutputSchema = {
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
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

export const columnIndex = (letters: string): number | undefined => {
  if (!/^[A-Za-z]{1,12}$/.test(letters)) return undefined;
  let value = 0n;
  for (const letter of letters.toUpperCase()) value = value * 26n + BigInt(letter.charCodeAt(0) - 64);
  return value <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(value) : undefined;
};
export const columnLetters = (column: number): string => {
  let value = BigInt(column);
  let letters = "";
  while (value > 0n) {
    value--;
    letters = String.fromCharCode(65 + Number(value % 26n)) + letters;
    value /= 26n;
  }
  return letters;
};
export type A1Coordinate = { readonly row: number; readonly column: number; readonly absoluteRow: boolean; readonly absoluteColumn: boolean; readonly canonical: string };
export const parseA1 = (address: string): A1Coordinate | undefined => {
  const match = /^(\$?)([A-Za-z]{1,12})(\$?)([1-9][0-9]{0,15})$/.exec(address);
  if (match === null) return undefined;
  const letters = match[2];
  const rowText = match[4];
  if (letters === undefined || rowText === undefined) return undefined;
  const column = columnIndex(letters);
  const row = Number(rowText);
  if (column === undefined || !Number.isSafeInteger(row)) return undefined;
  return { row, column, absoluteRow: match[3] === "$", absoluteColumn: match[1] === "$", canonical: (match[1] ?? "") + letters.toUpperCase() + (match[3] ?? "") + rowText };
};

// Reference: https://support.microsoft.com/en-us/office/overview-of-formulas-in-excel-ecfdc708-9162-49e8-b993-c311f47ca173
export const calculateColumnLetterToIndexA1 = (rawInput: unknown): ToolResult<ColumnLetterToIndexA1Output> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly letters?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "letters"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const lettersValue = candidate.letters;
  if (typeof lettersValue !== "string") return issue("letters", "invalid_type", "Enter a string value.");
  if (lettersValue.length > 12) return issue("letters", "resource_limit", "Text exceeds the 12-character resource limit.");
  const input: ColumnLetterToIndexA1Input = { letters: lettersValue };
  const column = columnIndex(input.letters);
  if (column === undefined) return issue("letters", "invalid_column", "Enter ASCII column letters whose index fits a safe integer.");
  return toolSuccess({ column });
};
export const example = {
  input: {
    "letters": "XFD"
  },
  output: {
    "column": 16384
  },
} satisfies ToolExample<ColumnLetterToIndexA1Input, ColumnLetterToIndexA1Output>;
export const columnLetterToIndexA1Tool = defineTool<ColumnLetterToIndexA1Input, ColumnLetterToIndexA1Output>({
  id: "csv/column-letter-to-index-a1",
  title: "Column Letter to Index (A=1)",
  description: "Convert ASCII A1 column letters to a one-based safe integer using bijective base 26; generalized columns are accepted beyond Excel worksheet limits.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: columnLetterToIndexA1InputSchema,
  outputSchema: columnLetterToIndexA1OutputSchema,
  ports: {
    "inputs": [
      {
        "id": "letters",
        "label": "Letters",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "column",
        "label": "Column",
        "valueType": {
          "type": "integer"
        }
      }
    ]
  },
  execute: calculateColumnLetterToIndexA1,
});
export const runColumnLetterToIndexA1 = columnLetterToIndexA1Tool.execute;
export default columnLetterToIndexA1Tool;
