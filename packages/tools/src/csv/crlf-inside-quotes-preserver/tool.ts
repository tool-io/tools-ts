import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText } from "../rfc4180-quoted-field-parser-check/tool.js";
export type CrlfInsideQuotesPreserverInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
  readonly recordEnding: "LF" | "CRLF";
};
export type CrlfInsideQuotesPreserverOutput = {
  readonly csv: string;
};
export const crlfInsideQuotesPreserverInputSchema = {
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
    "recordEnding": {
      "type": "string",
      "enum": [
        "LF",
        "CRLF"
      ],
      "description": "Record ending"
    }
  },
  "required": [
    "csv",
    "delimiter",
    "recordEnding"
  ]
} as const satisfies ToolJsonSchema;
export const crlfInsideQuotesPreserverOutputSchema = {
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
export const calculateCrlfInsideQuotesPreserver = (rawInput: unknown): ToolResult<CrlfInsideQuotesPreserverOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly csv?: unknown; readonly delimiter?: unknown; readonly recordEnding?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "csv",
  "delimiter",
  "recordEnding"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const csvValue = candidate.csv;
  if (typeof csvValue !== "string") return issue("csv", "invalid_type", "Enter a string value.");
  if (csvValue.length > 100000) return issue("csv", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const delimiterValue = candidate.delimiter;
  if (typeof delimiterValue !== "string") return issue("delimiter", "invalid_type", "Enter a string value.");
  if (delimiterValue !== "," && delimiterValue !== ";" && delimiterValue !== "\t") return issue("delimiter", "invalid_value", "Choose a supported value.");
  const recordEndingValue = candidate.recordEnding;
  if (typeof recordEndingValue !== "string") return issue("recordEnding", "invalid_type", "Enter a string value.");
  if (recordEndingValue !== "LF" && recordEndingValue !== "CRLF") return issue("recordEnding", "invalid_value", "Choose a supported value.");
  const input: CrlfInsideQuotesPreserverInput = { csv: csvValue, delimiter: delimiterValue, recordEnding: recordEndingValue };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  const ending = input.recordEnding === "LF" ? "\n" : "\r\n";
  return toolSuccess({ csv: parsed.rawRecords.join(ending) + (parsed.hasTerminalBreak ? ending : "") });
};
export const example = {
  input: {
    "csv": "a,b\r\n\"x\r\ny\",z\r\n",
    "delimiter": ",",
    "recordEnding": "LF"
  },
  output: {
    "csv": "a,b\n\"x\r\ny\",z\n"
  },
} satisfies ToolExample<CrlfInsideQuotesPreserverInput, CrlfInsideQuotesPreserverOutput>;
export const crlfInsideQuotesPreserverTool = defineTool<CrlfInsideQuotesPreserverInput, CrlfInsideQuotesPreserverOutput>({
  id: "csv/crlf-inside-quotes-preserver",
  title: "CRLF Inside Quotes Preserver",
  description: "Normalize only CSV record endings to LF or CRLF while preserving quoted cell bytes and whether the document had a terminal record ending.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: crlfInsideQuotesPreserverInputSchema,
  outputSchema: crlfInsideQuotesPreserverOutputSchema,
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
        "id": "recordEnding",
        "label": "Record ending",
        "required": true,
        "valueType": {
          "type": "string"
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
  execute: calculateCrlfInsideQuotesPreserver,
});
export const runCrlfInsideQuotesPreserver = crlfInsideQuotesPreserverTool.execute;
export default crlfInsideQuotesPreserverTool;
