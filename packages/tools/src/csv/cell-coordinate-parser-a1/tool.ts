import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { parseA1 } from "../column-letter-to-index-a1/tool.js";
export type CellCoordinateParserA1Input = {
  readonly address: string;
};
export type CellCoordinateParserA1Output = {
  readonly row: number;
  readonly column: number;
  readonly absoluteRow: boolean;
  readonly absoluteColumn: boolean;
  readonly canonical: string;
};
export const cellCoordinateParserA1InputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "address": {
      "type": "string",
      "maxLength": 32,
      "description": "Address"
    }
  },
  "required": [
    "address"
  ]
} as const satisfies ToolJsonSchema;
export const cellCoordinateParserA1OutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "row": {
      "type": "integer",
      "minimum": 1,
      "maximum": 9007199254740991,
      "description": "Row"
    },
    "column": {
      "type": "integer",
      "minimum": 1,
      "maximum": 9007199254740991,
      "description": "Column"
    },
    "absoluteRow": {
      "type": "boolean",
      "description": "Absolute row"
    },
    "absoluteColumn": {
      "type": "boolean",
      "description": "Absolute column"
    },
    "canonical": {
      "type": "string",
      "description": "Canonical"
    }
  },
  "required": [
    "row",
    "column",
    "absoluteRow",
    "absoluteColumn",
    "canonical"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://support.microsoft.com/en-us/office/overview-of-formulas-in-excel-ecfdc708-9162-49e8-b993-c311f47ca173
export const calculateCellCoordinateParserA1 = (rawInput: unknown): ToolResult<CellCoordinateParserA1Output> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly address?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "address"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const addressValue = candidate.address;
  if (typeof addressValue !== "string") return issue("address", "invalid_type", "Enter a string value.");
  if (addressValue.length > 32) return issue("address", "resource_limit", "Text exceeds the 32-character resource limit.");
  const input: CellCoordinateParserA1Input = { address: addressValue };
  const value = parseA1(input.address);
  if (value === undefined) return issue("address", "invalid_address", "Enter one A1 address with safe positive indices.");
  return toolSuccess(value);
};
export const example = {
  input: {
    "address": "$b$12"
  },
  output: {
    "row": 12,
    "column": 2,
    "absoluteRow": true,
    "absoluteColumn": true,
    "canonical": "$B$12"
  },
} satisfies ToolExample<CellCoordinateParserA1Input, CellCoordinateParserA1Output>;
export const cellCoordinateParserA1Tool = defineTool<CellCoordinateParserA1Input, CellCoordinateParserA1Output>({
  id: "csv/cell-coordinate-parser-a1",
  title: "Cell Coordinate A1 Parser",
  description: "Parse one A1 address with optional absolute row and column markers, returning one-based safe indices and a canonical uppercase address; sheet names and ranges are excluded.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: cellCoordinateParserA1InputSchema,
  outputSchema: cellCoordinateParserA1OutputSchema,
  ports: {
    "inputs": [
      {
        "id": "address",
        "label": "Address",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "row",
        "label": "Row",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "column",
        "label": "Column",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "absoluteRow",
        "label": "Absolute row",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "absoluteColumn",
        "label": "Absolute column",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "canonical",
        "label": "Canonical",
        "valueType": {
          "type": "string"
        }
      }
    ]
  },
  execute: calculateCellCoordinateParserA1,
});
export const runCellCoordinateParserA1 = cellCoordinateParserA1Tool.execute;
export default cellCoordinateParserA1Tool;
