import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type TextareaInputMaxlengthParityInput = {
  readonly value: string;
  readonly maxlength: number;
};
export type TextareaInputMaxlengthParityOutput = {
  readonly codeUnits: number;
  readonly withinLimit: boolean;
  readonly excess: number;
};
export const textareaInputMaxlengthParityInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "value": {
      "type": "string",
      "maxLength": 100000,
      "description": "Value"
    },
    "maxlength": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Maxlength"
    }
  },
  "required": [
    "value",
    "maxlength"
  ]
} as const satisfies ToolJsonSchema;
export const textareaInputMaxlengthParityOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "codeUnits": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Code Units"
    },
    "withinLimit": {
      "type": "boolean",
      "description": "Within Limit"
    },
    "excess": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Excess"
    }
  },
  "required": [
    "codeUnits",
    "withinLimit",
    "excess"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#limiting-user-input-length:-the-maxlength-attribute
export const calculateTextareaInputMaxlengthParity = (rawInput: unknown): ToolResult<TextareaInputMaxlengthParityOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly value?: unknown; readonly maxlength?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "value",
  "maxlength"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const valueValue = candidate.value;
if (typeof valueValue !== "string") return issue("value", "invalid_type", "Enter a string value.");
if (valueValue.length > 100000) return issue("value", "resource_limit", "Text exceeds the 100000-character resource limit.");
const maxlengthValue = candidate.maxlength;
if (typeof maxlengthValue !== "number" || !Number.isSafeInteger(maxlengthValue)) return issue("maxlength", "invalid_type", "Enter a finite safe integer.");
if (maxlengthValue < 0) return issue("maxlength", "out_of_range", "Value is outside the accepted range.");
if (maxlengthValue > 9007199254740991) return issue("maxlength", "out_of_range", "Value is outside the accepted range.");
  const input: TextareaInputMaxlengthParityInput = { value: valueValue, maxlength: maxlengthValue };
 const codeUnits = input.value.length;
 return toolSuccess({ codeUnits, withinLimit: codeUnits <= input.maxlength, excess: Math.max(0, codeUnits - input.maxlength) });
};
export const example = {
  "input": {
    "value": "A\ud83d\ude00B",
    "maxlength": 3
  },
  "output": {
    "codeUnits": 4,
    "withinLimit": false,
    "excess": 1
  }
} satisfies ToolExample<TextareaInputMaxlengthParityInput, TextareaInputMaxlengthParityOutput>;
export const textareaInputMaxlengthParityTool = defineTool<TextareaInputMaxlengthParityInput, TextareaInputMaxlengthParityOutput>({
  id: "html/textarea-input-maxlength-parity",
  title: "textarea/input maxlength Parity",
  description: "Measures an input or textarea API value in UTF-16 code units against maxlength. Supply the already-normalized API value; this does not model user-edit constraint-validation conditions or grapheme counts.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: textareaInputMaxlengthParityInputSchema,
  outputSchema: textareaInputMaxlengthParityOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "value",
        "label": "Value",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "maxlength",
        "label": "Maxlength",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      }
    ],
    "outputs": [
      {
        "id": "codeUnits",
        "label": "Code Units",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "withinLimit",
        "label": "Within Limit",
        "valueType": {
          "type": "boolean"
        }
      },
      {
        "id": "excess",
        "label": "Excess",
        "valueType": {
          "type": "integer"
        }
      }
    ]
  },
  execute: calculateTextareaInputMaxlengthParity,
});
export const runTextareaInputMaxlengthParity = textareaInputMaxlengthParityTool.execute;
export default textareaInputMaxlengthParityTool;
