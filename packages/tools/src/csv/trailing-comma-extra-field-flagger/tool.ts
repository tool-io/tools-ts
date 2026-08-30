import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText } from "../rfc4180-quoted-field-parser-check/tool.js";
export type TrailingCommaExtraFieldFlaggerInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
};
export type TrailingCommaExtraFieldFlaggerOutput = {
  readonly recordIndices: ReadonlyArray<number>;
};
export const trailingCommaExtraFieldFlaggerInputSchema = {
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
export const trailingCommaExtraFieldFlaggerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
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
    "recordIndices"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateTrailingCommaExtraFieldFlagger = (rawInput: unknown): ToolResult<TrailingCommaExtraFieldFlaggerOutput> => {
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
  const input: TrailingCommaExtraFieldFlaggerInput = { csv: csvValue, delimiter: delimiterValue };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  const recordIndices = parsed.rawRecords.flatMap((record, index) => record.endsWith(input.delimiter) ? [index] : []);
  return toolSuccess({ recordIndices });
};
export const example = {
  input: {
    "csv": "a,b,\n\"x,\",y",
    "delimiter": ","
  },
  output: {
    "recordIndices": [
      0
    ]
  },
} satisfies ToolExample<TrailingCommaExtraFieldFlaggerInput, TrailingCommaExtraFieldFlaggerOutput>;
export const trailingCommaExtraFieldFlaggerTool = defineTool<TrailingCommaExtraFieldFlaggerInput, TrailingCommaExtraFieldFlaggerOutput>({
  id: "csv/trailing-comma-extra-field-flagger",
  title: "Trailing Comma Extra Field Flagger",
  description: "Find zero-based CSV record indices ending in an unquoted delimiter, indicating an empty final field; delimiters inside quoted cells are excluded.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: trailingCommaExtraFieldFlaggerInputSchema,
  outputSchema: trailingCommaExtraFieldFlaggerOutputSchema,
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
  execute: calculateTrailingCommaExtraFieldFlagger,
});
export const runTrailingCommaExtraFieldFlagger = trailingCommaExtraFieldFlaggerTool.execute;
export default trailingCommaExtraFieldFlaggerTool;
