import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";
import { writeCsvRecords } from "../rfc4180-quoted-field-parser-check/tool.js";
export type FixedWidthToCsvOffsetSpecParserInput = {
  readonly text: string;
  readonly offsets: ReadonlyArray<number>;
};
export type FixedWidthToCsvOffsetSpecParserOutput = {
  readonly csv: string;
};
export const fixedWidthToCsvOffsetSpecParserInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "text": {
      "type": "string",
      "maxLength": 100000,
      "description": "Text"
    },
    "offsets": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 0,
        "maximum": 100000
      },
      "minItems": 1,
      "maxItems": 1000,
      "description": "Offsets"
    }
  },
  "required": [
    "text",
    "offsets"
  ]
} as const satisfies ToolJsonSchema;
export const fixedWidthToCsvOffsetSpecParserOutputSchema = {
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
export const calculateFixedWidthToCsvOffsetSpecParser = (rawInput: unknown): ToolResult<FixedWidthToCsvOffsetSpecParserOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly text?: unknown; readonly offsets?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "text",
  "offsets"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const textValue = candidate.text;
  if (typeof textValue !== "string") return issue("text", "invalid_type", "Enter a string value.");
  if (textValue.length > 100000) return issue("text", "resource_limit", "Text exceeds the 100000-character resource limit.");
  const offsetsValue = candidate.offsets;
  if (!Array.isArray(offsetsValue)) return issue("offsets", "invalid_type", "Enter a dense array.");
  if (offsetsValue.length < 1) return issue("offsets", "out_of_range", "Too few entries.");
  if (offsetsValue.length > 1000) return issue("offsets", "resource_limit", "Array exceeds the 1000-entry resource limit.");
  const validatedOffsets: number[] = [];
  for (let index = 0; index < offsetsValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(offsetsValue, index)) return issue(`offsets.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = offsetsValue[index];
    if (typeof item !== "number" || !Number.isSafeInteger(item)) return issue(`offsets.${index}`, "invalid_type", "Enter a finite safe integer.");
    if (item < 0) return issue(`offsets.${index}`, "out_of_range", "Value is outside the accepted range.");
    if (item > 100000) return issue(`offsets.${index}`, "out_of_range", "Value is outside the accepted range.");
    validatedOffsets.push(item);
  }
  const input: FixedWidthToCsvOffsetSpecParserInput = { text: textValue, offsets: validatedOffsets };
  if (input.offsets[0] !== 0 || input.offsets.some((offset, index) => index > 0 && offset <= (input.offsets[index - 1] ?? 0))) return issue("offsets", "invalid_offsets", "Offsets must begin at zero and increase strictly.");
  const lines = input.text === "" ? [] : input.text.split(/\r\n|\r|\n/);
  if (/[\r\n]$/.test(input.text)) lines.pop();
  if (lines.length * input.offsets.length > 10000) return issue("offsets", "resource_limit", "Output may contain at most 10,000 fields.");
  const finalOffset = input.offsets[input.offsets.length - 1] ?? 0;
  if (lines.some((line) => line.length < finalOffset)) return issue("text", "short_line", "Each line must reach the final field offset.");
  const rows = lines.map((line) => input.offsets.map((offset, index) => line.slice(offset, input.offsets[index + 1])));
  return toolSuccess({ csv: writeCsvRecords(rows) });
};
export const example = {
  input: {
    "text": "001Ada  36\n002Grace85",
    "offsets": [
      0,
      3,
      8
    ]
  },
  output: {
    "csv": "001,Ada  ,36\n002,Grace,85"
  },
} satisfies ToolExample<FixedWidthToCsvOffsetSpecParserInput, FixedWidthToCsvOffsetSpecParserOutput>;
export const fixedWidthToCsvOffsetSpecParserTool = defineTool<FixedWidthToCsvOffsetSpecParserInput, FixedWidthToCsvOffsetSpecParserOutput>({
  id: "csv/fixed-width-to-csv-offset-spec-parser",
  title: "Fixed-Width to CSV Offset-Spec Parser",
  description: "Slice physical text lines at strictly increasing zero-based UTF-16 offsets beginning at zero, keeping padding and taking the last field to line end; emit comma CSV with bounded materialization.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: fixedWidthToCsvOffsetSpecParserInputSchema,
  outputSchema: fixedWidthToCsvOffsetSpecParserOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "text",
        "label": "Text",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "offsets",
        "label": "Offsets",
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
        "id": "csv",
        "label": "CSV text",
        "valueType": {
          "type": "string"
        }
      }
    ]
  },
  execute: calculateFixedWidthToCsvOffsetSpecParser,
});
export const runFixedWidthToCsvOffsetSpecParser = fixedWidthToCsvOffsetSpecParserTool.execute;
export default fixedWidthToCsvOffsetSpecParserTool;
