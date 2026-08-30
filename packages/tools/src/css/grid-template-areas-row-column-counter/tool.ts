import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type GridTemplateAreasRowColumnCounterInput = {
  readonly rows: ReadonlyArray<string>;
};
export type GridTemplateAreasRowColumnCounterOutput = {
  readonly rowCount: number;
  readonly columnCount: number;
  readonly areaNames: ReadonlyArray<string>;
};
export const gridTemplateAreasRowColumnCounterInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "rows": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 1,
      "maxItems": 1000,
      "description": "Grid area row contents"
    }
  },
  "required": [
    "rows"
  ]
} as const satisfies ToolJsonSchema;
export const gridTemplateAreasRowColumnCounterOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
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
    "areaNames": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Named areas"
    }
  },
  "required": [
    "rowCount",
    "columnCount",
    "areaNames"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.w3.org/TR/css-grid-1/#grid-template-areas-property
export const calculateGridTemplateAreasRowColumnCounter = (rawInput: unknown): ToolResult<GridTemplateAreasRowColumnCounterOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly rows?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "rows"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const rowsValue = candidate.rows;
  if (!Array.isArray(rowsValue)) return issue("rows", "invalid_type", "Enter a dense array.");
  if (rowsValue.length < 1) return issue("rows", "out_of_range", "Too few entries.");
  if (rowsValue.length > 1000) return issue("rows", "resource_limit", "Array exceeds the 1000-entry resource limit.");
  const validatedRows: string[] = [];
  for (let index = 0; index < rowsValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(rowsValue, index)) return issue(`rows.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = rowsValue[index];
    if (typeof item !== "string") return issue(`rows.${index}`, "invalid_type", "Enter a string value.");
    if (item.length > 10000) return issue(`rows.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
    validatedRows.push(item);
  }
  if (validatedRows.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("rows", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");

  const input: GridTemplateAreasRowColumnCounterInput = { rows: validatedRows };
  const rows: string[][] = [];
  for (let index = 0; index < input.rows.length; index++) {
    const row: string[] = [];
    const text = input.rows[index] ?? "";
    const tokens = text.match(/\.+|[-_a-zA-Z0-9\u0080-\uFFFF]+|[^\t\n\r\f ]/g) ?? [];
    for (const token of tokens) {
      if (/^\.+$/.test(token)) row.push(".");
      else if (/^[-_a-zA-Z0-9\u0080-\uFFFF]+$/.test(token)) row.push(token);
      else return issue(`rows.${index}`, "invalid_token", "Use named cells, dot runs, and CSS whitespace in row contents.");
    }
    if (row.length === 0 || (index > 0 && row.length !== rows[0]?.length)) return issue(`rows.${index}`, "invalid_grid", "Rows must contain the same positive number of cells.");
    rows.push(row);
  }
  const bounds = new Map<string, { minRow: number; maxRow: number; minCol: number; maxCol: number; count: number }>();
  for (let row = 0; row < rows.length; row++) {
    for (let col = 0; col < (rows[row]?.length ?? 0); col++) {
      const name = rows[row]?.[col];
      if (name === undefined || name === ".") continue;
      const b = bounds.get(name);
      if (b) { b.maxRow = row; b.minCol = Math.min(b.minCol, col); b.maxCol = Math.max(b.maxCol, col); b.count++; }
      else bounds.set(name, { minRow: row, maxRow: row, minCol: col, maxCol: col, count: 1 });
    }
  }
  for (const b of bounds.values()) if (b.count !== (b.maxRow - b.minRow + 1) * (b.maxCol - b.minCol + 1)) return issue("rows", "non_rectangular_area", "Every named area must form one filled rectangle.");
  return toolSuccess({ rowCount: rows.length, columnCount: rows[0]?.length ?? 0, areaNames: [...bounds.keys()] });
};
export const example = {
  input: {
    "rows": [
      "head head",
      "nav main"
    ]
  },
  output: {
    "rowCount": 2,
    "columnCount": 2,
    "areaNames": [
      "head",
      "nav",
      "main"
    ]
  },
} satisfies ToolExample<GridTemplateAreasRowColumnCounterInput, GridTemplateAreasRowColumnCounterOutput>;
export const gridTemplateAreasRowColumnCounterTool = defineTool<GridTemplateAreasRowColumnCounterInput, GridTemplateAreasRowColumnCounterOutput>({
  id: "css/grid-template-areas-row-column-counter",
  title: "grid-template-areas Row/Column Counter",
  description: "Count rows and columns in named grid-area row contents and validate uniform width and rectangular named areas.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: gridTemplateAreasRowColumnCounterInputSchema,
  outputSchema: gridTemplateAreasRowColumnCounterOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "rows",
        "label": "Grid area row contents",
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
        "id": "areaNames",
        "label": "Named areas",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      }
    ]
  },
  execute: calculateGridTemplateAreasRowColumnCounter,
});
export const runGridTemplateAreasRowColumnCounter = gridTemplateAreasRowColumnCounterTool.execute;
export default gridTemplateAreasRowColumnCounterTool;
