import { defineTool, type ToolJsonSchema } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { invalidInput, toolSuccess, type ToolResult } from "../../core/result.js";

export type TransitionDelayStaggerIncrementInput = {
  readonly initialDelay: number;
  readonly increment: number;
  readonly index: number;
};
export type TransitionDelayStaggerIncrementOutput = {
  readonly delay: number;
};
export const transitionDelayStaggerIncrementInputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "initialDelay": {
      "type": "number",
      "description": "Initial delay"
    },
    "increment": {
      "type": "number",
      "minimum": 0,
      "description": "Delay increment"
    },
    "index": {
      "type": "integer",
      "minimum": 0,
      "maximum": 9007199254740991,
      "description": "Zero-based item index"
    }
  },
  "required": [
    "initialDelay",
    "increment",
    "index"
  ]
} as const satisfies ToolJsonSchema;
export const transitionDelayStaggerIncrementOutputSchema = {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "delay": {
      "type": "number",
      "description": "Transition delay"
    }
  },
  "required": [
    "delay"
  ]
} as const satisfies ToolJsonSchema;
const issue = (field: string, code: string, message: string): ToolResult<never> =>
  invalidInput([{ field, code, message }]);

// Reference: https://www.w3.org/TR/css-transitions-1/#transition-delay-property
export const calculateTransitionDelayStaggerIncrement = (rawInput: unknown): ToolResult<TransitionDelayStaggerIncrementOutput> => {
  if (typeof rawInput !== "object" || rawInput === null || Array.isArray(rawInput))
    return issue("", "object_required", "Input must be an object.");
  const candidate = rawInput as { readonly initialDelay?: unknown; readonly increment?: unknown; readonly index?: unknown; };
  for (const key of Object.keys(candidate)) {
    if (![
  "initialDelay",
  "increment",
  "index"
].includes(key)) return issue(key, "unknown_field", "Unsupported input field.");
  }
  const initialDelayValue = candidate.initialDelay;
  if (typeof initialDelayValue !== "number" || !Number.isFinite(initialDelayValue)) return issue("initialDelay", "invalid_type", "Enter a finite number.");
  const incrementValue = candidate.increment;
  if (typeof incrementValue !== "number" || !Number.isFinite(incrementValue)) return issue("increment", "invalid_type", "Enter a finite number.");
  if (incrementValue < 0) return issue("increment", "out_of_range", "Value is outside the accepted range.");
  const indexValue = candidate.index;
  if (typeof indexValue !== "number" || !Number.isSafeInteger(indexValue)) return issue("index", "invalid_type", "Enter a finite safe integer.");
  if (indexValue < 0) return issue("index", "out_of_range", "Value is outside the accepted range.");
  if (indexValue > 9007199254740991) return issue("index", "out_of_range", "Value is outside the accepted range.");

  const input: TransitionDelayStaggerIncrementInput = { initialDelay: initialDelayValue, increment: incrementValue, index: indexValue };
  let delay = input.initialDelay + input.increment * input.index;
  if (!Number.isFinite(delay) && input.increment > 0) delay = input.increment * (input.initialDelay / input.increment + input.index);
  if (!Number.isFinite(delay)) return issue("index", "numeric_overflow", "The resulting delay exceeds finite number range.");
  return toolSuccess({ delay: delay === 0 ? 0 : delay });
};
export const example = {
  input: {
    "initialDelay": 50,
    "increment": 25,
    "index": 3
  },
  output: {
    "delay": 125
  },
} satisfies ToolExample<TransitionDelayStaggerIncrementInput, TransitionDelayStaggerIncrementOutput>;
export const transitionDelayStaggerIncrementTool = defineTool<TransitionDelayStaggerIncrementInput, TransitionDelayStaggerIncrementOutput>({
  id: "css/transition-delay-stagger-increment",
  title: "Transition Delay Stagger Increment",
  description: "Calculate the delay of a zero-based staggered transition from an initial delay and a nonnegative increment.",
  contractVersion: 1,
  execution: { kind: "pure" },
  inputSchema: transitionDelayStaggerIncrementInputSchema,
  outputSchema: transitionDelayStaggerIncrementOutputSchema,
  ports: {
    "inputs": [
      {
        "id": "initialDelay",
        "label": "Initial delay",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "ms"
        }
      },
      {
        "id": "increment",
        "label": "Delay increment",
        "required": true,
        "valueType": {
          "type": "number",
          "unit": "ms"
        }
      },
      {
        "id": "index",
        "label": "Zero-based item index",
        "required": true,
        "valueType": {
          "type": "integer"
        }
      }
    ],
    "outputs": [
      {
        "id": "delay",
        "label": "Transition delay",
        "valueType": {
          "type": "number",
          "unit": "ms"
        }
      }
    ]
  },
  execute: calculateTransitionDelayStaggerIncrement,
});
export const runTransitionDelayStaggerIncrement = transitionDelayStaggerIncrementTool.execute;
export default transitionDelayStaggerIncrementTool;
