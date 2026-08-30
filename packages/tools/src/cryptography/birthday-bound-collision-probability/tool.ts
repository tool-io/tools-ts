import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type BirthdayBoundCollisionProbabilityInput = {
  readonly spaceSize: number;
  readonly sampleCount: number;
};
export type BirthdayBoundCollisionProbabilityOutput = {
  readonly probability: number;
};
export const birthdayBoundCollisionProbabilityInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "spaceSize": {
      "type": "integer",
      "minimum": 1,
      "maximum": 9007199254740991,
      "description": "Outcome space size"
    },
    "sampleCount": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Sample count"
    }
  },
  "required": [
    "spaceSize",
    "sampleCount"
  ]
} as const satisfies ToolJsonSchema;
export const birthdayBoundCollisionProbabilityOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "probability": {
      "type": "number",
      "minimum": 0,
      "maximum": 1,
      "description": "Approximate collision probability"
    }
  },
  "required": [
    "probability"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://cacr.uwaterloo.ca/hac/about/chap2.pdf
export const calculateBirthdayBoundCollisionProbability = (rawInput: unknown): ToolResult<BirthdayBoundCollisionProbabilityOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly spaceSize?: unknown; readonly sampleCount?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "spaceSize",
  "sampleCount"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const spaceSizeValue = candidate.spaceSize;
if (typeof spaceSizeValue !== "number" || !Number.isSafeInteger(spaceSizeValue)) return issue("spaceSize", "invalid_type", "Enter a finite safe integer.");
if (spaceSizeValue < 1) return issue("spaceSize", "out_of_range", "Value is outside the accepted range.");
if (spaceSizeValue > 9007199254740991) return issue("spaceSize", "out_of_range", "Value is outside the accepted range.");
const sampleCountValue = candidate.sampleCount;
if (typeof sampleCountValue !== "number" || !Number.isSafeInteger(sampleCountValue)) return issue("sampleCount", "invalid_type", "Enter a finite safe integer.");
if (sampleCountValue < 0) return issue("sampleCount", "out_of_range", "Value is outside the accepted range.");
if (sampleCountValue > 9007199254740991) return issue("sampleCount", "out_of_range", "Value is outside the accepted range.");
  const input: BirthdayBoundCollisionProbabilityInput = { spaceSize: spaceSizeValue, sampleCount: sampleCountValue };
  if (input.sampleCount > input.spaceSize) return toolSuccess({ probability: 1 });
  const exponent = (input.sampleCount / input.spaceSize) * ((input.sampleCount - 1) / 2);
  return toolSuccess({ probability: input.sampleCount < 2 ? 0 : -Math.expm1(-exponent) });
};
export const example = {
  "input": {
    "spaceSize": 365,
    "sampleCount": 23
  },
  "output": {
    "probability": 0.5000017521827106
  }
} satisfies ToolExample<BirthdayBoundCollisionProbabilityInput, BirthdayBoundCollisionProbabilityOutput>;
export const birthdayBoundCollisionProbabilityTool = defineTool<BirthdayBoundCollisionProbabilityInput, BirthdayBoundCollisionProbabilityOutput>({
  id: "cryptography/birthday-bound-collision-probability",
  title: "Birthday-Bound Collision Probability",
  description: "Calculate the standard birthday collision approximation for independent uniform samples from a finite outcome space.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: birthdayBoundCollisionProbabilityInputSchema,
  outputSchema: birthdayBoundCollisionProbabilityOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "spaceSize",
        "label": "Outcome space size",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "sampleCount",
        "label": "Sample count",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      }
    ],
    "outputs": [
      {
        "id": "probability",
        "label": "Approximate collision probability",
        "valueType": {
          "type": "number"
        }
      }
    ]
  },
  execute: calculateBirthdayBoundCollisionProbability,
});
export const runBirthdayBoundCollisionProbability = birthdayBoundCollisionProbabilityTool.execute;
export default birthdayBoundCollisionProbabilityTool;
