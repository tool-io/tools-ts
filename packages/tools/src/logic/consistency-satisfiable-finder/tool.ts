import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { truthColumnSize } from "../tautology-all-true-checker/tool.js";
export type ConsistencySatisfiableFinderInput = {
  readonly columns: ReadonlyArray<string>;
};
export type ConsistencySatisfiableFinderOutput = {
  readonly consistent: boolean;
  readonly satisfyingRows: ReadonlyArray<number>;
};
export const consistencySatisfiableFinderInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "columns": {
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[01]+$(?![\\s\\S])",
        "maxLength": 4096
      },
      "minItems": 1,
      "maxItems": 100,
      "description": "Premise truth columns"
    }
  },
  "required": [
    "columns"
  ]
} as const satisfies ToolJsonSchema;
export const consistencySatisfiableFinderOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "consistent": {
      "type": "boolean",
      "description": "Jointly satisfiable"
    },
    "satisfyingRows": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 0,
        "maximum": 9007199254740991
      },
      "description": "Zero-based satisfying row indices"
    }
  },
  "required": [
    "consistent",
    "satisfyingRows"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://forallx.openlogicproject.org/html/Ch11.html; https://forallx.openlogicproject.org/html/Ch19.html
export const calculateConsistencySatisfiableFinder = (rawInput: unknown): ToolResult<ConsistencySatisfiableFinderOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly columns?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "columns"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const columnsValue = candidate.columns;
  if (!Array.isArray(columnsValue)) return issue("columns", "invalid_type", "Enter a dense array.");
  if (columnsValue.length < 1) return issue("columns", "out_of_range", "Too few entries.");
  if (columnsValue.length > 100) return issue("columns", "resource_limit", "Array exceeds the 100-entry resource limit.");
  const validatedColumns: string[] = [];
  for (let index = 0; index < columnsValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(columnsValue, index)) return issue(`columns.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = columnsValue[index];
    if (typeof item !== "string") return issue(`columns.${index}`, "invalid_type", "Enter a string value.");
    if (item.length > 4096) return issue(`columns.${index}`, "resource_limit", "Text exceeds the 4096-character resource limit.");
    if (!(new RegExp("^[01]+$(?![\\s\\S])")).test(item)) return issue(`columns.${index}`, "invalid_format", "Text does not match the accepted syntax.");
    validatedColumns.push(item);
  }
  if (validatedColumns.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("columns", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");

  const input: ConsistencySatisfiableFinderInput = { columns: validatedColumns };
  const rowCount = input.columns[0]?.length ?? 0;
  if (!truthColumnSize(rowCount)) return issue("columns.0", "incomplete_table", "A complete column has a positive power-of-two row count.");
  if (input.columns.some((column) => column.length !== rowCount)) return issue("columns", "length_mismatch", "Truth columns must describe the same ordered valuations.");
  const satisfyingRows: number[] = [];
  for (let row = 0; row < rowCount; row++) if (input.columns.every((column) => column[row] === "1")) satisfyingRows.push(row);
  return toolSuccess({ consistent: satisfyingRows.length > 0, satisfyingRows });
};
export const example = {
  input: {
    "columns": [
      "0111",
      "1101"
    ]
  },
  output: {
    "consistent": true,
    "satisfyingRows": [
      1,
      3
    ]
  },
} satisfies ToolExample<ConsistencySatisfiableFinderInput, ConsistencySatisfiableFinderOutput>;
export const consistencySatisfiableFinderTool = defineTool<ConsistencySatisfiableFinderInput, ConsistencySatisfiableFinderOutput>({
  id: "logic/consistency-satisfiable-finder",
  title: "Logical Consistency Satisfiable-Assignment Finder",
  description: "Find common satisfying rows of complete premise truth columns encoded as 0/1 strings in the same valuation order.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: consistencySatisfiableFinderInputSchema,
  outputSchema: consistencySatisfiableFinderOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "columns",
        "label": "Premise truth columns",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      }
    ],
    "outputs": [
      {
        "id": "consistent",
        "label": "Jointly satisfiable",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "satisfyingRows",
        "label": "Zero-based satisfying row indices",
        "valueType": {
          "type": "list",
          "items": {
            "type": "integer"
          }
        }
      }
    ]
  },
  execute: calculateConsistencySatisfiableFinder,
});
export const runConsistencySatisfiableFinder = consistencySatisfiableFinderTool.execute;
export default consistencySatisfiableFinderTool;
