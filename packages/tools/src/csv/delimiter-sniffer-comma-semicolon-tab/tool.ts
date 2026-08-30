import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText } from "../rfc4180-quoted-field-parser-check/tool.js";
export type DelimiterSnifferCommaSemicolonTabInput = {
  readonly csv: string;
};
export type DelimiterSnifferCommaSemicolonTabOutput = {
  readonly delimiter: string;
  readonly ambiguous: boolean;
  readonly candidates: ReadonlyArray<{ readonly delimiter: string; readonly modalWidth: number; readonly matchingRecords: number; readonly recordCount: number; }>;
};
export const delimiterSnifferCommaSemicolonTabInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "csv": {
      "type": "string",
      "maxLength": 100000,
      "description": "CSV text"
    }
  },
  "required": [
    "csv"
  ]
} as const satisfies ToolJsonSchema;
export const delimiterSnifferCommaSemicolonTabOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "delimiter": {
      "type": "string",
      "description": "Delimiter"
    },
    "ambiguous": {
      "type": "boolean",
      "description": "Ambiguous"
    },
    "candidates": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "delimiter": {
            "type": "string"
          },
          "modalWidth": {
            "type": "integer"
          },
          "matchingRecords": {
            "type": "integer"
          },
          "recordCount": {
            "type": "integer"
          }
        },
        "required": [
          "delimiter",
          "modalWidth",
          "matchingRecords",
          "recordCount"
        ]
      },
      "description": "Candidates"
    }
  },
  "required": [
    "delimiter",
    "ambiguous",
    "candidates"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateDelimiterSnifferCommaSemicolonTab = (rawInput: unknown): ToolResult<DelimiterSnifferCommaSemicolonTabOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly csv?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "csv"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const csvValue = candidate.csv;
  if (typeof csvValue !== "string") return issue("csv", "invalid_type", "Enter a string value.");
  if (csvValue.length > 100000) return issue("csv", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const input: DelimiterSnifferCommaSemicolonTabInput = { csv: csvValue };
  const candidates: { delimiter: string; modalWidth: number; matchingRecords: number; recordCount: number }[] = [];
  for (const delimiter of [",", ";", "	"]) {
    const parsed = readCsvText(input.csv, delimiter);
    if (!parsed.ok) {
      if (parsed.code === "resource_limit") return issue("csv", parsed.code, parsed.message);
      continue;
    }
    const frequencies = new Map<number, number>();
    for (const row of parsed.records) frequencies.set(row.length, (frequencies.get(row.length) ?? 0) + 1);
    let modalWidth = 0;
    let matchingRecords = 0;
    for (const [width, count] of frequencies) {
      if (count > matchingRecords || (count === matchingRecords && width > modalWidth)) { modalWidth = width; matchingRecords = count; }
    }
    if (modalWidth > 1) candidates.push({ delimiter, modalWidth, matchingRecords, recordCount: parsed.records.length });
  }
  candidates.sort((a, b) => b.matchingRecords * a.recordCount - a.matchingRecords * b.recordCount);
  const first = candidates[0];
  const second = candidates[1];
  const ambiguous = first === undefined || (second !== undefined && first.matchingRecords * second.recordCount === second.matchingRecords * first.recordCount);
  return toolSuccess({ delimiter: ambiguous ? "" : first?.delimiter ?? "", ambiguous, candidates });
};
export const example = {
  input: {
    "csv": "name;age\nAda;36"
  },
  output: {
    "delimiter": ";",
    "ambiguous": false,
    "candidates": [
      {
        "delimiter": ";",
        "modalWidth": 2,
        "matchingRecords": 2,
        "recordCount": 2
      }
    ]
  },
} satisfies ToolExample<DelimiterSnifferCommaSemicolonTabInput, DelimiterSnifferCommaSemicolonTabOutput>;
export const delimiterSnifferCommaSemicolonTabTool = defineTool<DelimiterSnifferCommaSemicolonTabInput, DelimiterSnifferCommaSemicolonTabOutput>({
  id: "csv/delimiter-sniffer-comma-semicolon-tab",
  title: "Delimiter Sniffer (Comma/Semicolon/Tab)",
  description: "Compare comma, semicolon, and tab dialects by the fraction of records having their modal field count; ties and one-column samples remain ambiguous.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: delimiterSnifferCommaSemicolonTabInputSchema,
  outputSchema: delimiterSnifferCommaSemicolonTabOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "csv",
        "label": "CSV text",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "delimiter",
        "label": "Delimiter",
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "ambiguous",
        "label": "Ambiguous",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "candidates",
        "label": "Candidates",
        "valueType": {
          "type": "list",
          "items": {
            "type": "object"
          }
        }
      }
    ]
  },
  execute: calculateDelimiterSnifferCommaSemicolonTab,
});
export const runDelimiterSnifferCommaSemicolonTab = delimiterSnifferCommaSemicolonTabTool.execute;
export default delimiterSnifferCommaSemicolonTabTool;
