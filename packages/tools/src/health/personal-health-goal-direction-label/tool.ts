import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly baseline: number; readonly target: number };
export type Output = { readonly direction: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { baseline: { type: "number" }, target: { type: "number" } },
  required: ["baseline", "target"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { direction: { type: "string", maxLength: 8192 } },
  required: ["direction"],
} as const;
/** Describe the numerical direction of a caller-selected health goal without recommending a target. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseline, target } = request;
  const compute = (): Output => {
    return {
      direction:
        target > baseline
          ? "increase"
          : target < baseline
            ? "decrease"
            : "maintain",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseline: 30, target: 45 },
  output: { direction: "increase" },
} satisfies ToolExample<Input, Output>;
export const personalHealthGoalDirectionLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health/personal-health-goal-direction-label",
    title: "Personal Health Goal Direction Label Tool",
    description:
      "Describe the numerical direction of a caller-selected health goal without recommending a target.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { baseline: { type: "number" }, target: { type: "number" } },
      required: ["baseline", "target"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { direction: { type: "string", maxLength: 8192 } },
      required: ["direction"],
    },
    ports: {
      inputs: [
        {
          id: "baseline",
          label: "Baseline",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "target",
          label: "Target",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "direction", label: "Direction", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = personalHealthGoalDirectionLabelTool.execute;
export default personalHealthGoalDirectionLabelTool;
