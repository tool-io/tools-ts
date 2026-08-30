import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type HeaderOffsetRecordIndexInput = {
  readonly dataIndex: number;
  readonly hasHeader: boolean;
};
export type HeaderOffsetRecordIndexOutput = {
  readonly recordIndex: number;
};
export const headerOffsetRecordIndexInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "dataIndex": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Data index"
    },
    "hasHeader": {
      "type": "boolean",
      "description": "Has header"
    }
  },
  "required": [
    "dataIndex",
    "hasHeader"
  ]
} as const satisfies ToolJsonSchema;
export const headerOffsetRecordIndexOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "recordIndex": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Record index"
    }
  },
  "required": [
    "recordIndex"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateHeaderOffsetRecordIndex = (rawInput: unknown): ToolResult<HeaderOffsetRecordIndexOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly dataIndex?: unknown; readonly hasHeader?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "dataIndex",
  "hasHeader"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const dataIndexValue = candidate.dataIndex;
  if (typeof dataIndexValue !== "number" || !Number.isSafeInteger(dataIndexValue)) return issue("dataIndex", "invalid_type", "Enter a finite safe integer.");
  if (dataIndexValue < 0) return issue("dataIndex", "out_of_range", "Value is outside the accepted range.");
  if (dataIndexValue > 9007199254740991) return issue("dataIndex", "out_of_range", "Value is outside the accepted range.");
  const hasHeaderValue = candidate.hasHeader;
  if (typeof hasHeaderValue !== "boolean") return issue("hasHeader", "invalid_type", "Enter a boolean value.");
  const input: HeaderOffsetRecordIndexInput = { dataIndex: dataIndexValue, hasHeader: hasHeaderValue };
  const index = BigInt(input.dataIndex) + (input.hasHeader ? 1n : 0n);
  if (index > BigInt(Number.MAX_SAFE_INTEGER)) return issue("dataIndex", "index_overflow", "The resulting record index exceeds safe integer precision.");
  return toolSuccess({ recordIndex: Number(index) });
};
export const example = {
  input: {
    "dataIndex": 4,
    "hasHeader": true
  },
  output: {
    "recordIndex": 5
  },
} satisfies ToolExample<HeaderOffsetRecordIndexInput, HeaderOffsetRecordIndexOutput>;
export const headerOffsetRecordIndexTool = defineTool<HeaderOffsetRecordIndexInput, HeaderOffsetRecordIndexOutput>({
  id: "csv/header-offset-record-index",
  title: "Header Offset Record Index",
  description: "Map a zero-based data record index to a zero-based CSV record index by adding one when a header exists; record indices do not count embedded physical lines.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: headerOffsetRecordIndexInputSchema,
  outputSchema: headerOffsetRecordIndexOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "dataIndex",
        "label": "Data index",
        "required": true,
        "valueType": {
          "type": "integer"
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
        "id": "recordIndex",
        "label": "Record index",
        "valueType": {
          "type": "integer"
        }
      }
    ]
  },
  execute: calculateHeaderOffsetRecordIndex,
});
export const runHeaderOffsetRecordIndex = headerOffsetRecordIndexTool.execute;
export default headerOffsetRecordIndexTool;
