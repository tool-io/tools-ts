import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText, writeCsvRecords } from "../rfc4180-quoted-field-parser-check/tool.js";
export type RowHeadTailSliceNInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
  readonly hasHeader: boolean;
  readonly side: "head" | "tail";
  readonly count: number;
};
export type RowHeadTailSliceNOutput = {
  readonly csv: string;
};
export const rowHeadTailSliceNInputSchema = {
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
    "side": {
      "type": "string",
      "enum": [
        "head",
        "tail"
      ],
      "description": "Side"
    },
    "count": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Count"
    }
  },
  "required": [
    "csv",
    "delimiter",
    "hasHeader",
    "side",
    "count"
  ]
} as const satisfies ToolJsonSchema;
export const rowHeadTailSliceNOutputSchema = {
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
export const calculateRowHeadTailSliceN = (rawInput: unknown): ToolResult<RowHeadTailSliceNOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly csv?: unknown; readonly delimiter?: unknown; readonly hasHeader?: unknown; readonly side?: unknown; readonly count?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "csv",
  "delimiter",
  "hasHeader",
  "side",
  "count"
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
  const sideValue = candidate.side;
  if (typeof sideValue !== "string") return issue("side", "invalid_type", "Enter a string value.");
  if (sideValue !== "head" && sideValue !== "tail") return issue("side", "invalid_value", "Choose a supported value.");
  const countValue = candidate.count;
  if (typeof countValue !== "number" || !Number.isSafeInteger(countValue)) return issue("count", "invalid_type", "Enter a finite safe integer.");
  if (countValue < 0) return issue("count", "out_of_range", "Value is outside the accepted range.");
  if (countValue > 9007199254740991) return issue("count", "out_of_range", "Value is outside the accepted range.");
  const input: RowHeadTailSliceNInput = { csv: csvValue, delimiter: delimiterValue, hasHeader: hasHeaderValue, side: sideValue, count: countValue };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  if (input.hasHeader && rows.length === 0) return issue("csv", "missing_header", "A header record is required.");
  const header = input.hasHeader ? rows.slice(0, 1) : [];
  const data = input.hasHeader ? rows.slice(1) : rows;
  const selected = input.count === 0 ? [] : input.side === "head" ? data.slice(0, input.count) : data.slice(Math.max(0, data.length - input.count));
  return toolSuccess({ csv: writeCsvRecords([...header, ...selected], input.delimiter) });
};
export const example = {
  input: {
    "csv": "name\nAda\nGrace\nKatherine",
    "delimiter": ",",
    "hasHeader": true,
    "side": "tail",
    "count": 2
  },
  output: {
    "csv": "name\nGrace\nKatherine"
  },
} satisfies ToolExample<RowHeadTailSliceNInput, RowHeadTailSliceNOutput>;
export const rowHeadTailSliceNTool = defineTool<RowHeadTailSliceNInput, RowHeadTailSliceNOutput>({
  id: "csv/row-head-tail-slice-n",
  title: "Row Head/Tail Slice N",
  description: "Take the first or last N CSV data records in their original order, retaining an explicitly declared header and treating quoted multiline cells as one record.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: rowHeadTailSliceNInputSchema,
  outputSchema: rowHeadTailSliceNOutputSchema,
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
        "id": "side",
        "label": "Side",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "count",
        "label": "Count",
        "required": true,
        "valueType": {
          "type": "integer"
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
  execute: calculateRowHeadTailSliceN,
});
export const runRowHeadTailSliceN = rowHeadTailSliceNTool.execute;
export default rowHeadTailSliceNTool;
