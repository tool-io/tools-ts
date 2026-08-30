import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText, csvShape } from "../rfc4180-quoted-field-parser-check/tool.js";
import { cellTokenType } from "../column-type-inference-sample-int-float-string/tool.js";
export type MixedTypeColumnDetectorSamplesInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
  readonly hasHeader: boolean;
};
export type MixedTypeColumnDetectorSamplesOutput = {
  readonly columns: ReadonlyArray<{ readonly column: number; readonly types: ReadonlyArray<string>; readonly mixed: boolean; }>;
};
export const mixedTypeColumnDetectorSamplesInputSchema = {
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
export const mixedTypeColumnDetectorSamplesOutputSchema = {
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
          "types": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "mixed": {
            "type": "boolean"
          }
        },
        "required": [
          "column",
          "types",
          "mixed"
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
export const calculateMixedTypeColumnDetectorSamples = (rawInput: unknown): ToolResult<MixedTypeColumnDetectorSamplesOutput> => {
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
  const input: MixedTypeColumnDetectorSamplesInput = { csv: csvValue, delimiter: delimiterValue, hasHeader: hasHeaderValue };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  const width = csvShape(rows);
  if (width === undefined) return issue("csv", "ragged_rows", "All records must have the same field count.");
  if (input.hasHeader && rows.length === 0) return issue("csv", "missing_header", "A header record is required.");
  const header = input.hasHeader ? rows.slice(0, 1) : [];
  const data = input.hasHeader ? rows.slice(1) : rows;
  const columns = Array.from({ length: width }, (_, column) => {
    const types = [...new Set(data.map((row) => cellTokenType(row[column] ?? "")).filter((type) => type !== "empty"))];
    return { column, types, mixed: types.length > 1 };
  });
  return toolSuccess({ columns });
};
export const example = {
  input: {
    "csv": "id,amount\na,1\nb,2.5\nc,?",
    "delimiter": ",",
    "hasHeader": true
  },
  output: {
    "columns": [
      {
        "column": 0,
        "types": [
          "text"
        ],
        "mixed": false
      },
      {
        "column": 1,
        "types": [
          "integer",
          "decimal",
          "text"
        ],
        "mixed": true
      }
    ]
  },
} satisfies ToolExample<MixedTypeColumnDetectorSamplesInput, MixedTypeColumnDetectorSamplesOutput>;
export const mixedTypeColumnDetectorSamplesTool = defineTool<MixedTypeColumnDetectorSamplesInput, MixedTypeColumnDetectorSamplesOutput>({
  id: "csv/mixed-type-column-detector-samples",
  title: "Mixed-Type Column Detector Samples",
  description: "Report observed nonblank ASCII token classes per CSV data column and whether more than one occurs; integer and decimal spellings are distinct classes even when inference can promote both to decimal.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: mixedTypeColumnDetectorSamplesInputSchema,
  outputSchema: mixedTypeColumnDetectorSamplesOutputSchema,
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
  execute: calculateMixedTypeColumnDetectorSamples,
});
export const runMixedTypeColumnDetectorSamples = mixedTypeColumnDetectorSamplesTool.execute;
export default mixedTypeColumnDetectorSamplesTool;
