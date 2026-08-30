import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type TdColspanRowspanCoverageValidatorInput = {
  readonly rows: number;
  readonly columns: number;
  readonly startRows: ReadonlyArray<number>;
  readonly startColumns: ReadonlyArray<number>;
  readonly rowspans: ReadonlyArray<number>;
  readonly colspans: ReadonlyArray<number>;
};
export type TdColspanRowspanCoverageValidatorOutput = {
  readonly coveredSlots: number;
  readonly uncoveredSlots: number;
  readonly overlappingSlots: number;
  readonly completeWithoutOverlap: boolean;
};
export const tdColspanRowspanCoverageValidatorInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "rows": {
      "type": "integer",
      "minimum": 1,
      "maximum": 100,
      "description": "Rows"
    },
    "columns": {
      "type": "integer",
      "minimum": 1,
      "maximum": 100,
      "description": "Columns"
    },
    "startRows": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 0,
        "maximum": 9007199254740991
      },
      "minItems": 0,
      "maxItems": 1000,
      "description": "Start Rows"
    },
    "startColumns": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 0,
        "maximum": 9007199254740991
      },
      "minItems": 0,
      "maxItems": 1000,
      "description": "Start Columns"
    },
    "rowspans": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 0,
        "maximum": 65534
      },
      "minItems": 0,
      "maxItems": 1000,
      "description": "Rowspans"
    },
    "colspans": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 1,
        "maximum": 1000
      },
      "minItems": 0,
      "maxItems": 1000,
      "description": "Colspans"
    }
  },
  "required": [
    "rows",
    "columns",
    "startRows",
    "startColumns",
    "rowspans",
    "colspans"
  ]
} as const satisfies ToolJsonSchema;
export const tdColspanRowspanCoverageValidatorOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "coveredSlots": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Covered Slots"
    },
    "uncoveredSlots": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Uncovered Slots"
    },
    "overlappingSlots": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Overlapping Slots"
    },
    "completeWithoutOverlap": {
      "type": "boolean",
      "description": "Complete Without Overlap"
    }
  },
  "required": [
    "coveredSlots",
    "uncoveredSlots",
    "overlappingSlots",
    "completeWithoutOverlap"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/tables.html#table-model
export const calculateTdColspanRowspanCoverageValidator = (rawInput: unknown): ToolResult<TdColspanRowspanCoverageValidatorOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly rows?: unknown; readonly columns?: unknown; readonly startRows?: unknown; readonly startColumns?: unknown; readonly rowspans?: unknown; readonly colspans?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "rows",
  "columns",
  "startRows",
  "startColumns",
  "rowspans",
  "colspans"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const rowsValue = candidate.rows;
if (typeof rowsValue !== "number" || !Number.isSafeInteger(rowsValue)) return issue("rows", "invalid_type", "Enter a finite safe integer.");
if (rowsValue < 1) return issue("rows", "out_of_range", "Value is outside the accepted range.");
if (rowsValue > 100) return issue("rows", "out_of_range", "Value is outside the accepted range.");
const columnsValue = candidate.columns;
if (typeof columnsValue !== "number" || !Number.isSafeInteger(columnsValue)) return issue("columns", "invalid_type", "Enter a finite safe integer.");
if (columnsValue < 1) return issue("columns", "out_of_range", "Value is outside the accepted range.");
if (columnsValue > 100) return issue("columns", "out_of_range", "Value is outside the accepted range.");
const startRowsValue = candidate.startRows;
if (!Array.isArray(startRowsValue)) return issue("startRows", "invalid_type", "Enter a dense array.");
if (startRowsValue.length < 0) return issue("startRows", "out_of_range", "Too few entries.");
if (startRowsValue.length > 1000) return issue("startRows", "resource_limit", "Array exceeds the 1000-entry resource limit.");
const validatedStartrows: number[] = [];
for (let index = 0; index < startRowsValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(startRowsValue, index)) return issue(`startRows.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = startRowsValue[index];
if (typeof item !== "number" || !Number.isSafeInteger(item)) return issue(`startRows.${index}`, "invalid_type", "Enter a finite safe integer.");
if (item < 0) return issue(`startRows.${index}`, "out_of_range", "Value is outside the accepted range.");
if (item > 9007199254740991) return issue(`startRows.${index}`, "out_of_range", "Value is outside the accepted range.");
validatedStartrows.push(item);
}
const startColumnsValue = candidate.startColumns;
if (!Array.isArray(startColumnsValue)) return issue("startColumns", "invalid_type", "Enter a dense array.");
if (startColumnsValue.length < 0) return issue("startColumns", "out_of_range", "Too few entries.");
if (startColumnsValue.length > 1000) return issue("startColumns", "resource_limit", "Array exceeds the 1000-entry resource limit.");
const validatedStartcolumns: number[] = [];
for (let index = 0; index < startColumnsValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(startColumnsValue, index)) return issue(`startColumns.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = startColumnsValue[index];
if (typeof item !== "number" || !Number.isSafeInteger(item)) return issue(`startColumns.${index}`, "invalid_type", "Enter a finite safe integer.");
if (item < 0) return issue(`startColumns.${index}`, "out_of_range", "Value is outside the accepted range.");
if (item > 9007199254740991) return issue(`startColumns.${index}`, "out_of_range", "Value is outside the accepted range.");
validatedStartcolumns.push(item);
}
const rowspansValue = candidate.rowspans;
if (!Array.isArray(rowspansValue)) return issue("rowspans", "invalid_type", "Enter a dense array.");
if (rowspansValue.length < 0) return issue("rowspans", "out_of_range", "Too few entries.");
if (rowspansValue.length > 1000) return issue("rowspans", "resource_limit", "Array exceeds the 1000-entry resource limit.");
const validatedRowspans: number[] = [];
for (let index = 0; index < rowspansValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(rowspansValue, index)) return issue(`rowspans.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = rowspansValue[index];
if (typeof item !== "number" || !Number.isSafeInteger(item)) return issue(`rowspans.${index}`, "invalid_type", "Enter a finite safe integer.");
if (item < 0) return issue(`rowspans.${index}`, "out_of_range", "Value is outside the accepted range.");
if (item > 65534) return issue(`rowspans.${index}`, "out_of_range", "Value is outside the accepted range.");
validatedRowspans.push(item);
}
const colspansValue = candidate.colspans;
if (!Array.isArray(colspansValue)) return issue("colspans", "invalid_type", "Enter a dense array.");
if (colspansValue.length < 0) return issue("colspans", "out_of_range", "Too few entries.");
if (colspansValue.length > 1000) return issue("colspans", "resource_limit", "Array exceeds the 1000-entry resource limit.");
const validatedColspans: number[] = [];
for (let index = 0; index < colspansValue.length; index++) {
if (!Object.prototype.hasOwnProperty.call(colspansValue, index)) return issue(`colspans.${index}`, "invalid_type", "Sparse arrays are not supported.");
const item: unknown = colspansValue[index];
if (typeof item !== "number" || !Number.isSafeInteger(item)) return issue(`colspans.${index}`, "invalid_type", "Enter a finite safe integer.");
if (item < 1) return issue(`colspans.${index}`, "out_of_range", "Value is outside the accepted range.");
if (item > 1000) return issue(`colspans.${index}`, "out_of_range", "Value is outside the accepted range.");
validatedColspans.push(item);
}
  const input: TdColspanRowspanCoverageValidatorInput = { rows: rowsValue, columns: columnsValue, startRows: validatedStartrows, startColumns: validatedStartcolumns, rowspans: validatedRowspans, colspans: validatedColspans };
 const count = input.startRows.length;
 if ([input.startColumns, input.rowspans, input.colspans].some(vector => vector.length !== count)) return issue("", "length_mismatch", "All cell vectors must have equal lengths.");
 const coverage = Array<number>(input.rows * input.columns).fill(0);
 for (let index = 0; index < count; index++) {
   const row = input.startRows[index], column = input.startColumns[index], declaredRows = input.rowspans[index], colspan = input.colspans[index];
   if (row === undefined || column === undefined || declaredRows === undefined || colspan === undefined) return issue("", "invalid_cell", "Cell vectors are incomplete.");
   const rowspan = declaredRows === 0 ? input.rows - row : declaredRows;
   if (row >= input.rows || column >= input.columns || rowspan > input.rows - row || colspan > input.columns - column) return issue(`startRows.${index}`, "outside_grid", "Cell extends beyond the supplied row group or columns.");
   for (let r = row; r < row + rowspan; r++) for (let c = column; c < column + colspan; c++) {
     const slot = r * input.columns + c;
     coverage[slot] = (coverage[slot] ?? 0) + 1;
   }
 }
 const coveredSlots = coverage.filter(count => count > 0).length;
 const uncoveredSlots = coverage.length - coveredSlots;
 const overlappingSlots = coverage.filter(count => count > 1).length;
 return toolSuccess({ coveredSlots, uncoveredSlots, overlappingSlots, completeWithoutOverlap: uncoveredSlots === 0 && overlappingSlots === 0 });
};
export const example = {
  "input": {
    "rows": 2,
    "columns": 2,
    "startRows": [
      0,
      0
    ],
    "startColumns": [
      0,
      1
    ],
    "rowspans": [
      0,
      2
    ],
    "colspans": [
      1,
      1
    ]
  },
  "output": {
    "coveredSlots": 4,
    "uncoveredSlots": 0,
    "overlappingSlots": 0,
    "completeWithoutOverlap": true
  }
} satisfies ToolExample<TdColspanRowspanCoverageValidatorInput, TdColspanRowspanCoverageValidatorOutput>;
export const tdColspanRowspanCoverageValidatorTool = defineTool<TdColspanRowspanCoverageValidatorInput, TdColspanRowspanCoverageValidatorOutput>({
  id: "html/td-colspan-rowspan-coverage-validator",
  title: "td colspan/rowspan Grid Coverage Validator",
  description: "Checks explicit cell rectangles within one bounded table row group using zero-based starts and normalized colspan/rowspan. Rowspan 0 reaches the group end. At most 10,000 grid slots and 1000 cells are allowed; this does not derive cell positions from HTML.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: tdColspanRowspanCoverageValidatorInputSchema,
  outputSchema: tdColspanRowspanCoverageValidatorOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "rows",
        "label": "Rows",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "columns",
        "label": "Columns",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "startRows",
        "label": "Start Rows",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "integer"
          }
        }
      },
      {
        "id": "startColumns",
        "label": "Start Columns",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "integer"
          }
        }
      },
      {
        "id": "rowspans",
        "label": "Rowspans",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "integer"
          }
        }
      },
      {
        "id": "colspans",
        "label": "Colspans",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "integer"
          }
        }
      }
    ],
    "outputs": [
      {
        "id": "coveredSlots",
        "label": "Covered Slots",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "uncoveredSlots",
        "label": "Uncovered Slots",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "overlappingSlots",
        "label": "Overlapping Slots",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "completeWithoutOverlap",
        "label": "Complete Without Overlap",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculateTdColspanRowspanCoverageValidator,
});
export const runTdColspanRowspanCoverageValidator = tdColspanRowspanCoverageValidatorTool.execute;
export default tdColspanRowspanCoverageValidatorTool;
