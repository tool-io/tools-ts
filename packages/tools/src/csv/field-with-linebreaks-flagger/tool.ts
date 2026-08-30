import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type FieldWithLinebreaksFlaggerInput = {
  readonly values: ReadonlyArray<string>;
};
export type FieldWithLinebreaksFlaggerOutput = {
  readonly cellIndices: ReadonlyArray<number>;
};
export const fieldWithLinebreaksFlaggerInputSchema = {
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
export const fieldWithLinebreaksFlaggerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "cellIndices": {
      "type": "array",
      "items": {
        "type": "integer",
        "minimum": 0
      },
      "description": "Cell indices"
    }
  },
  "required": [
    "cellIndices"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc4180
export const calculateFieldWithLinebreaksFlagger = (rawInput: unknown): ToolResult<FieldWithLinebreaksFlaggerOutput> => {
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
  const input: FieldWithLinebreaksFlaggerInput = { values: validatedValues };
  return toolSuccess({ cellIndices: input.values.flatMap((value, index) => /[\r\n]/.test(value) ? [index] : []) });
};
export const example = {
  input: {
    "values": [
      "plain",
      "a\r\nb",
      "a\nb"
    ]
  },
  output: {
    "cellIndices": [
      1,
      2
    ]
  },
} satisfies ToolExample<FieldWithLinebreaksFlaggerInput, FieldWithLinebreaksFlaggerOutput>;
export const fieldWithLinebreaksFlaggerTool = defineTool<FieldWithLinebreaksFlaggerInput, FieldWithLinebreaksFlaggerOutput>({
  id: "csv/field-with-linebreaks-flagger",
  title: "Field-With-Linebreaks Flagger",
  description: "Find zero-based cell indices containing CR or LF characters, treating both individual line endings and CRLF as line-break presence.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: fieldWithLinebreaksFlaggerInputSchema,
  outputSchema: fieldWithLinebreaksFlaggerOutputSchema,
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
        "id": "cellIndices",
        "label": "Cell indices",
        "valueType": {
          "type": "list",
          "items": {
            "type": "integer"
          }
        }
      }
    ]
  },
  execute: calculateFieldWithLinebreaksFlagger,
});
export const runFieldWithLinebreaksFlagger = fieldWithLinebreaksFlaggerTool.execute;
export default fieldWithLinebreaksFlaggerTool;
