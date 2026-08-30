import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type InsetShorthandAllFourOffsetsInput = {
  readonly values: ReadonlyArray<number>;
};
export type InsetShorthandAllFourOffsetsOutput = {
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
};
export const insetShorthandAllFourOffsetsInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "values": {
      "type": "array",
      "items": {
        "type": "number"
      },
      "minItems": 1,
      "maxItems": 4,
      "description": "Inset values in pixels"
    }
  },
  "required": [
    "values"
  ]
} as const satisfies ToolJsonSchema;
export const insetShorthandAllFourOffsetsOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "top": {
      "type": "number",
      "description": "Top offset"
    },
    "right": {
      "type": "number",
      "description": "Right offset"
    },
    "bottom": {
      "type": "number",
      "description": "Bottom offset"
    },
    "left": {
      "type": "number",
      "description": "Left offset"
    }
  },
  "required": [
    "top",
    "right",
    "bottom",
    "left"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.w3.org/TR/css-position-3/#insets-shorthand
export const calculateInsetShorthandAllFourOffsets = (rawInput: unknown): ToolResult<InsetShorthandAllFourOffsetsOutput> => {
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
  if (valuesValue.length < 1) return issue("values", "out_of_range", "Too few entries.");
  if (valuesValue.length > 4) return issue("values", "resource_limit", "Array exceeds the 4-entry resource limit.");
  const validatedValues: number[] = [];
  for (let index = 0; index < valuesValue.length; index++) {
    if (!Object.prototype.hasOwnProperty.call(valuesValue, index)) return issue(`values.${index}`, "invalid_type", "Sparse arrays are not supported.");
    const item: unknown = valuesValue[index];
    if (typeof item !== "number" || !Number.isFinite(item)) return issue(`values.${index}`, "invalid_type", "Enter a finite number.");
    validatedValues.push(item);
  }

  const input: InsetShorthandAllFourOffsetsInput = { values: validatedValues };
  const top = input.values[0] ?? 0;
  const right = input.values[1] ?? top;
  const bottom = input.values[2] ?? top;
  const left = input.values[3] ?? right;
  return toolSuccess({ top, right, bottom, left });
};
export const example = {
  input: {
    "values": [
      10,
      20,
      30
    ]
  },
  output: {
    "top": 10,
    "right": 20,
    "bottom": 30,
    "left": 20
  },
} satisfies ToolExample<InsetShorthandAllFourOffsetsInput, InsetShorthandAllFourOffsetsOutput>;
export const insetShorthandAllFourOffsetsTool = defineTool<InsetShorthandAllFourOffsetsInput, InsetShorthandAllFourOffsetsOutput>({
  id: "css/inset-shorthand-all-four-offsets",
  title: "inset All-Four Offsets Shorthand",
  description: "Expand one to four finite pixel inset values into top, right, bottom, and left offsets.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: insetShorthandAllFourOffsetsInputSchema,
  outputSchema: insetShorthandAllFourOffsetsOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "values",
        "label": "Inset values in pixels",
        "required": true,
        "valueType": {
          "type": "list",
          "items": {
            "type": "number",
            "unit": "px"
          }
        }
      }
    ],
    "outputs": [
      {
        "id": "top",
        "label": "Top offset",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "right",
        "label": "Right offset",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "bottom",
        "label": "Bottom offset",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      },
      {
        "id": "left",
        "label": "Left offset",
        "valueType": {
          "type": "number",
          "unit": "px"
        }
      }
    ]
  },
  execute: calculateInsetShorthandAllFourOffsets,
});
export const runInsetShorthandAllFourOffsets = insetShorthandAllFourOffsetsTool.execute;
export default insetShorthandAllFourOffsetsTool;
