import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type RandomHexTokenBitsFromCharactersInput = {
  readonly characters: number;
};
export type RandomHexTokenBitsFromCharactersOutput = {
  readonly bits: string;
};
export const randomHexTokenBitsFromCharactersInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "characters": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Independent random hexadecimal character count"
    }
  },
  "required": [
    "characters"
  ]
} as const satisfies ToolJsonSchema;
export const randomHexTokenBitsFromCharactersOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "bits": {
      "type": "string",
      "description": "Exact ideal bit capacity"
    }
  },
  "required": [
    "bits"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf
export const calculateRandomHexTokenBitsFromCharacters = (rawInput: unknown): ToolResult<RandomHexTokenBitsFromCharactersOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly characters?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "characters"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const charactersValue = candidate.characters;
if (typeof charactersValue !== "number" || !Number.isSafeInteger(charactersValue)) return issue("characters", "invalid_type", "Enter a finite safe integer.");
if (charactersValue < 0) return issue("characters", "out_of_range", "Value is outside the accepted range.");
if (charactersValue > 9007199254740991) return issue("characters", "out_of_range", "Value is outside the accepted range.");
  const input: RandomHexTokenBitsFromCharactersInput = { characters: charactersValue };
  return toolSuccess({ bits: (4n * BigInt(input.characters)).toString() });
};
export const example = {
  "input": {
    "characters": 32
  },
  "output": {
    "bits": "128"
  }
} satisfies ToolExample<RandomHexTokenBitsFromCharactersInput, RandomHexTokenBitsFromCharactersOutput>;
export const randomHexTokenBitsFromCharactersTool = defineTool<RandomHexTokenBitsFromCharactersInput, RandomHexTokenBitsFromCharactersOutput>({
  id: "cryptography/random-hex-token-bits-from-characters",
  title: "Random Hex Token Bits From Characters",
  description: "Return the ideal uniform-random capacity of a hexadecimal token from its number of independently random characters.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: randomHexTokenBitsFromCharactersInputSchema,
  outputSchema: randomHexTokenBitsFromCharactersOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "characters",
        "label": "Independent random hexadecimal character count",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      }
    ],
    "outputs": [
      {
        "id": "bits",
        "label": "Exact ideal bit capacity",
        "valueType": {
          "type": "string",
          "unit": "bit",
          "format": "integer-decimal"
        }
      }
    ]
  },
  execute: calculateRandomHexTokenBitsFromCharacters,
});
export const runRandomHexTokenBitsFromCharacters = randomHexTokenBitsFromCharactersTool.execute;
export default randomHexTokenBitsFromCharactersTool;
