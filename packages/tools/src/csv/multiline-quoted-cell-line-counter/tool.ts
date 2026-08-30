import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText } from "../rfc4180-quoted-field-parser-check/tool.js";
export type MultilineQuotedCellLineCounterInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
};
export type MultilineQuotedCellLineCounterOutput = {
  readonly cells: ReadonlyArray<{ readonly record: number; readonly column: number; readonly lineCount: number; }>;
};
export const multilineQuotedCellLineCounterInputSchema = {
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
export const multilineQuotedCellLineCounterOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "cells": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "record": {
            "type": "integer"
          },
          "column": {
            "type": "integer"
          },
          "lineCount": {
            "type": "integer"
          }
        },
        "required": [
          "record",
          "column",
          "lineCount"
        ]
      },
      "description": "Cells"
    }
  },
  "required": [
    "cells"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateMultilineQuotedCellLineCounter = (rawInput: unknown): ToolResult<MultilineQuotedCellLineCounterOutput> => {
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
  const input: MultilineQuotedCellLineCounterInput = { csv: csvValue, delimiter: delimiterValue };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  const cells: { record: number; column: number; lineCount: number }[] = [];
  rows.forEach((row, record) => row.forEach((cell, column) => {
    const breaks = cell.match(/\r\n|\r|\n/g) ?? [];
    if (breaks.length > 0) cells.push({ record, column, lineCount: breaks.length + 1 });
  }));
  return toolSuccess({ cells });
};
export const example = {
  input: {
    "csv": "id,note\n1,\"a\r\nb\nc\"",
    "delimiter": ","
  },
  output: {
    "cells": [
      {
        "record": 1,
        "column": 1,
        "lineCount": 3
      }
    ]
  },
} satisfies ToolExample<MultilineQuotedCellLineCounterInput, MultilineQuotedCellLineCounterOutput>;
export const multilineQuotedCellLineCounterTool = defineTool<MultilineQuotedCellLineCounterInput, MultilineQuotedCellLineCounterOutput>({
  id: "csv/multiline-quoted-cell-line-counter",
  title: "Multiline Quoted Cell Line Counter",
  description: "Find decoded CSV cells containing CR or LF and report their one-based line counts, counting CRLF as one break; positions are zero-based record and column indices.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: multilineQuotedCellLineCounterInputSchema,
  outputSchema: multilineQuotedCellLineCounterOutputSchema,
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
        "id": "cells",
        "label": "Cells",
        "valueType": {
          "type": "list",
          "items": {
            "type": "object"
          }
        }
      }
    ]
  },
  execute: calculateMultilineQuotedCellLineCounter,
});
export const runMultilineQuotedCellLineCounter = multilineQuotedCellLineCounterTool.execute;
export default multilineQuotedCellLineCounterTool;
