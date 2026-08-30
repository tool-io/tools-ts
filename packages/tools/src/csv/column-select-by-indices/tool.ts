import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText, writeCsvRecords, csvShape } from "../rfc4180-quoted-field-parser-check/tool.js";
export type ColumnSelectByIndicesInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
  readonly indices: ReadonlyArray<number>;
};
export type ColumnSelectByIndicesOutput = {
  readonly csv: string;
};
export const columnSelectByIndicesInputSchema = {
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
      "minItems": 1,
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
export const columnSelectByIndicesOutputSchema = {
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
export const calculateColumnSelectByIndices = (rawInput: unknown): ToolResult<ColumnSelectByIndicesOutput> => {
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
  if (indicesValue.length < 1) return issue("indices", "out_of_range", "Too few entries.");
  if (indicesValue.length > 10000) return issue("indices", "resource_limit", "Array exceeds the 10000-entry resource limit.");
  const validatedIndices: number[] = [];
  for (let index = 0; index < indicesValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(indicesValue, index)) return issue(`indices.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = indicesValue[index];
    if (typeof item !== "number" || !Number.isSafeInteger(item)) return issue(`indices.${index}`, "invalid_type", "Enter a finite safe integer.");
    if (item < 0) return issue(`indices.${index}`, "out_of_range", "Value is outside the accepted range.");
    validatedIndices.push(item);
  }
  const input: ColumnSelectByIndicesInput = { csv: csvValue, delimiter: delimiterValue, indices: validatedIndices };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  const width = csvShape(rows);
  if (width === undefined) return issue("csv", "ragged_rows", "All records must have the same field count.");
  if (input.indices.some((index) => index >= width)) return issue("indices", "column_range", "Column index is outside the CSV width.");
  if (rows.length * input.indices.length > 10000) return issue("indices", "resource_limit", "Selected output may contain at most 10,000 fields.");
  let selectedLength = 0;
  for (const row of rows) for (const index of input.indices) selectedLength += row[index]?.length ?? 0;
  if (selectedLength > 100000) return issue("indices", "resource_limit", "Selected cell text exceeds 100,000 UTF-16 code units.");
  return toolSuccess({ csv: writeCsvRecords(rows.map((row) => input.indices.map((index) => row[index] ?? "")), input.delimiter) });
};
export const example = {
  input: {
    "csv": "id,name,age\n1,Ada,36",
    "delimiter": ",",
    "indices": [
      1,
      0
    ]
  },
  output: {
    "csv": "name,id\nAda,1"
  },
} satisfies ToolExample<ColumnSelectByIndicesInput, ColumnSelectByIndicesOutput>;
export const columnSelectByIndicesTool = defineTool<ColumnSelectByIndicesInput, ColumnSelectByIndicesOutput>({
  id: "csv/column-select-by-indices",
  title: "Column Select By Indices",
  description: "Select and reorder zero-based columns from a rectangular CSV, allowing repeated selections while requiring at least one output column.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: columnSelectByIndicesInputSchema,
  outputSchema: columnSelectByIndicesOutputSchema,
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
  execute: calculateColumnSelectByIndices,
});
export const runColumnSelectByIndices = columnSelectByIndicesTool.execute;
export default columnSelectByIndicesTool;
