import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText, csvShape } from "../rfc4180-quoted-field-parser-check/tool.js";
import { parseDecimal } from "../currency-symbol-strip-to-number/tool.js";
export type HeaderRowDetectionHeuristicInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
};
export type HeaderRowDetectionHeuristicOutput = {
  readonly likelyHeader: boolean;
  readonly evidenceColumns: number;
  readonly columnCount: number;
};
export const headerRowDetectionHeuristicInputSchema = {
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
export const headerRowDetectionHeuristicOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "likelyHeader": {
      "type": "boolean",
      "description": "Likely header"
    },
    "evidenceColumns": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Evidence columns"
    },
    "columnCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Column count"
    }
  },
  "required": [
    "likelyHeader",
    "evidenceColumns",
    "columnCount"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateHeaderRowDetectionHeuristic = (rawInput: unknown): ToolResult<HeaderRowDetectionHeuristicOutput> => {
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
  const input: HeaderRowDetectionHeuristicInput = { csv: csvValue, delimiter: delimiterValue };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  const width = csvShape(rows);
  if (width === undefined) return issue("csv", "ragged_rows", "All records must have the same field count.");
  const first = rows[0] ?? [];
  const data = rows.slice(1);
  const uniqueLabels = first.every((cell) => cell.trim() !== "") && new Set(first).size === first.length;
  let evidenceColumns = 0;
  for (let column = 0; column < width; column++) {
    const values = data.map((row) => row[column] ?? "").filter((cell) => cell.trim() !== "");
    if (parseDecimal(first[column] ?? "") === undefined && values.length > 0 && values.every((cell) => parseDecimal(cell) !== undefined)) evidenceColumns++;
  }
  return toolSuccess({ likelyHeader: width > 0 && uniqueLabels && evidenceColumns >= Math.ceil(width / 2), evidenceColumns, columnCount: width });
};
export const example = {
  input: {
    "csv": "name,age\nAda,36\nGrace,85",
    "delimiter": ","
  },
  output: {
    "likelyHeader": true,
    "evidenceColumns": 1,
    "columnCount": 2
  },
} satisfies ToolExample<HeaderRowDetectionHeuristicInput, HeaderRowDetectionHeuristicOutput>;
export const headerRowDetectionHeuristicTool = defineTool<HeaderRowDetectionHeuristicInput, HeaderRowDetectionHeuristicOutput>({
  id: "csv/header-row-detection-heuristic",
  title: "Header Row Detection Heuristic",
  description: "Flag a possible header when its labels are unique and nonempty and at least half of columns have text labels above consistently numeric values; this is an explicit heuristic.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: headerRowDetectionHeuristicInputSchema,
  outputSchema: headerRowDetectionHeuristicOutputSchema,
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
        "id": "likelyHeader",
        "label": "Likely header",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "evidenceColumns",
        "label": "Evidence columns",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "columnCount",
        "label": "Column count",
        "valueType": {
          "type": "integer"
        }
      }
    ]
  },
  execute: calculateHeaderRowDetectionHeuristic,
});
export const runHeaderRowDetectionHeuristic = headerRowDetectionHeuristicTool.execute;
export default headerRowDetectionHeuristicTool;
