import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type KmapCellCountGridResolverInput = {
  readonly variableCount: number;
};
export type KmapCellCountGridResolverOutput = {
  readonly cellCount: number;
  readonly rowCount: number;
  readonly columnCount: number;
  readonly rowVariables: number;
  readonly columnVariables: number;
};
export const kmapCellCountGridResolverInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "variableCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 52,
      "description": "Variable count"
    }
  },
  "required": [
    "variableCount"
  ]
} as const satisfies ToolJsonSchema;
export const kmapCellCountGridResolverOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "cellCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Map cell count"
    },
    "rowCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Row count"
    },
    "columnCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Column count"
    },
    "rowVariables": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Row variable count"
    },
    "columnVariables": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Column variable count"
    }
  },
  "required": [
    "cellCount",
    "rowCount",
    "columnCount",
    "rowVariables",
    "columnVariables"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://forallx.openlogicproject.org/html/Ch11.html; https://forallx.openlogicproject.org/html/Ch19.html
export const calculateKmapCellCountGridResolver = (rawInput: unknown): ToolResult<KmapCellCountGridResolverOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly variableCount?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "variableCount"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const variableCountValue = candidate.variableCount;
  if (typeof variableCountValue !== "number" || !Number.isSafeInteger(variableCountValue)) return issue("variableCount", "invalid_type", "Enter a finite safe integer.");
  if (variableCountValue < 0) return issue("variableCount", "out_of_range", "Value is outside the accepted range.");
  if (variableCountValue > 52) return issue("variableCount", "out_of_range", "Value is outside the accepted range.");

  const input: KmapCellCountGridResolverInput = { variableCount: variableCountValue };
  const rowVariables = Math.floor(input.variableCount / 2), columnVariables = Math.ceil(input.variableCount / 2);
  return toolSuccess({ cellCount: 2 ** input.variableCount, rowCount: 2 ** rowVariables, columnCount: 2 ** columnVariables, rowVariables, columnVariables });
};
export const example = {
  input: {
    "variableCount": 3
  },
  output: {
    "cellCount": 8,
    "rowCount": 2,
    "columnCount": 4,
    "rowVariables": 1,
    "columnVariables": 2
  },
} satisfies ToolExample<KmapCellCountGridResolverInput, KmapCellCountGridResolverOutput>;
export const kmapCellCountGridResolverTool = defineTool<KmapCellCountGridResolverInput, KmapCellCountGridResolverOutput>({
  id: "logic/kmap-cell-count-grid-resolver",
  title: "Karnaugh Map Cell Count Grid Size Resolver",
  description: "Return the cell count and balanced row and column dimensions of a binary Karnaugh map for up to 52 variables.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: kmapCellCountGridResolverInputSchema,
  outputSchema: kmapCellCountGridResolverOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "variableCount",
        "label": "Variable count",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      }
    ],
    "outputs": [
      {
        "id": "cellCount",
        "label": "Map cell count",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "rowCount",
        "label": "Row count",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "columnCount",
        "label": "Column count",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "rowVariables",
        "label": "Row variable count",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "columnVariables",
        "label": "Column variable count",
        "valueType": {
          "type": "integer"
        }
      }
    ]
  },
  execute: calculateKmapCellCountGridResolver,
});
export const runKmapCellCountGridResolver = kmapCellCountGridResolverTool.execute;
export default kmapCellCountGridResolverTool;
