import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText, writeCsvRecords } from "../rfc4180-quoted-field-parser-check/tool.js";
export type DuplicateRowsExtractorInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
  readonly hasHeader: boolean;
};
export type DuplicateRowsExtractorOutput = {
  readonly csv: string;
  readonly duplicateRowCount: number;
};
export const duplicateRowsExtractorInputSchema = {
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
    }
  },
  "required": [
    "csv",
    "delimiter",
    "hasHeader"
  ]
} as const satisfies ToolJsonSchema;
export const duplicateRowsExtractorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "csv": {
      "type": "string",
      "description": "CSV text"
    },
    "duplicateRowCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Duplicate row count"
    }
  },
  "required": [
    "csv",
    "duplicateRowCount"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateDuplicateRowsExtractor = (rawInput: unknown): ToolResult<DuplicateRowsExtractorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly csv?: unknown; readonly delimiter?: unknown; readonly hasHeader?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "csv",
  "delimiter",
  "hasHeader"
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
  const input: DuplicateRowsExtractorInput = { csv: csvValue, delimiter: delimiterValue, hasHeader: hasHeaderValue };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  if (input.hasHeader && rows.length === 0) return issue("csv", "missing_header", "A header record is required.");
  const header = input.hasHeader ? rows.slice(0, 1) : [];
  const data = input.hasHeader ? rows.slice(1) : rows;
  const counts = new Map<string, number>();
  for (const row of data) { const key = JSON.stringify(row); counts.set(key, (counts.get(key) ?? 0) + 1); }
  const duplicates = data.filter((row) => (counts.get(JSON.stringify(row)) ?? 0) > 1);
  return toolSuccess({ csv: writeCsvRecords([...header, ...duplicates], input.delimiter), duplicateRowCount: duplicates.length });
};
export const example = {
  input: {
    "csv": "name\nAda\nGrace\nAda",
    "delimiter": ",",
    "hasHeader": true
  },
  output: {
    "csv": "name\nAda\nAda",
    "duplicateRowCount": 2
  },
} satisfies ToolExample<DuplicateRowsExtractorInput, DuplicateRowsExtractorOutput>;
export const duplicateRowsExtractorTool = defineTool<DuplicateRowsExtractorInput, DuplicateRowsExtractorOutput>({
  id: "csv/duplicate-rows-extractor",
  title: "Duplicate Rows Extractor",
  description: "Extract every CSV data record whose exact decoded row occurs more than once, retaining all members of duplicate groups in original order and preserving an optional header.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: duplicateRowsExtractorInputSchema,
  outputSchema: duplicateRowsExtractorOutputSchema,
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
        "id": "duplicateRowCount",
        "label": "Duplicate row count",
        "valueType": {
          "type": "integer"
        }
      }
    ]
  },
  execute: calculateDuplicateRowsExtractor,
});
export const runDuplicateRowsExtractor = duplicateRowsExtractorTool.execute;
export default duplicateRowsExtractorTool;
