import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { readCsvText, csvShape } from "../rfc4180-quoted-field-parser-check/tool.js";
export type LowCardinalityCategoryListerInput = {
  readonly csv: string;
  readonly delimiter: "," | ";" | "\t";
  readonly hasHeader: boolean;
  readonly maxCategories: number;
};
export type LowCardinalityCategoryListerOutput = {
  readonly columns: ReadonlyArray<{ readonly column: number; readonly values: ReadonlyArray<string>; }>;
};
export const lowCardinalityCategoryListerInputSchema = {
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
    "hasHeader": {
      "type": "boolean",
      "description": "Has header"
    },
    "maxCategories": {
      "type": "integer",
      "minimum": 1,
      "maximum": 10000,
      "description": "Max categories"
    }
  },
  "required": [
    "csv",
    "delimiter",
    "hasHeader",
    "maxCategories"
  ]
} as const satisfies ToolJsonSchema;
export const lowCardinalityCategoryListerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "columns": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "column": {
            "type": "integer"
          },
          "values": {
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "column",
          "values"
        ]
      },
      "description": "Columns"
    }
  },
  "required": [
    "columns"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateLowCardinalityCategoryLister = (rawInput: unknown): ToolResult<LowCardinalityCategoryListerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly csv?: unknown; readonly delimiter?: unknown; readonly hasHeader?: unknown; readonly maxCategories?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "csv",
  "delimiter",
  "hasHeader",
  "maxCategories"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const csvValue = candidate.csv;
  if (typeof csvValue !== "string") return issue("csv", "invalid_type", "Enter a string value.");
  if (csvValue.length > 100000) return issue("csv", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const delimiterValue = candidate.delimiter;
  if (typeof delimiterValue !== "string") return issue("delimiter", "invalid_type", "Enter a string value.");
  if (delimiterValue !== "," && delimiterValue !== ";" && delimiterValue !== "\t") return issue("delimiter", "invalid_value", "Choose a supported value.");
  const hasHeaderValue = candidate.hasHeader;
  if (typeof hasHeaderValue !== "boolean") return issue("hasHeader", "invalid_type", "Enter a boolean value.");
  const maxCategoriesValue = candidate.maxCategories;
  if (typeof maxCategoriesValue !== "number" || !Number.isSafeInteger(maxCategoriesValue)) return issue("maxCategories", "invalid_type", "Enter a finite safe integer.");
  if (maxCategoriesValue < 1) return issue("maxCategories", "out_of_range", "Value is outside the accepted range.");
  if (maxCategoriesValue > 10000) return issue("maxCategories", "out_of_range", "Value is outside the accepted range.");
  const input: LowCardinalityCategoryListerInput = { csv: csvValue, delimiter: delimiterValue, hasHeader: hasHeaderValue, maxCategories: maxCategoriesValue };
  const parsed = readCsvText(input.csv, input.delimiter);
  if (!parsed.ok) return issue("csv", parsed.code, parsed.message);
  const rows = parsed.records;
  const width = csvShape(rows);
  if (width === undefined) return issue("csv", "ragged_rows", "All records must have the same field count.");
  if (input.hasHeader && rows.length === 0) return issue("csv", "missing_header", "A header record is required.");
  const header = input.hasHeader ? rows.slice(0, 1) : [];
  const data = input.hasHeader ? rows.slice(1) : rows;
  const columns: { column: number; values: string[] }[] = [];
  for (let column = 0; column < width; column++) {
    const values = [...new Set(data.map((row) => row[column] ?? "").filter((cell) => cell !== ""))];
    if (values.length > 0 && values.length <= input.maxCategories) columns.push({ column, values });
  }
  return toolSuccess({ columns });
};
export const example = {
  input: {
    "csv": "id,color\n1,red\n2,blue\n3,red",
    "delimiter": ",",
    "hasHeader": true,
    "maxCategories": 2
  },
  output: {
    "columns": [
      {
        "column": 1,
        "values": [
          "red",
          "blue"
        ]
      }
    ]
  },
} satisfies ToolExample<LowCardinalityCategoryListerInput, LowCardinalityCategoryListerOutput>;
export const lowCardinalityCategoryListerTool = defineTool<LowCardinalityCategoryListerInput, LowCardinalityCategoryListerOutput>({
  id: "csv/low-cardinality-category-lister",
  title: "Low-Cardinality Category Lister",
  description: "List first-encounter distinct nonempty values for data columns whose observed category count is at most an explicit maximum, excluding an explicit header.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: lowCardinalityCategoryListerInputSchema,
  outputSchema: lowCardinalityCategoryListerOutputSchema,
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
        "id": "hasHeader",
        "label": "Has header",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "maxCategories",
        "label": "Max categories",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      }
    ],
    "outputs": [
      {
        "id": "columns",
        "label": "Columns",
        "valueType": {
          "type": "list",
          "items": {
            "type": "object"
          }
        }
      }
    ]
  },
  execute: calculateLowCardinalityCategoryLister,
});
export const runLowCardinalityCategoryLister = lowCardinalityCategoryListerTool.execute;
export default lowCardinalityCategoryListerTool;
