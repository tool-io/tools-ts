import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText } from "../rfc4180-quoted-field-parser-check/tool.js";
export type RaggedRowsWrongFieldCountFinderInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
  readonly expectedColumns: number;
};
export type RaggedRowsWrongFieldCountFinderOutput = {
  readonly consistent: boolean;
  readonly recordIndices: ReadonlyArray<number>;
};
export const raggedRowsWrongFieldCountFinderInputSchema = {
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
    "expectedColumns": {
      "type": "integer",
      "minimum": 1,
      "maximum": 9007199254740991,
      "description": "Expected columns"
    }
  },
  "required": [
    "csv",
    "delimiter",
    "expectedColumns"
  ]
} as const satisfies ToolJsonSchema;
export const raggedRowsWrongFieldCountFinderOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "consistent": {
      "type": "boolean",
      "description": "Consistent"
    },
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
    "consistent",
    "recordIndices"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateRaggedRowsWrongFieldCountFinder = (rawInput: unknown): ToolResult<RaggedRowsWrongFieldCountFinderOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly csv?: unknown; readonly delimiter?: unknown; readonly expectedColumns?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "csv",
  "delimiter",
  "expectedColumns"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const csvValue = candidate.csv;
  if (typeof csvValue !== "string") return issue("csv", "invalid_type", "Enter a string value.");
  if (csvValue.length > 100000) return issue("csv", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const delimiterValue = candidate.delimiter;
  if (typeof delimiterValue !== "string") return issue("delimiter", "invalid_type", "Enter a string value.");
  if (delimiterValue !== "," && delimiterValue !== ";" && delimiterValue !== "\t") return issue("delimiter", "invalid_value", "Choose a supported value.");
  const expectedColumnsValue = candidate.expectedColumns;
  if (typeof expectedColumnsValue !== "number" || !Number.isSafeInteger(expectedColumnsValue)) return issue("expectedColumns", "invalid_type", "Enter a finite safe integer.");
  if (expectedColumnsValue < 1) return issue("expectedColumns", "out_of_range", "Value is outside the accepted range.");
  if (expectedColumnsValue > 9007199254740991) return issue("expectedColumns", "out_of_range", "Value is outside the accepted range.");
  const input: RaggedRowsWrongFieldCountFinderInput = { csv: csvValue, delimiter: delimiterValue, expectedColumns: expectedColumnsValue };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  const recordIndices = rows.flatMap((row, index) => row.length === input.expectedColumns ? [] : [index]);
  return toolSuccess({ consistent: recordIndices.length === 0, recordIndices });
};
export const example = {
  input: {
    "csv": "a,b\nc\nd,e,f",
    "delimiter": ",",
    "expectedColumns": 2
  },
  output: {
    "consistent": false,
    "recordIndices": [
      1,
      2
    ]
  },
} satisfies ToolExample<RaggedRowsWrongFieldCountFinderInput, RaggedRowsWrongFieldCountFinderOutput>;
export const raggedRowsWrongFieldCountFinderTool = defineTool<RaggedRowsWrongFieldCountFinderInput, RaggedRowsWrongFieldCountFinderOutput>({
  id: "csv/ragged-rows-wrong-field-count-finder",
  title: "Ragged Rows Wrong-Field-Count Finder",
  description: "Report CSV records whose decoded field count differs from an explicit expected width, including header and blank records; indices are zero-based records, not lines.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: raggedRowsWrongFieldCountFinderInputSchema,
  outputSchema: raggedRowsWrongFieldCountFinderOutputSchema,
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
        "id": "expectedColumns",
        "label": "Expected columns",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      }
    ],
    "outputs": [
      {
        "id": "consistent",
        "label": "Consistent",
        "valueType": {
          "type": "boolean"
        }
      },
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
  execute: calculateRaggedRowsWrongFieldCountFinder,
});
export const runRaggedRowsWrongFieldCountFinder = raggedRowsWrongFieldCountFinderTool.execute;
export default raggedRowsWrongFieldCountFinderTool;
