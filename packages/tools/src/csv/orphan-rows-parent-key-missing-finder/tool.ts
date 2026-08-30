import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText, writeCsvRecords, csvShape } from "../rfc4180-quoted-field-parser-check/tool.js";
export type OrphanRowsParentKeyMissingFinderInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
  readonly hasHeader: boolean;
  readonly column: number;
  readonly parentKeys: ReadonlyArray<string>;
};
export type OrphanRowsParentKeyMissingFinderOutput = {
  readonly csv: string;
  readonly recordIndices: ReadonlyArray<number>;
};
export const orphanRowsParentKeyMissingFinderInputSchema = {
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
    "hasHeader": {
      "type": "boolean",
      "description": "Has header"
    },
    "column": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Column"
    },
    "parentKeys": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Parent keys"
    }
  },
  "required": [
    "csv",
    "delimiter",
    "hasHeader",
    "column",
    "parentKeys"
  ]
} as const satisfies ToolJsonSchema;
export const orphanRowsParentKeyMissingFinderOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "csv": {
      "type": "string",
      "description": "CSV text"
    },
    "recordIndices": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 0
      },
      "description": "Record indices"
    }
  },
  "required": [
    "csv",
    "recordIndices"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateOrphanRowsParentKeyMissingFinder = (rawInput: unknown): ToolResult<OrphanRowsParentKeyMissingFinderOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly csv?: unknown; readonly delimiter?: unknown; readonly hasHeader?: unknown; readonly column?: unknown; readonly parentKeys?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "csv",
  "delimiter",
  "hasHeader",
  "column",
  "parentKeys"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const csvValue = candidate.csv;
  if (typeof csvValue !== "string") return issue("csv", "invalid_type", "Enter a string value.");
  if (csvValue.length > 100000) return issue("csv", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const delimiterValue = candidate.delimiter;
  if (typeof delimiterValue !== "string") return issue("delimiter", "invalid_type", "Enter a string value.");
  if (delimiterValue !== "," && delimiterValue !== ";" && delimiterValue !== "\t") return issue("delimiter", "invalid_value", "Choose a supported value.");
  const hasHeaderValue = candidate.hasHeader;
  if (typeof hasHeaderValue !== "boolean") return issue("hasHeader", "invalid_type", "Enter a boolean value.");
  const columnValue = candidate.column;
  if (typeof columnValue !== "number" || !Number.isSafeInteger(columnValue)) return issue("column", "invalid_type", "Enter a finite safe integer.");
  if (columnValue < 0) return issue("column", "out_of_range", "Value is outside the accepted range.");
  if (columnValue > 9007199254740991) return issue("column", "out_of_range", "Value is outside the accepted range.");
  const parentKeysValue = candidate.parentKeys;
  if (!Array.isArray(parentKeysValue)) return issue("parentKeys", "invalid_type", "Enter a dense array.");
  if (parentKeysValue.length < 0) return issue("parentKeys", "out_of_range", "Too few entries.");
  if (parentKeysValue.length > 10000) return issue("parentKeys", "resource_limit", "Array exceeds the 10000-entry resource limit.");
  const validatedParentkeys: string[] = [];
  for (let index = 0; index < parentKeysValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(parentKeysValue, index)) return issue(`parentKeys.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = parentKeysValue[index];
    if (typeof item !== "string") return issue(`parentKeys.${index}`, "invalid_type", "Enter a string value.");
    if (item.length > 10000) return issue(`parentKeys.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
    validatedParentkeys.push(item);
  }
  if (validatedParentkeys.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("parentKeys", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
  const input: OrphanRowsParentKeyMissingFinderInput = { csv: csvValue, delimiter: delimiterValue, hasHeader: hasHeaderValue, column: columnValue, parentKeys: validatedParentkeys };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  const width = csvShape(rows);
  if (width === undefined) return issue("csv", "ragged_rows", "All records must have the same field count.");
  if (input.hasHeader && rows.length === 0) return issue("csv", "missing_header", "A header record is required.");
  const header = input.hasHeader ? rows.slice(0, 1) : [];
  const data = input.hasHeader ? rows.slice(1) : rows;
  if (input.column >= width) return issue("column", "column_range", "Column index is outside the CSV width.");
  const parents = new Set(input.parentKeys);
  const orphanRows: ReadonlyArray<string>[] = [];
  const recordIndices: number[] = [];
  data.forEach((row, index) => { if (!parents.has(row[input.column] ?? "")) { orphanRows.push(row); recordIndices.push(index + header.length); } });
  return toolSuccess({ csv: writeCsvRecords([...header, ...orphanRows], input.delimiter), recordIndices });
};
export const example = {
  input: {
    "csv": "id,name\na,Ada\nc,Grace",
    "delimiter": ",",
    "hasHeader": true,
    "column": 0,
    "parentKeys": [
      "a",
      "b"
    ]
  },
  output: {
    "csv": "id,name\nc,Grace",
    "recordIndices": [
      2
    ]
  },
} satisfies ToolExample<OrphanRowsParentKeyMissingFinderInput, OrphanRowsParentKeyMissingFinderOutput>;
export const orphanRowsParentKeyMissingFinderTool = defineTool<OrphanRowsParentKeyMissingFinderInput, OrphanRowsParentKeyMissingFinderOutput>({
  id: "csv/orphan-rows-parent-key-missing-finder",
  title: "Orphan Rows Missing Parent Key Finder",
  description: "Extract CSV data records whose selected exact string key is absent from a supplied parent-key set, preserving an explicit header and reporting original zero-based record indices.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: orphanRowsParentKeyMissingFinderInputSchema,
  outputSchema: orphanRowsParentKeyMissingFinderOutputSchema,
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
        "id": "hasHeader",
        "label": "Has header",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "column",
        "label": "Column",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "parentKeys",
        "label": "Parent keys",
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
        "id": "csv",
        "label": "CSV text",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "recordIndices",
        "label": "Record indices",
        "valueType": {
          "type": "list",
          "items": {
            "type": "integer"
          }
        }
      }
    ]
  },
  execute: calculateOrphanRowsParentKeyMissingFinder,
});
export const runOrphanRowsParentKeyMissingFinder = orphanRowsParentKeyMissingFinderTool.execute;
export default orphanRowsParentKeyMissingFinderTool;
