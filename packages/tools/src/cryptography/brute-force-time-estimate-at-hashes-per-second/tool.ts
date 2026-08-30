import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type BruteForceTimeEstimateAtHashesPerSecondInput = {
  readonly keyspace: number;
  readonly guessesPerSecond: number;
};
export type BruteForceTimeEstimateAtHashesPerSecondOutput = {
  readonly exhaustiveSeconds: number;
  readonly averageSeconds: number;
};
export const bruteForceTimeEstimateAtHashesPerSecondInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "keyspace": {
      "type": "integer",
      "minimum": 1,
      "description": "Keyspace size",
      "maximum": 9007199254740991
    },
    "guessesPerSecond": {
      "type": "number",
      "exclusiveMinimum": 0,
      "description": "Guess rate"
    }
  },
  "required": [
    "keyspace",
    "guessesPerSecond"
  ]
} as const satisfies ToolJsonSchema;
export const bruteForceTimeEstimateAtHashesPerSecondOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "exhaustiveSeconds": {
      "type": "number",
      "minimum": 0,
      "description": "Exhaustive search time"
    },
    "averageSeconds": {
      "type": "number",
      "minimum": 0,
      "description": "Mean search time"
    }
  },
  "required": [
    "exhaustiveSeconds",
    "averageSeconds"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://cacr.uwaterloo.ca/hac/about/chap2.pdf
export const calculateBruteForceTimeEstimateAtHashesPerSecond = (rawInput: unknown): ToolResult<BruteForceTimeEstimateAtHashesPerSecondOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly keyspace?: unknown; readonly guessesPerSecond?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "keyspace",
  "guessesPerSecond"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const keyspaceValue = candidate.keyspace;
if (typeof keyspaceValue !== "number" || !Number.isSafeInteger(keyspaceValue)) return issue("keyspace", "invalid_type", "Enter a finite number.");
if (keyspaceValue > 9007199254740991) return issue("keyspace", "out_of_range", "Keyspace exceeds safe integer range.");
if (keyspaceValue < 1) return issue("keyspace", "out_of_range", "Value is outside the accepted range.");
const guessesPerSecondValue = candidate.guessesPerSecond;
if (typeof guessesPerSecondValue !== "number" || !Number.isFinite(guessesPerSecondValue)) return issue("guessesPerSecond", "invalid_type", "Enter a finite number.");
if (guessesPerSecondValue <= 0) return issue("guessesPerSecond", "out_of_range", "Value is outside the accepted range.");
  const input: BruteForceTimeEstimateAtHashesPerSecondInput = { keyspace: keyspaceValue, guessesPerSecond: guessesPerSecondValue };
  const exhaustiveSeconds = input.keyspace / input.guessesPerSecond;
  const averageSeconds = (input.keyspace / 2 + 0.5) / input.guessesPerSecond;
  if (!Number.isFinite(exhaustiveSeconds) || !Number.isFinite(averageSeconds)) return issue("guessesPerSecond", "numeric_overflow", "Search times exceed finite number range.");
  return toolSuccess({ exhaustiveSeconds, averageSeconds });
};
export const example = {
  "input": {
    "keyspace": 999,
    "guessesPerSecond": 100
  },
  "output": {
    "exhaustiveSeconds": 9.99,
    "averageSeconds": 5
  }
} satisfies ToolExample<BruteForceTimeEstimateAtHashesPerSecondInput, BruteForceTimeEstimateAtHashesPerSecondOutput>;
export const bruteForceTimeEstimateAtHashesPerSecondTool = defineTool<BruteForceTimeEstimateAtHashesPerSecondInput, BruteForceTimeEstimateAtHashesPerSecondOutput>({
  id: "cryptography/brute-force-time-estimate-at-hashes-per-second",
  title: "Brute-Force Time Estimate At Hash Rate",
  description: "Estimate exhaustive and average search time for a known finite keyspace and a positive constant guess rate, assuming one uniformly located target.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: bruteForceTimeEstimateAtHashesPerSecondInputSchema,
  outputSchema: bruteForceTimeEstimateAtHashesPerSecondOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "keyspace",
        "label": "Keyspace size",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "guessesPerSecond",
        "label": "Guess rate",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "1/s"
        }
      }
    ],
    "outputs": [
      {
        "id": "exhaustiveSeconds",
        "label": "Exhaustive search time",
        "valueType": {
          "type": "number",
          "unit": "s"
        }
      },
      {
        "id": "averageSeconds",
        "label": "Mean search time",
        "valueType": {
          "type": "number",
          "unit": "s"
        }
      }
    ]
  },
  execute: calculateBruteForceTimeEstimateAtHashesPerSecond,
});
export const runBruteForceTimeEstimateAtHashesPerSecond = bruteForceTimeEstimateAtHashesPerSecondTool.execute;
export default bruteForceTimeEstimateAtHashesPerSecondTool;
