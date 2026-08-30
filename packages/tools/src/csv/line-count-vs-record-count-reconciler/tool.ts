import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText } from "../rfc4180-quoted-field-parser-check/tool.js";
export type LineCountVsRecordCountReconcilerInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
};
export type LineCountVsRecordCountReconcilerOutput = {
  readonly physicalLineCount: number;
  readonly recordCount: number;
  readonly embeddedBreakCount: number;
};
export const lineCountVsRecordCountReconcilerInputSchema = {
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
    }
  },
  "required": [
    "csv",
    "delimiter"
  ]
} as const satisfies ToolJsonSchema;
export const lineCountVsRecordCountReconcilerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "physicalLineCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Physical line count"
    },
    "recordCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Record count"
    },
    "embeddedBreakCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Embedded break count"
    }
  },
  "required": [
    "physicalLineCount",
    "recordCount",
    "embeddedBreakCount"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateLineCountVsRecordCountReconciler = (rawInput: unknown): ToolResult<LineCountVsRecordCountReconcilerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly csv?: unknown; readonly delimiter?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "csv",
  "delimiter"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const csvValue = candidate.csv;
  if (typeof csvValue !== "string") return issue("csv", "invalid_type", "Enter a string value.");
  if (csvValue.length > 100000) return issue("csv", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const delimiterValue = candidate.delimiter;
  if (typeof delimiterValue !== "string") return issue("delimiter", "invalid_type", "Enter a string value.");
  if (delimiterValue !== "," && delimiterValue !== ";" && delimiterValue !== "\t") return issue("delimiter", "invalid_value", "Choose a supported value.");
  const input: LineCountVsRecordCountReconcilerInput = { csv: csvValue, delimiter: delimiterValue };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  const breaks = input.csv.match(/\r\n|\r|\n/g) ?? [];
  const physicalLineCount = input.csv === "" ? 0 : breaks.length + (/[\r\n]$/.test(input.csv) ? 0 : 1);
  return toolSuccess({ physicalLineCount, recordCount: rows.length, embeddedBreakCount: physicalLineCount - rows.length });
};
export const example = {
  input: {
    "csv": "a,b\n\"x\ny\",z\n",
    "delimiter": ","
  },
  output: {
    "physicalLineCount": 3,
    "recordCount": 2,
    "embeddedBreakCount": 1
  },
} satisfies ToolExample<LineCountVsRecordCountReconcilerInput, LineCountVsRecordCountReconcilerOutput>;
export const lineCountVsRecordCountReconcilerTool = defineTool<LineCountVsRecordCountReconcilerInput, LineCountVsRecordCountReconcilerOutput>({
  id: "csv/line-count-vs-record-count-reconciler",
  title: "Line Count vs Record Count Reconciler",
  description: "Compare physical CSV line count with logical record count, treating CRLF as one break and a terminal ending as no extra line; embedded quoted breaks explain the excess physical lines.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: lineCountVsRecordCountReconcilerInputSchema,
  outputSchema: lineCountVsRecordCountReconcilerOutputSchema,
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
      }
    ],
    "outputs": [
      {
        "id": "physicalLineCount",
        "label": "Physical line count",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "recordCount",
        "label": "Record count",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "embeddedBreakCount",
        "label": "Embedded break count",
        "valueType": {
          "type": "integer"
        }
      }
    ]
  },
  execute: calculateLineCountVsRecordCountReconciler,
});
export const runLineCountVsRecordCountReconciler = lineCountVsRecordCountReconcilerTool.execute;
export default lineCountVsRecordCountReconcilerTool;
