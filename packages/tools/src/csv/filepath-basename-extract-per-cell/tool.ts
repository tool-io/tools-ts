import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type FilepathBasenameExtractPerCellInput = {
  readonly values: ReadonlyArray<string>;
  readonly style: "posix" | "windows";
};
export type FilepathBasenameExtractPerCellOutput = {
  readonly basenames: ReadonlyArray<string>;
};
export const filepathBasenameExtractPerCellInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "values": {
      "type": "array",
      "items": {
        "type": "string",
        "maxLength": 10000
      },
      "minItems": 0,
      "maxItems": 10000,
      "description": "Values"
    },
    "style": {
      "type": "string",
      "enum": [
        "posix",
        "windows"
      ],
      "description": "Style"
    }
  },
  "required": [
    "values",
    "style"
  ]
} as const satisfies ToolJsonSchema;
export const filepathBasenameExtractPerCellOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "basenames": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Basenames"
    }
  },
  "required": [
    "basenames"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://nodejs.org/api/path.html#pathbasenamepath-suffix
export const calculateFilepathBasenameExtractPerCell = (rawInput: unknown): ToolResult<FilepathBasenameExtractPerCellOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly values?: unknown; readonly style?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "values",
  "style"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const valuesValue = candidate.values;
  if (!Array.isArray(valuesValue)) return issue("values", "invalid_type", "Enter a dense array.");
  if (valuesValue.length < 0) return issue("values", "out_of_range", "Too few entries.");
  if (valuesValue.length > 10000) return issue("values", "resource_limit", "Array exceeds the 10000-entry resource limit.");
  const validatedValues: string[] = [];
  for (let index = 0; index < valuesValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(valuesValue, index)) return issue(`values.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = valuesValue[index];
    if (typeof item !== "string") return issue(`values.${index}`, "invalid_type", "Enter a string value.");
    if (item.length > 10000) return issue(`values.${index}`, "resource_limit", "Text exceeds the 10000-character resource limit.");
    validatedValues.push(item);
  }
  if (validatedValues.reduce((total, cell) => total + cell.length, 0) > 100000) return issue("values", "resource_limit", "Combined cell text exceeds 100,000 UTF-16 code units.");
  const styleValue = candidate.style;
  if (typeof styleValue !== "string") return issue("style", "invalid_type", "Enter a string value.");
  if (styleValue !== "posix" && styleValue !== "windows") return issue("style", "invalid_value", "Choose a supported value.");
  const input: FilepathBasenameExtractPerCellInput = { values: validatedValues, style: styleValue };
  const basenames = input.values.map((value) => {
    if (input.style === "windows" && /^[A-Za-z]:[\\/]*$/.test(value)) return "";
    const pathText = input.style === "windows" && /^[A-Za-z]:/.test(value) ? value.slice(2) : value;
    const trimmed = input.style === "windows" ? pathText.replace(/[\\/]+$/, "") : pathText.replace(/\/+$/, "");
    const separators = input.style === "windows" ? /[\\/]/ : /\//;
    const parts = trimmed.split(separators);
    return parts[parts.length - 1] ?? "";
  });
  return toolSuccess({ basenames });
};
export const example = {
  input: {
    "values": [
      "/data/reports/sales.csv",
      "/data/archive/",
      "/"
    ],
    "style": "posix"
  },
  output: {
    "basenames": [
      "sales.csv",
      "archive",
      ""
    ]
  },
} satisfies ToolExample<FilepathBasenameExtractPerCellInput, FilepathBasenameExtractPerCellOutput>;
export const filepathBasenameExtractPerCellTool = defineTool<FilepathBasenameExtractPerCellInput, FilepathBasenameExtractPerCellOutput>({
  id: "csv/filepath-basename-extract-per-cell",
  title: "Filepath Basename Extract Per Cell",
  description: "Extract the last literal path component using explicit POSIX or Windows separators, ignoring trailing separators and returning empty for roots; no filesystem access or path resolution occurs.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: filepathBasenameExtractPerCellInputSchema,
  outputSchema: filepathBasenameExtractPerCellOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "values",
        "label": "Values",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      },
      {
        "id": "style",
        "label": "Style",
        "required": true,
        "valueType": {
          "type": "string"
        }
      }
    ],
    "outputs": [
      {
        "id": "basenames",
        "label": "Basenames",
        "valueType": {
          "type": "list",
          "items": {
            "type": "string"
          }
        }
      }
    ]
  },
  execute: calculateFilepathBasenameExtractPerCell,
});
export const runFilepathBasenameExtractPerCell = filepathBasenameExtractPerCellTool.execute;
export default filepathBasenameExtractPerCellTool;
