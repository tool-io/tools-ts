import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText, csvShape } from "../rfc4180-quoted-field-parser-check/tool.js";
export type HighCardinalityColumnFlaggerInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
  readonly hasHeader: boolean;
  readonly threshold: number;
};
export type HighCardinalityColumnFlaggerOutput = {
  readonly columns: ReadonlyArray<{ readonly column: number; readonly distinctCount: number; readonly observedCount: number; readonly ratio: number; readonly high: boolean; }>;
};
export const highCardinalityColumnFlaggerInputSchema = {
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
    "threshold": {
      "type": "number",
      "minimum": 0,
      "maximum": 1,
      "description": "Threshold"
    }
  },
  "required": [
    "csv",
    "delimiter",
    "hasHeader",
    "threshold"
  ]
} as const satisfies ToolJsonSchema;
export const highCardinalityColumnFlaggerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "columns": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "column": {
            "type": "integer"
          },
          "distinctCount": {
            "type": "integer"
          },
          "observedCount": {
            "type": "integer"
          },
          "ratio": {
            "type": "number"
          },
          "high": {
            "type": "boolean"
          }
        },
        "required": [
          "column",
          "distinctCount",
          "observedCount",
          "ratio",
          "high"
        ]
      },
      "description": "Columns"
    }
  },
  "required": [
    "columns"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateHighCardinalityColumnFlagger = (rawInput: unknown): ToolResult<HighCardinalityColumnFlaggerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly csv?: unknown; readonly delimiter?: unknown; readonly hasHeader?: unknown; readonly threshold?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "csv",
  "delimiter",
  "hasHeader",
  "threshold"
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
  const thresholdValue = candidate.threshold;
  if (typeof thresholdValue !== "number" || !Number.isFinite(thresholdValue)) return issue("threshold", "invalid_type", "Enter a finite number.");
  if (thresholdValue < 0) return issue("threshold", "out_of_range", "Value is outside the accepted range.");
  if (thresholdValue > 1) return issue("threshold", "out_of_range", "Value is outside the accepted range.");
  const input: HighCardinalityColumnFlaggerInput = { csv: csvValue, delimiter: delimiterValue, hasHeader: hasHeaderValue, threshold: thresholdValue };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  const width = csvShape(rows);
  if (width === undefined) return issue("csv", "ragged_rows", "All records must have the same field count.");
  if (input.hasHeader && rows.length === 0) return issue("csv", "missing_header", "A header record is required.");
  const header = input.hasHeader ? rows.slice(0, 1) : [];
  const data = input.hasHeader ? rows.slice(1) : rows;
  const columns = Array.from({ length: width }, (_, column) => {
    const values = data.map((row) => row[column] ?? "").filter((cell) => cell !== "");
    const distinctCount = new Set(values).size;
    const ratio = values.length === 0 ? 0 : distinctCount / values.length;
    return { column, distinctCount, observedCount: values.length, ratio, high: values.length > 0 && ratio > input.threshold };
  });
  return toolSuccess({ columns });
};
export const example = {
  input: {
    "csv": "id,group\n1,A\n2,A",
    "delimiter": ",",
    "hasHeader": true,
    "threshold": 0.75
  },
  output: {
    "columns": [
      {
        "column": 0,
        "distinctCount": 2,
        "observedCount": 2,
        "ratio": 1,
        "high": true
      },
      {
        "column": 1,
        "distinctCount": 1,
        "observedCount": 2,
        "ratio": 0.5,
        "high": false
      }
    ]
  },
} satisfies ToolExample<HighCardinalityColumnFlaggerInput, HighCardinalityColumnFlaggerOutput>;
export const highCardinalityColumnFlaggerTool = defineTool<HighCardinalityColumnFlaggerInput, HighCardinalityColumnFlaggerOutput>({
  id: "csv/high-cardinality-column-flagger",
  title: "High-Cardinality Column Flagger",
  description: "Flag columns whose distinct-to-observed ratio exceeds an explicit threshold, counting exact nonempty data cells and excluding an explicit header; zero observations never flag.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: highCardinalityColumnFlaggerInputSchema,
  outputSchema: highCardinalityColumnFlaggerOutputSchema,
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
        "id": "threshold",
        "label": "Threshold",
        "required": true,
        "valueType": {
          "type": "number"
        }
      }
    ],
    "outputs": [
      {
        "id": "columns",
        "label": "Columns",
        "valueType": {
          "type": "list",
          "items": {
            "type": "object"
          }
        }
      }
    ]
  },
  execute: calculateHighCardinalityColumnFlagger,
});
export const runHighCardinalityColumnFlagger = highCardinalityColumnFlaggerTool.execute;
export default highCardinalityColumnFlaggerTool;
