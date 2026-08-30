import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type StepsTimingJumpEndStartCountInput = {
  readonly steps: number;
  readonly position: "jump-start" | "jump-end";
  readonly progress: number;
  readonly before: boolean;
};
export type StepsTimingJumpEndStartCountOutput = {
  readonly jumps: number;
  readonly outputProgress: number;
};
export const stepsTimingJumpEndStartCountInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "steps": {
      "type": "integer",
      "minimum": 1,
      "maximum": 9007199254740991,
      "description": "Step count"
    },
    "position": {
      "type": "string",
      "enum": [
        "jump-start",
        "jump-end"
      ],
      "description": "Step position"
    },
    "progress": {
      "type": "number",
      "minimum": 0,
      "maximum": 1,
      "description": "Input progress"
    },
    "before": {
      "type": "boolean",
      "description": "Before discontinuity flag"
    }
  },
  "required": [
    "steps",
    "position",
    "progress",
    "before"
  ]
} as const satisfies ToolJsonSchema;
export const stepsTimingJumpEndStartCountOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "jumps": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Jump count"
    },
    "outputProgress": {
      "type": "number",
      "minimum": 0,
      "maximum": 1,
      "description": "Output progress"
    }
  },
  "required": [
    "jumps",
    "outputProgress"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.w3.org/TR/css-easing-2/
export const calculateStepsTimingJumpEndStartCount = (rawInput: unknown): ToolResult<StepsTimingJumpEndStartCountOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly steps?: unknown; readonly position?: unknown; readonly progress?: unknown; readonly before?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "steps",
  "position",
  "progress",
  "before"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const stepsValue = candidate.steps;
  if (typeof stepsValue !== "number" || !Number.isSafeInteger(stepsValue)) return issue("steps", "invalid_type", "Enter a finite safe integer.");
  if (stepsValue < 1) return issue("steps", "out_of_range", "Value is outside the accepted range.");
  if (stepsValue > 9007199254740991) return issue("steps", "out_of_range", "Value is outside the accepted range.");
  const positionValue = candidate.position;
  if (typeof positionValue !== "string") return issue("position", "invalid_type", "Enter a string value.");
  if (positionValue !== "jump-start" && positionValue !== "jump-end") return issue("position", "invalid_value", "Choose a supported value.");
  const progressValue = candidate.progress;
  if (typeof progressValue !== "number" || !Number.isFinite(progressValue)) return issue("progress", "invalid_type", "Enter a finite number.");
  if (progressValue < 0) return issue("progress", "out_of_range", "Value is outside the accepted range.");
  if (progressValue > 1) return issue("progress", "out_of_range", "Value is outside the accepted range.");
  const beforeValue = candidate.before;
  if (typeof beforeValue !== "boolean") return issue("before", "invalid_type", "Enter a boolean value.");

  const input: StepsTimingJumpEndStartCountInput = { steps: stepsValue, position: positionValue, progress: progressValue, before: beforeValue };
  const product = input.progress * input.steps;
  let current = Math.floor(product) + (input.position === "jump-start" ? 1 : 0);
  if (input.before && Number.isInteger(product)) current--;
  current = Math.max(0, Math.min(input.steps, current));
  return toolSuccess({ jumps: input.steps, outputProgress: current / input.steps });
};
export const example = {
  input: {
    "steps": 4,
    "position": "jump-end",
    "progress": 0.5,
    "before": false
  },
  output: {
    "jumps": 4,
    "outputProgress": 0.5
  },
} satisfies ToolExample<StepsTimingJumpEndStartCountInput, StepsTimingJumpEndStartCountOutput>;
export const stepsTimingJumpEndStartCountTool = defineTool<StepsTimingJumpEndStartCountInput, StepsTimingJumpEndStartCountOutput>({
  id: "css/steps-timing-jump-end-start-count",
  title: "steps() Jump-End/Start Count",
  description: "Evaluate CSS steps timing at progress zero through one for jump-start or jump-end, including the before flag.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: stepsTimingJumpEndStartCountInputSchema,
  outputSchema: stepsTimingJumpEndStartCountOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "steps",
        "label": "Step count",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "position",
        "label": "Step position",
        "required": true,
        "valueType": {
          "type": "string"
        }
      },
      {
        "id": "progress",
        "label": "Input progress",
        "required": true,
        "valueType": {
          "type": "number"
        }
      },
      {
        "id": "before",
        "label": "Before discontinuity flag",
        "required": true,
        "valueType": {
          "type": "boolean"
        }
      }
    ],
    "outputs": [
      {
        "id": "jumps",
        "label": "Jump count",
        "valueType": {
          "type": "integer"
        }
      },
      {
        "id": "outputProgress",
        "label": "Output progress",
        "valueType": {
          "type": "number"
        }
      }
    ]
  },
  execute: calculateStepsTimingJumpEndStartCount,
});
export const runStepsTimingJumpEndStartCount = stepsTimingJumpEndStartCountTool.execute;
export default stepsTimingJumpEndStartCountTool;
