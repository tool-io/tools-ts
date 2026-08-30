import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type EntropyBitsFromCharsetLengthInput = {
  readonly alphabetSize: number;
  readonly length: number;
};
export type EntropyBitsFromCharsetLengthOutput = {
  readonly bits: number;
};
export const entropyBitsFromCharsetLengthInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "alphabetSize": {
      "type": "integer",
      "minimum": 1,
      "maximum": 9007199254740991,
      "description": "Character-set size"
    },
    "length": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Independent character count"
    }
  },
  "required": [
    "alphabetSize",
    "length"
  ]
} as const satisfies ToolJsonSchema;
export const entropyBitsFromCharsetLengthOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "bits": {
      "type": "number",
      "minimum": 0,
      "description": "Ideal entropy"
    }
  },
  "required": [
    "bits"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf
export const calculateEntropyBitsFromCharsetLength = (rawInput: unknown): ToolResult<EntropyBitsFromCharsetLengthOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly alphabetSize?: unknown; readonly length?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "alphabetSize",
  "length"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const alphabetSizeValue = candidate.alphabetSize;
if (typeof alphabetSizeValue !== "number" || !Number.isSafeInteger(alphabetSizeValue)) return issue("alphabetSize", "invalid_type", "Enter a finite safe integer.");
if (alphabetSizeValue < 1) return issue("alphabetSize", "out_of_range", "Value is outside the accepted range.");
if (alphabetSizeValue > 9007199254740991) return issue("alphabetSize", "out_of_range", "Value is outside the accepted range.");
const lengthValue = candidate.length;
if (typeof lengthValue !== "number" || !Number.isSafeInteger(lengthValue)) return issue("length", "invalid_type", "Enter a finite safe integer.");
if (lengthValue < 0) return issue("length", "out_of_range", "Value is outside the accepted range.");
if (lengthValue > 9007199254740991) return issue("length", "out_of_range", "Value is outside the accepted range.");
  const input: EntropyBitsFromCharsetLengthInput = { alphabetSize: alphabetSizeValue, length: lengthValue };
  return toolSuccess({ bits: input.length * Math.log2(input.alphabetSize) });
};
export const example = {
  "input": {
    "alphabetSize": 64,
    "length": 10
  },
  "output": {
    "bits": 60
  }
} satisfies ToolExample<EntropyBitsFromCharsetLengthInput, EntropyBitsFromCharsetLengthOutput>;
export const entropyBitsFromCharsetLengthTool = defineTool<EntropyBitsFromCharsetLengthInput, EntropyBitsFromCharsetLengthOutput>({
  id: "cryptography/entropy-bits-from-charset-length",
  title: "Entropy Bits From Charset \u00d7 Length",
  description: "Calculate ideal entropy for independent uniform draws from a supplied character-set size.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: entropyBitsFromCharsetLengthInputSchema,
  outputSchema: entropyBitsFromCharsetLengthOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "alphabetSize",
        "label": "Character-set size",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "length",
        "label": "Independent character count",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      }
    ],
    "outputs": [
      {
        "id": "bits",
        "label": "Ideal entropy",
        "valueType": {
          "type": "number",
          "unit": "bit"
        }
      }
    ]
  },
  execute: calculateEntropyBitsFromCharsetLength,
});
export const runEntropyBitsFromCharsetLength = entropyBitsFromCharsetLengthTool.execute;
export default entropyBitsFromCharsetLengthTool;
