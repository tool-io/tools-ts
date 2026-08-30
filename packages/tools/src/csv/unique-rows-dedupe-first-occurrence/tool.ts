import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText, writeCsvRecords } from "../rfc4180-quoted-field-parser-check/tool.js";
export type UniqueRowsDedupeFirstOccurrenceInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
  readonly hasHeader: boolean;
};
export type UniqueRowsDedupeFirstOccurrenceOutput = {
  readonly csv: string;
  readonly removedCount: number;
};
export const uniqueRowsDedupeFirstOccurrenceInputSchema = {
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
export const uniqueRowsDedupeFirstOccurrenceOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "csv": {
      "type": "string",
      "description": "CSV text"
    },
    "removedCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Removed count"
    }
  },
  "required": [
    "csv",
    "removedCount"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateUniqueRowsDedupeFirstOccurrence = (rawInput: unknown): ToolResult<UniqueRowsDedupeFirstOccurrenceOutput> => {
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
  const input: UniqueRowsDedupeFirstOccurrenceInput = { csv: csvValue, delimiter: delimiterValue, hasHeader: hasHeaderValue };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  if (input.hasHeader && rows.length === 0) return issue("csv", "missing_header", "A header record is required.");
  const header = input.hasHeader ? rows.slice(0, 1) : [];
  const data = input.hasHeader ? rows.slice(1) : rows;
  const seen = new Set<string>();
  const unique = data.filter((row) => { const key = JSON.stringify(row); if (seen.has(key)) return false; seen.add(key); return true; });
  return toolSuccess({ csv: writeCsvRecords([...header, ...unique], input.delimiter), removedCount: data.length - unique.length });
};
export const example = {
  input: {
    "csv": "name,age\nAda,36\nGrace,85\nAda,36",
    "delimiter": ",",
    "hasHeader": true
  },
  output: {
    "csv": "name,age\nAda,36\nGrace,85",
    "removedCount": 1
  },
} satisfies ToolExample<UniqueRowsDedupeFirstOccurrenceInput, UniqueRowsDedupeFirstOccurrenceOutput>;
export const uniqueRowsDedupeFirstOccurrenceTool = defineTool<UniqueRowsDedupeFirstOccurrenceInput, UniqueRowsDedupeFirstOccurrenceOutput>({
  id: "csv/unique-rows-dedupe-first-occurrence",
  title: "Unique Rows Dedupe First Occurrence",
  description: "Remove exact duplicate decoded CSV records after an optional header, retaining first occurrences and their original order; cell boundaries remain significant.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: uniqueRowsDedupeFirstOccurrenceInputSchema,
  outputSchema: uniqueRowsDedupeFirstOccurrenceOutputSchema,
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
        "id": "removedCount",
        "label": "Removed count",
        "valueType": {
          "type": "integer"
        }
      }
    ]
  },
  execute: calculateUniqueRowsDedupeFirstOccurrence,
});
export const runUniqueRowsDedupeFirstOccurrence = uniqueRowsDedupeFirstOccurrenceTool.execute;
export default uniqueRowsDedupeFirstOccurrenceTool;
