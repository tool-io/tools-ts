import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly start: number;
  readonly target: number;
  readonly step: number;
};
export type Output = { readonly reachable: boolean; readonly steps: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "integer", minimum: 0, maximum: 6 },
    target: { type: "integer", minimum: 0, maximum: 6 },
    step: { type: "integer" },
  },
  required: ["start", "target", "step"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reachable: { type: "boolean" }, steps: { type: "integer" } },
  required: ["reachable", "steps"],
} as const;
/** Calculate weekday periodic step reachability from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { start, target, step } = input;
  const compute = (): Output => {
    H.integer(start, 0, 6);
    H.integer(target, 0, 6);
    for (let n = 0; n < 7; n++)
      if (H.mod(start + n * H.mod(step, 7), 7) === target)
        return { reachable: true, steps: n };
    return { reachable: false, steps: -1 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { start: 1, target: 4, step: 2 },
  output: { reachable: true, steps: 5 },
} satisfies ToolExample<Input, Output>;
export const weekdayPeriodicStepReachabilityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "date/weekday-periodic-step-reachability",
    title: "Weekday Periodic Step Reachability Tool",
    description:
      "Calculate weekday periodic step reachability from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        start: { type: "integer", minimum: 0, maximum: 6 },
        target: { type: "integer", minimum: 0, maximum: 6 },
        step: { type: "integer" },
      },
      required: ["start", "target", "step"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reachable: { type: "boolean" },
        steps: { type: "integer" },
      },
      required: ["reachable", "steps"],
    },
    ports: {
      inputs: [
        {
          id: "start",
          label: "Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "target",
          label: "Target",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "step",
          label: "Step",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "reachable", label: "Reachable", valueType: { type: "boolean" } },
        { id: "steps", label: "Steps", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = weekdayPeriodicStepReachabilityTool.execute;
export default weekdayPeriodicStepReachabilityTool;
