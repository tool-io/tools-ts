import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type TimeBasedTotpStepRemainingSecondsInput = {
  readonly now: number;
  readonly epoch: number;
  readonly step: number;
};
export type TimeBasedTotpStepRemainingSecondsOutput = {
  readonly counter: string;
  readonly remainingSeconds: number;
};
export const timeBasedTotpStepRemainingSecondsInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "now": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Reference epoch seconds"
    },
    "epoch": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Step origin epoch seconds"
    },
    "step": {
      "type": "integer",
      "minimum": 1,
      "maximum": 9007199254740991,
      "description": "Time-step seconds"
    }
  },
  "required": [
    "now",
    "epoch",
    "step"
  ]
} as const satisfies ToolJsonSchema;
export const timeBasedTotpStepRemainingSecondsOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "counter": {
      "type": "string",
      "description": "Exact moving counter"
    },
    "remainingSeconds": {
      "type": "integer",
      "minimum": 1,
      "maximum": 9007199254740991,
      "description": "Whole seconds until next step"
    }
  },
  "required": [
    "counter",
    "remainingSeconds"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.rfc-editor.org/rfc/rfc6238
export const calculateTimeBasedTotpStepRemainingSeconds = (rawInput: unknown): ToolResult<TimeBasedTotpStepRemainingSecondsOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly now?: unknown; readonly epoch?: unknown; readonly step?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "now",
  "epoch",
  "step"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const nowValue = candidate.now;
if (typeof nowValue !== "number" || !Number.isSafeInteger(nowValue)) return issue("now", "invalid_type", "Enter a finite safe integer.");
if (nowValue < 0) return issue("now", "out_of_range", "Value is outside the accepted range.");
if (nowValue > 9007199254740991) return issue("now", "out_of_range", "Value is outside the accepted range.");
const epochValue = candidate.epoch;
if (typeof epochValue !== "number" || !Number.isSafeInteger(epochValue)) return issue("epoch", "invalid_type", "Enter a finite safe integer.");
if (epochValue < 0) return issue("epoch", "out_of_range", "Value is outside the accepted range.");
if (epochValue > 9007199254740991) return issue("epoch", "out_of_range", "Value is outside the accepted range.");
const stepValue = candidate.step;
if (typeof stepValue !== "number" || !Number.isSafeInteger(stepValue)) return issue("step", "invalid_type", "Enter a finite safe integer.");
if (stepValue < 1) return issue("step", "out_of_range", "Value is outside the accepted range.");
if (stepValue > 9007199254740991) return issue("step", "out_of_range", "Value is outside the accepted range.");
  const input: TimeBasedTotpStepRemainingSecondsInput = { now: nowValue, epoch: epochValue, step: stepValue };
  if (input.now < input.epoch) return issue("now", "before_epoch", "Reference time must not precede the step origin.");
  const elapsed = BigInt(input.now) - BigInt(input.epoch), step = BigInt(input.step);
  return toolSuccess({ counter: (elapsed / step).toString(), remainingSeconds: Number(step - elapsed % step) });
};
export const example = {
  "input": {
    "now": 59,
    "epoch": 0,
    "step": 30
  },
  "output": {
    "counter": "1",
    "remainingSeconds": 1
  }
} satisfies ToolExample<TimeBasedTotpStepRemainingSecondsInput, TimeBasedTotpStepRemainingSecondsOutput>;
export const timeBasedTotpStepRemainingSecondsTool = defineTool<TimeBasedTotpStepRemainingSecondsInput, TimeBasedTotpStepRemainingSecondsOutput>({
  id: "cryptography/time-based-totp-step-remaining-seconds",
  title: "TOTP Step Remaining Seconds",
  description: "Calculate the TOTP moving counter and whole seconds remaining in its current time step from explicit epoch seconds.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: timeBasedTotpStepRemainingSecondsInputSchema,
  outputSchema: timeBasedTotpStepRemainingSecondsOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "now",
        "label": "Reference epoch seconds",
        "required": true,
        "valueType": {
          "type": "integer",
          "unit": "s"
        }
      },
      {
        "id": "epoch",
        "label": "Step origin epoch seconds",
        "required": true,
        "valueType": {
          "type": "integer",
          "unit": "s"
        }
      },
      {
        "id": "step",
        "label": "Time-step seconds",
        "required": true,
        "valueType": {
          "type": "integer",
          "unit": "s"
        }
      }
    ],
    "outputs": [
      {
        "id": "counter",
        "label": "Exact moving counter",
        "valueType": {
          "type": "string",
          "format": "integer-decimal"
        }
      },
      {
        "id": "remainingSeconds",
        "label": "Whole seconds until next step",
        "valueType": {
          "type": "integer",
          "unit": "s"
        }
      }
    ]
  },
  execute: calculateTimeBasedTotpStepRemainingSeconds,
});
export const runTimeBasedTotpStepRemainingSeconds = timeBasedTotpStepRemainingSecondsTool.execute;
export default timeBasedTotpStepRemainingSecondsTool;
