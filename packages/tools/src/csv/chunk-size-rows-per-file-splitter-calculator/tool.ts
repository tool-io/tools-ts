import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ChunkSizeRowsPerFileSplitterCalculatorInput = {
  readonly totalDataRows: number;
  readonly maxDataRowsPerFile: number;
};
export type ChunkSizeRowsPerFileSplitterCalculatorOutput = {
  readonly fileCount: number;
  readonly lastFileRows: number;
};
export const chunkSizeRowsPerFileSplitterCalculatorInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "totalDataRows": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Total data rows"
    },
    "maxDataRowsPerFile": {
      "type": "integer",
      "minimum": 1,
      "maximum": 9007199254740991,
      "description": "Max data rows per file"
    }
  },
  "required": [
    "totalDataRows",
    "maxDataRowsPerFile"
  ]
} as const satisfies ToolJsonSchema;
export const chunkSizeRowsPerFileSplitterCalculatorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "fileCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "File count"
    },
    "lastFileRows": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Last file rows"
    }
  },
  "required": [
    "fileCount",
    "lastFileRows"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateChunkSizeRowsPerFileSplitterCalculator = (rawInput: unknown): ToolResult<ChunkSizeRowsPerFileSplitterCalculatorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly totalDataRows?: unknown; readonly maxDataRowsPerFile?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "totalDataRows",
  "maxDataRowsPerFile"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const totalDataRowsValue = candidate.totalDataRows;
  if (typeof totalDataRowsValue !== "number" || !Number.isSafeInteger(totalDataRowsValue)) return issue("totalDataRows", "invalid_type", "Enter a finite safe integer.");
  if (totalDataRowsValue < 0) return issue("totalDataRows", "out_of_range", "Value is outside the accepted range.");
  if (totalDataRowsValue > 9007199254740991) return issue("totalDataRows", "out_of_range", "Value is outside the accepted range.");
  const maxDataRowsPerFileValue = candidate.maxDataRowsPerFile;
  if (typeof maxDataRowsPerFileValue !== "number" || !Number.isSafeInteger(maxDataRowsPerFileValue)) return issue("maxDataRowsPerFile", "invalid_type", "Enter a finite safe integer.");
  if (maxDataRowsPerFileValue < 1) return issue("maxDataRowsPerFile", "out_of_range", "Value is outside the accepted range.");
  if (maxDataRowsPerFileValue > 9007199254740991) return issue("maxDataRowsPerFile", "out_of_range", "Value is outside the accepted range.");
  const input: ChunkSizeRowsPerFileSplitterCalculatorInput = { totalDataRows: totalDataRowsValue, maxDataRowsPerFile: maxDataRowsPerFileValue };
  const total = BigInt(input.totalDataRows);
  const capacity = BigInt(input.maxDataRowsPerFile);
  const fileCount = total === 0n ? 0n : (total + capacity - 1n) / capacity;
  const lastFileRows = total === 0n ? 0n : (total - 1n) % capacity + 1n;
  return toolSuccess({ fileCount: Number(fileCount), lastFileRows: Number(lastFileRows) });
};
export const example = {
  input: {
    "totalDataRows": 1050,
    "maxDataRowsPerFile": 500
  },
  output: {
    "fileCount": 3,
    "lastFileRows": 50
  },
} satisfies ToolExample<ChunkSizeRowsPerFileSplitterCalculatorInput, ChunkSizeRowsPerFileSplitterCalculatorOutput>;
export const chunkSizeRowsPerFileSplitterCalculatorTool = defineTool<ChunkSizeRowsPerFileSplitterCalculatorInput, ChunkSizeRowsPerFileSplitterCalculatorOutput>({
  id: "csv/chunk-size-rows-per-file-splitter-calculator",
  title: "Chunk Size Rows-Per-File Split Calculator",
  description: "Calculate file count and final-file data rows from a total data-row count and positive per-file capacity using exact integer division; header rows are excluded from both counts.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: chunkSizeRowsPerFileSplitterCalculatorInputSchema,
  outputSchema: chunkSizeRowsPerFileSplitterCalculatorOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "totalDataRows",
        "label": "Total data rows",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "maxDataRowsPerFile",
        "label": "Max data rows per file",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      }
    ],
    "outputs": [
      {
        "id": "fileCount",
        "label": "File count",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "lastFileRows",
        "label": "Last file rows",
        "valueType": {
          "type": "integer"
        }
      }
    ]
  },
  execute: calculateChunkSizeRowsPerFileSplitterCalculator,
});
export const runChunkSizeRowsPerFileSplitterCalculator = chunkSizeRowsPerFileSplitterCalculatorTool.execute;
export default chunkSizeRowsPerFileSplitterCalculatorTool;
