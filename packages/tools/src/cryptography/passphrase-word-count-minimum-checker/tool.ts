import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type PassphraseWordCountMinimumCheckerInput = {
  readonly wordListSize: number;
  readonly wordCount: number;
  readonly targetBits: number;
};
export type PassphraseWordCountMinimumCheckerOutput = {
  readonly minimumWords: number;
  readonly meetsTarget: boolean;
};
export const passphraseWordCountMinimumCheckerInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "wordListSize": {
      "type": "integer",
      "minimum": 2,
      "maximum": 9007199254740991,
      "description": "Word list size"
    },
    "wordCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Current word count"
    },
    "targetBits": {
      "type": "number",
      "minimum": 0,
      "description": "Required ideal entropy"
    }
  },
  "required": [
    "wordListSize",
    "wordCount",
    "targetBits"
  ]
} as const satisfies ToolJsonSchema;
export const passphraseWordCountMinimumCheckerOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "minimumWords": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Minimum word count"
    },
    "meetsTarget": {
      "type": "boolean",
      "description": "Meets entropy target"
    }
  },
  "required": [
    "minimumWords",
    "meetsTarget"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf
export const calculatePassphraseWordCountMinimumChecker = (rawInput: unknown): ToolResult<PassphraseWordCountMinimumCheckerOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly wordListSize?: unknown; readonly wordCount?: unknown; readonly targetBits?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "wordListSize",
  "wordCount",
  "targetBits"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const wordListSizeValue = candidate.wordListSize;
if (typeof wordListSizeValue !== "number" || !Number.isSafeInteger(wordListSizeValue)) return issue("wordListSize", "invalid_type", "Enter a finite safe integer.");
if (wordListSizeValue < 2) return issue("wordListSize", "out_of_range", "Value is outside the accepted range.");
if (wordListSizeValue > 9007199254740991) return issue("wordListSize", "out_of_range", "Value is outside the accepted range.");
const wordCountValue = candidate.wordCount;
if (typeof wordCountValue !== "number" || !Number.isSafeInteger(wordCountValue)) return issue("wordCount", "invalid_type", "Enter a finite safe integer.");
if (wordCountValue < 0) return issue("wordCount", "out_of_range", "Value is outside the accepted range.");
if (wordCountValue > 9007199254740991) return issue("wordCount", "out_of_range", "Value is outside the accepted range.");
const targetBitsValue = candidate.targetBits;
if (typeof targetBitsValue !== "number" || !Number.isFinite(targetBitsValue)) return issue("targetBits", "invalid_type", "Enter a finite number.");
if (targetBitsValue < 0) return issue("targetBits", "out_of_range", "Value is outside the accepted range.");
  const input: PassphraseWordCountMinimumCheckerInput = { wordListSize: wordListSizeValue, wordCount: wordCountValue, targetBits: targetBitsValue };
  const perWord = Math.log2(input.wordListSize);
  let minimumWords = Math.ceil(input.targetBits / perWord);
  if (!Number.isSafeInteger(minimumWords)) return issue("targetBits", "numeric_range", "The required word count exceeds safe integer range.");
  if (minimumWords > 0 && (minimumWords - 1) * perWord >= input.targetBits) minimumWords--;
  if (minimumWords * perWord < input.targetBits) minimumWords++;
  if (!Number.isSafeInteger(minimumWords)) return issue("targetBits", "numeric_range", "The required word count exceeds safe integer range.");
  return toolSuccess({ minimumWords, meetsTarget: input.wordCount >= minimumWords });
};
export const example = {
  "input": {
    "wordListSize": 4096,
    "wordCount": 4,
    "targetBits": 60
  },
  "output": {
    "minimumWords": 5,
    "meetsTarget": false
  }
} satisfies ToolExample<PassphraseWordCountMinimumCheckerInput, PassphraseWordCountMinimumCheckerOutput>;
export const passphraseWordCountMinimumCheckerTool = defineTool<PassphraseWordCountMinimumCheckerInput, PassphraseWordCountMinimumCheckerOutput>({
  id: "cryptography/passphrase-word-count-minimum-checker",
  title: "Passphrase Word-Count Minimum Check",
  description: "Check the minimum number of independently uniform word choices needed to meet a supplied ideal entropy target.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: passphraseWordCountMinimumCheckerInputSchema,
  outputSchema: passphraseWordCountMinimumCheckerOutputSchema,
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
        "label": "Current word count",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "targetBits",
        "label": "Required ideal entropy",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "bit"
        }
      }
    ],
    "outputs": [
      {
        "id": "minimumWords",
        "label": "Minimum word count",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "meetsTarget",
        "label": "Meets entropy target",
        "valueType": {
          "type": "boolean"
        }
      }
    ]
  },
  execute: calculatePassphraseWordCountMinimumChecker,
});
export const runPassphraseWordCountMinimumChecker = passphraseWordCountMinimumCheckerTool.execute;
export default passphraseWordCountMinimumCheckerTool;
