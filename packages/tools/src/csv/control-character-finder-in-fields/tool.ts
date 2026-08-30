import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type ControlCharacterFinderInFieldsInput = {
  readonly values: ReadonlyArray<string>;
};
export type ControlCharacterFinderInFieldsOutput = {
  readonly matches: ReadonlyArray<{ readonly cell: number; readonly offset: number; readonly codePoint: number; }>;
};
export const controlCharacterFinderInFieldsInputSchema = {
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
    }
  },
  "required": [
    "values"
  ]
} as const satisfies ToolJsonSchema;
export const controlCharacterFinderInFieldsOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "matches": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "cell": {
            "type": "integer"
          },
          "offset": {
            "type": "integer"
          },
          "codePoint": {
            "type": "integer"
          }
        },
        "required": [
          "cell",
          "offset",
          "codePoint"
        ]
      },
      "description": "Matches"
    }
  },
  "required": [
    "matches"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.unicode.org/reports/tr44/#General_Category_Values
export const calculateControlCharacterFinderInFields = (rawInput: unknown): ToolResult<ControlCharacterFinderInFieldsOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly values?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "values"
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
  const input: ControlCharacterFinderInFieldsInput = { values: validatedValues };
  const matches: { cell: number; offset: number; codePoint: number }[] = [];
  input.values.forEach((value, cell) => { for (let offset = 0; offset < value.length; offset++) {
    const codePoint = value.charCodeAt(offset);
    if (codePoint <= 31 || (codePoint >= 127 && codePoint <= 159)) matches.push({ cell, offset, codePoint });
  } });
  return toolSuccess({ matches });
};
export const example = {
  input: {
    "values": [
      "a\tb",
      "xy"
    ]
  },
  output: {
    "matches": [
      {
        "cell": 0,
        "offset": 1,
        "codePoint": 9
      },
      {
        "cell": 1,
        "offset": 1,
        "codePoint": 127
      }
    ]
  },
} satisfies ToolExample<ControlCharacterFinderInFieldsInput, ControlCharacterFinderInFieldsOutput>;
export const controlCharacterFinderInFieldsTool = defineTool<ControlCharacterFinderInFieldsInput, ControlCharacterFinderInFieldsOutput>({
  id: "csv/control-character-finder-in-fields",
  title: "Control Character Finder In Fields",
  description: "Locate C0 and C1 control characters, including DEL, in cell strings and report cell index, UTF-16 offset, and code point; tabs and line breaks are included.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: controlCharacterFinderInFieldsInputSchema,
  outputSchema: controlCharacterFinderInFieldsOutputSchema,
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
      }
    ],
    "outputs": [
      {
        "id": "matches",
        "label": "Matches",
        "valueType": {
          "type": "list",
          "items": {
            "type": "object"
          }
        }
      }
    ]
  },
  execute: calculateControlCharacterFinderInFields,
});
export const runControlCharacterFinderInFields = controlCharacterFinderInFieldsTool.execute;
export default controlCharacterFinderInFieldsTool;
