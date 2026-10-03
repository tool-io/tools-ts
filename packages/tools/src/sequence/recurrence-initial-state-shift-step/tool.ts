import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly state: readonly number[];
  readonly next: number;
};
export type Output = {
  readonly state: readonly number[];
  readonly emitted: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    state: { type: "array", maxItems: 256, items: { type: "number" } },
    next: { type: "number" },
  },
  required: ["state", "next"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    state: { type: "array", maxItems: 256, items: { type: "number" } },
    emitted: { type: "number" },
  },
  required: ["state", "emitted"],
} as const;
/** Compute recurrence initial state shift step from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { state, next } = input;
  const compute = (): Output => {
    domain(state.length > 0);
    return { state: [...state.slice(1), next], emitted: state[0] };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { state: [1, 2, 3], next: 5 },
  output: { state: [2, 3, 5], emitted: 1 },
} satisfies ToolExample<Input, Output>;
export const recurrenceInitialStateShiftStepTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "sequence/recurrence-initial-state-shift-step",
  title: "Recurrence Initial State Shift Step Tool",
  description:
    "Compute recurrence initial state shift step from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "state",
        label: "State",
        required: true,
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "next",
        label: "Next",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      {
        id: "state",
        label: "State",
        valueType: { type: "list", items: { type: "number" } },
      },
      { id: "emitted", label: "Emitted", valueType: { type: "number" } },
    ],
  },
});
export const run = recurrenceInitialStateShiftStepTool.execute;
export default recurrenceInitialStateShiftStepTool;
