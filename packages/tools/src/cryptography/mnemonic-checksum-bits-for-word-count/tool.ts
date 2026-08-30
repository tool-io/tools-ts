import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type MnemonicChecksumBitsForWordCountInput = {
  readonly wordCount: number;
};
export type MnemonicChecksumBitsForWordCountOutput = {
  readonly entropyBits: number;
  readonly checksumBits: number;
  readonly encodedBits: number;
};
export const mnemonicChecksumBitsForWordCountInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "wordCount": {
      "type": "integer",
      "minimum": 12,
      "maximum": 24,
      "description": "Mnemonic word count"
    }
  },
  "required": [
    "wordCount"
  ]
} as const satisfies ToolJsonSchema;
export const mnemonicChecksumBitsForWordCountOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "entropyBits": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Entropy bit count"
    },
    "checksumBits": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Checksum bit count"
    },
    "encodedBits": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Total encoded bit count"
    }
  },
  "required": [
    "entropyBits",
    "checksumBits",
    "encodedBits"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://bips.dev/39/
export const calculateMnemonicChecksumBitsForWordCount = (rawInput: unknown): ToolResult<MnemonicChecksumBitsForWordCountOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly wordCount?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "wordCount"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const wordCountValue = candidate.wordCount;
if (typeof wordCountValue !== "number" || !Number.isSafeInteger(wordCountValue)) return issue("wordCount", "invalid_type", "Enter a finite safe integer.");
if (wordCountValue < 12) return issue("wordCount", "out_of_range", "Value is outside the accepted range.");
if (wordCountValue > 24) return issue("wordCount", "out_of_range", "Value is outside the accepted range.");
  const input: MnemonicChecksumBitsForWordCountInput = { wordCount: wordCountValue };
  if (input.wordCount % 3 !== 0) return issue("wordCount", "invalid_word_count", "BIP39 permits 12, 15, 18, 21, or 24 words.");
  const entropyBits = input.wordCount / 3 * 32;
  return toolSuccess({ entropyBits, checksumBits: entropyBits / 32, encodedBits: input.wordCount * 11 });
};
export const example = {
  "input": {
    "wordCount": 12
  },
  "output": {
    "entropyBits": 128,
    "checksumBits": 4,
    "encodedBits": 132
  }
} satisfies ToolExample<MnemonicChecksumBitsForWordCountInput, MnemonicChecksumBitsForWordCountOutput>;
export const mnemonicChecksumBitsForWordCountTool = defineTool<MnemonicChecksumBitsForWordCountInput, MnemonicChecksumBitsForWordCountOutput>({
  id: "cryptography/mnemonic-checksum-bits-for-word-count",
  title: "Mnemonic Checksum Bits For Word Count",
  description: "Return the entropy and checksum bit counts prescribed for a valid BIP39 mnemonic word count.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: mnemonicChecksumBitsForWordCountInputSchema,
  outputSchema: mnemonicChecksumBitsForWordCountOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "wordCount",
        "label": "Mnemonic word count",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      }
    ],
    "outputs": [
      {
        "id": "entropyBits",
        "label": "Entropy bit count",
        "valueType": {
          "type": "integer",
          "unit": "bit"
        }
      },
      {
        "id": "checksumBits",
        "label": "Checksum bit count",
        "valueType": {
          "type": "integer",
          "unit": "bit"
        }
      },
      {
        "id": "encodedBits",
        "label": "Total encoded bit count",
        "valueType": {
          "type": "integer",
          "unit": "bit"
        }
      }
    ]
  },
  execute: calculateMnemonicChecksumBitsForWordCount,
});
export const runMnemonicChecksumBitsForWordCount = mnemonicChecksumBitsForWordCountTool.execute;
export default mnemonicChecksumBitsForWordCountTool;
