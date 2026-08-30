import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText, writeCsvRecords, csvShape } from "../rfc4180-quoted-field-parser-check/tool.js";
export type ColumnDropByIndexInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
  readonly indices: ReadonlyArray<number>;
};
export type ColumnDropByIndexOutput = {
  readonly csv: string;
};
export const columnDropByIndexInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "csv": {
      "type": "string",
      "maxLength": 100000,
      "description": "CSV text"
    },
    "delimiter": {
      "type": "string",
      "enum": [
        ",",
        ";",
        "\t"
      ],
      "description": "Delimiter"
    },
    "indices": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 0
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Indices"
    }
  },
  "required": [
    "csv",
    "delimiter",
    "indices"
  ]
} as const satisfies ToolJsonSchema;
export const columnDropByIndexOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "csv": {
      "type": "string",
      "description": "CSV text"
    }
  },
  "required": [
    "csv"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateColumnDropByIndex = (rawInput: unknown): ToolResult<ColumnDropByIndexOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly csv?: unknown; readonly delimiter?: unknown; readonly indices?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "csv",
  "delimiter",
  "indices"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const csvValue = candidate.csv;
  if (typeof csvValue !== "string") return issue("csv", "invalid_type", "Enter a string value.");
  if (csvValue.length > 100000) return issue("csv", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const delimiterValue = candidate.delimiter;
  if (typeof delimiterValue !== "string") return issue("delimiter", "invalid_type", "Enter a string value.");
  if (delimiterValue !== "," && delimiterValue !== ";" && delimiterValue !== "\t") return issue("delimiter", "invalid_value", "Choose a supported value.");
  const indicesValue = candidate.indices;
  if (!Array.isArray(indicesValue)) return issue("indices", "invalid_type", "Enter a dense array.");
  if (indicesValue.length < 0) return issue("indices", "out_of_range", "Too few entries.");
  if (indicesValue.length > 10000) return issue("indices", "resource_limit", "Array exceeds the 10000-entry resource limit.");
  const validatedIndices: number[] = [];
  for (let index = 0; index < indicesValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(indicesValue, index)) return issue(`indices.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = indicesValue[index];
    if (typeof item !== "number" || !Number.isSafeInteger(item)) return issue(`indices.${index}`, "invalid_type", "Enter a finite safe integer.");
    if (item < 0) return issue(`indices.${index}`, "out_of_range", "Value is outside the accepted range.");
    validatedIndices.push(item);
  }
  const input: ColumnDropByIndexInput = { csv: csvValue, delimiter: delimiterValue, indices: validatedIndices };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  const width = csvShape(rows);
  if (width === undefined) return issue("csv", "ragged_rows", "All records must have the same field count.");
  if (input.indices.some((index) => index >= width)) return issue("indices", "column_range", "Column index is outside the CSV width.");
  const dropped = new Set(input.indices);
  if (width > 0 && dropped.size === width) return issue("indices", "empty_columns", "At least one column must remain.");
  return toolSuccess({ csv: writeCsvRecords(rows.map((row) => row.filter((_, index) => !dropped.has(index))), input.delimiter) });
};
export const example = {
  input: {
    "csv": "id,name,age\n1,Ada,36",
    "delimiter": ",",
    "indices": [
      2
    ]
  },
  output: {
    "csv": "id,name\n1,Ada"
  },
} satisfies ToolExample<ColumnDropByIndexInput, ColumnDropByIndexOutput>;
export const columnDropByIndexTool = defineTool<ColumnDropByIndexInput, ColumnDropByIndexOutput>({
  id: "csv/column-drop-by-index",
  title: "Column Drop By Index",
  description: "Drop selected zero-based columns from a rectangular CSV, preserving all remaining cells and rejecting removal of every column.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: columnDropByIndexInputSchema,
  outputSchema: columnDropByIndexOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "csv",
        "label": "CSV text",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "delimiter",
        "label": "Delimiter",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "indices",
        "label": "Indices",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "integer"
          }
        }
      }
    ],
    "outputs": [
      {
        "id": "csv",
        "label": "CSV text",
        "valueType": {
          "type": "string"
        }
      }
    ]
  },
  execute: calculateColumnDropByIndex,
});
export const runColumnDropByIndex = columnDropByIndexTool.execute;
export default columnDropByIndexTool;
