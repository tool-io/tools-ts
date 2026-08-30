import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type AnimationKeyframePercentEvenSplitInput = {
  readonly count: number;
};
export type AnimationKeyframePercentEvenSplitOutput = {
  readonly percentages: ReadonlyArray<number>;
};
export const animationKeyframePercentEvenSplitInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "count": {
      "type": "integer",
      "minimum": 2,
      "maximum": 10000,
      "description": "Count"
    }
  },
  "required": [
    "count"
  ]
} as const satisfies ToolJsonSchema;
export const animationKeyframePercentEvenSplitOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "percentages": {
      "type": "array",
      "items": {
        "type": "number",
        "minimum": 0,
        "maximum": 100
      },
      "description": "Keyframe percentages"
    }
  },
  "required": [
    "percentages"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.w3.org/TR/css-animations-1/#keyframes
export const calculateAnimationKeyframePercentEvenSplit = (rawInput: unknown): ToolResult<AnimationKeyframePercentEvenSplitOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly count?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "count"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const countValue = candidate.count;
  if (typeof countValue !== "number" || !Number.isSafeInteger(countValue)) return issue("count", "invalid_type", "Enter a finite safe integer.");
  if (countValue < 2) return issue("count", "out_of_range", "Value is outside the accepted range.");
  if (countValue > 10000) return issue("count", "out_of_range", "Value is outside the accepted range.");
  const input: AnimationKeyframePercentEvenSplitInput = { count: countValue };
  const percentages = Array.from({ length: input.count }, (_, index) => index === input.count - 1 ? 100 : 100 * index / (input.count - 1));
  return toolSuccess({ percentages });
};
export const example = {
  input: {
    "count": 5
  },
  output: {
    "percentages": [
      0,
      25,
      50,
      75,
      100
    ]
  },
} satisfies ToolExample<AnimationKeyframePercentEvenSplitInput, AnimationKeyframePercentEvenSplitOutput>;
export const animationKeyframePercentEvenSplitTool = defineTool<AnimationKeyframePercentEvenSplitInput, AnimationKeyframePercentEvenSplitOutput>({
  id: "css/animation-keyframe-percent-even-split",
  title: "Keyframe Percent Even Split Calculator",
  description: "Generate evenly spaced keyframe percentages including 0 and 100 from a count of at least two, returning full number precision and limiting materialization to 10,000 offsets.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: animationKeyframePercentEvenSplitInputSchema,
  outputSchema: animationKeyframePercentEvenSplitOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "count",
        "label": "Count",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      }
    ],
    "outputs": [
      {
        "id": "percentages",
        "label": "Keyframe percentages",
        "valueType": {
          "type": "list",
          "items": {
            "type": "number"
          }
        }
      }
    ]
  },
  execute: calculateAnimationKeyframePercentEvenSplit,
});
export const runAnimationKeyframePercentEvenSplit = animationKeyframePercentEvenSplitTool.execute;
export default animationKeyframePercentEvenSplitTool;
