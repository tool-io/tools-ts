import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type NullCipherNthLetterExtractInput = {
  readonly text: string;
  readonly step: number;
  readonly offset: number;
};
export type NullCipherNthLetterExtractOutput = {
  readonly decoded: string;
};
export const nullCipherNthLetterExtractInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "text": {
      "type": "string",
      "maxLength": 100000,
      "description": "Encoded text stream"
    },
    "step": {
      "type": "integer",
      "minimum": 1,
      "maximum": 9007199254740991,
      "description": "Extraction step"
    },
    "offset": {
      "type": "integer",
      "minimum": 1,
      "maximum": 9007199254740991,
      "description": "One-based first position"
    }
  },
  "required": [
    "text",
    "step",
    "offset"
  ]
} as const satisfies ToolJsonSchema;
export const nullCipherNthLetterExtractOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "decoded": {
      "type": "string",
      "description": "Extracted text"
    }
  },
  "required": [
    "decoded"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://tc39.es/ecma262/multipage/text-processing.html#sec-string-iterator-objects
export const calculateNullCipherNthLetterExtract = (rawInput: unknown): ToolResult<NullCipherNthLetterExtractOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly text?: unknown; readonly step?: unknown; readonly offset?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "text",
  "step",
  "offset"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const textValue = candidate.text;
if (typeof textValue !== "string") return issue("text", "invalid_type", "Enter a string value.");
if (textValue.length > 100000) return issue("text", "resource_limit", "Text exceeds the 100000-character resource limit.");
const stepValue = candidate.step;
if (typeof stepValue !== "number" || !Number.isSafeInteger(stepValue)) return issue("step", "invalid_type", "Enter a finite safe integer.");
if (stepValue < 1) return issue("step", "out_of_range", "Value is outside the accepted range.");
if (stepValue > 9007199254740991) return issue("step", "out_of_range", "Value is outside the accepted range.");
const offsetValue = candidate.offset;
if (typeof offsetValue !== "number" || !Number.isSafeInteger(offsetValue)) return issue("offset", "invalid_type", "Enter a finite safe integer.");
if (offsetValue < 1) return issue("offset", "out_of_range", "Value is outside the accepted range.");
if (offsetValue > 9007199254740991) return issue("offset", "out_of_range", "Value is outside the accepted range.");
  const input: NullCipherNthLetterExtractInput = { text: textValue, step: stepValue, offset: offsetValue };
  const points = [...input.text];
  let decoded = "";
  for (let index = input.offset - 1; index < points.length;) {
    decoded += points[index] ?? "";
    if (input.step > points.length - 1 - index) break;
    index += input.step;
  }
  return toolSuccess({ decoded });
};
export const example = {
  "input": {
    "text": "aXbYcZ",
    "step": 2,
    "offset": 2
  },
  "output": {
    "decoded": "XYZ"
  }
} satisfies ToolExample<NullCipherNthLetterExtractInput, NullCipherNthLetterExtractOutput>;
export const nullCipherNthLetterExtractTool = defineTool<NullCipherNthLetterExtractInput, NullCipherNthLetterExtractOutput>({
  id: "cryptography/null-cipher-nth-letter-extract",
  title: "Null Cipher Nth-Letter Extractor",
  description: "Extract every nth Unicode code point at a one-based starting offset from an explicit text stream, including whitespace.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: nullCipherNthLetterExtractInputSchema,
  outputSchema: nullCipherNthLetterExtractOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "text",
        "label": "Encoded text stream",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "step",
        "label": "Extraction step",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "offset",
        "label": "One-based first position",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      }
    ],
    "outputs": [
      {
        "id": "decoded",
        "label": "Extracted text",
        "valueType": {
          "type": "string"
        }
      }
    ]
  },
  execute: calculateNullCipherNthLetterExtract,
});
export const runNullCipherNthLetterExtract = nullCipherNthLetterExtractTool.execute;
export default nullCipherNthLetterExtractTool;
