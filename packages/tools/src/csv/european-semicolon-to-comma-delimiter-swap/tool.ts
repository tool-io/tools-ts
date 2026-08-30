import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText, writeCsvRecords } from "../rfc4180-quoted-field-parser-check/tool.js";
export type EuropeanSemicolonToCommaDelimiterSwapInput = {
  readonly csv: string;
};
export type EuropeanSemicolonToCommaDelimiterSwapOutput = {
  readonly csv: string;
};
export const europeanSemicolonToCommaDelimiterSwapInputSchema = {
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
export const europeanSemicolonToCommaDelimiterSwapOutputSchema = {
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
export const calculateEuropeanSemicolonToCommaDelimiterSwap = (rawInput: unknown): ToolResult<EuropeanSemicolonToCommaDelimiterSwapOutput> => {
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
  const input: EuropeanSemicolonToCommaDelimiterSwapInput = { csv: csvValue };
  const parsed = readCsvText(input.csv, ";");
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  return toolSuccess({ csv: writeCsvRecords(parsed.records, ",") });
};
export const example = {
  input: {
    "csv": "name;note\nAda;\"a;b,c\""
  },
  output: {
    "csv": "name,note\nAda,\"a;b,c\""
  },
} satisfies ToolExample<EuropeanSemicolonToCommaDelimiterSwapInput, EuropeanSemicolonToCommaDelimiterSwapOutput>;
export const europeanSemicolonToCommaDelimiterSwapTool = defineTool<EuropeanSemicolonToCommaDelimiterSwapInput, EuropeanSemicolonToCommaDelimiterSwapOutput>({
  id: "csv/european-semicolon-to-comma-delimiter-swap",
  title: "European Semicolon→Comma Delimiter Swap",
  description: "Convert semicolon-delimited CSV with double-quote escaping into comma-delimited CSV, preserving decoded cell values and quoted embedded delimiters.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: europeanSemicolonToCommaDelimiterSwapInputSchema,
  outputSchema: europeanSemicolonToCommaDelimiterSwapOutputSchema,
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
        "id": "csv",
        "label": "CSV text",
        "valueType": {
          "type": "string"
        }
      }
    ]
  },
  execute: calculateEuropeanSemicolonToCommaDelimiterSwap,
});
export const runEuropeanSemicolonToCommaDelimiterSwap = europeanSemicolonToCommaDelimiterSwapTool.execute;
export default europeanSemicolonToCommaDelimiterSwapTool;
