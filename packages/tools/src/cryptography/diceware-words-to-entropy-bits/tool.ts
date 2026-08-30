import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type DicewareWordsToEntropyBitsInput = {
  readonly wordListSize: number;
  readonly wordCount: number;
};
export type DicewareWordsToEntropyBitsOutput = {
  readonly bits: number;
};
export const dicewareWordsToEntropyBitsInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "wordListSize": {
      "type": "integer",
      "minimum": 1,
      "maximum": 9007199254740991,
      "description": "Word list size"
    },
    "wordCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Independent word count"
    }
  },
  "required": [
    "wordListSize",
    "wordCount"
  ]
} as const satisfies ToolJsonSchema;
export const dicewareWordsToEntropyBitsOutputSchema = {
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
export const calculateDicewareWordsToEntropyBits = (rawInput: unknown): ToolResult<DicewareWordsToEntropyBitsOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly wordListSize?: unknown; readonly wordCount?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "wordListSize",
  "wordCount"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const wordListSizeValue = candidate.wordListSize;
if (typeof wordListSizeValue !== "number" || !Number.isSafeInteger(wordListSizeValue)) return issue("wordListSize", "invalid_type", "Enter a finite safe integer.");
if (wordListSizeValue < 1) return issue("wordListSize", "out_of_range", "Value is outside the accepted range.");
if (wordListSizeValue > 9007199254740991) return issue("wordListSize", "out_of_range", "Value is outside the accepted range.");
const wordCountValue = candidate.wordCount;
if (typeof wordCountValue !== "number" || !Number.isSafeInteger(wordCountValue)) return issue("wordCount", "invalid_type", "Enter a finite safe integer.");
if (wordCountValue < 0) return issue("wordCount", "out_of_range", "Value is outside the accepted range.");
if (wordCountValue > 9007199254740991) return issue("wordCount", "out_of_range", "Value is outside the accepted range.");
  const input: DicewareWordsToEntropyBitsInput = { wordListSize: wordListSizeValue, wordCount: wordCountValue };
  return toolSuccess({ bits: input.wordCount * Math.log2(input.wordListSize) });
};
export const example = {
  "input": {
    "wordListSize": 4096,
    "wordCount": 5
  },
  "output": {
    "bits": 60
  }
} satisfies ToolExample<DicewareWordsToEntropyBitsInput, DicewareWordsToEntropyBitsOutput>;
export const dicewareWordsToEntropyBitsTool = defineTool<DicewareWordsToEntropyBitsInput, DicewareWordsToEntropyBitsOutput>({
  id: "cryptography/diceware-words-to-entropy-bits",
  title: "Diceware Words to Entropy Bits",
  description: "Calculate ideal word-passphrase entropy from independent uniform choices in a caller-supplied Diceware-style word list.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: dicewareWordsToEntropyBitsInputSchema,
  outputSchema: dicewareWordsToEntropyBitsOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "wordListSize",
        "label": "Word list size",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "wordCount",
        "label": "Independent word count",
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
  execute: calculateDicewareWordsToEntropyBits,
});
export const runDicewareWordsToEntropyBits = dicewareWordsToEntropyBitsTool.execute;
export default dicewareWordsToEntropyBitsTool;
