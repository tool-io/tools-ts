import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseline: number;
  readonly target: number;
  readonly observed: number;
};
export type Output = {
  readonly targetChange: number;
  readonly achievedChange: number;
  readonly remainingGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseline: { type: "number" },
    target: { type: "number" },
    observed: { type: "number" },
  },
  required: ["baseline", "target", "observed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetChange: { type: "number" },
    achievedChange: { type: "number" },
    remainingGap: { type: "number" },
  },
  required: ["targetChange", "achievedChange", "remainingGap"],
} as const;
/** Describe target and observed changes from an explicit baseline without deciding which direction is desirable. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseline, target, observed } = request;
  const compute = (): Output => {
    return {
      targetChange: target - baseline,
      achievedChange: observed - baseline,
      remainingGap: target - observed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseline: 20, target: 50, observed: 35 },
  output: { targetChange: 30, achievedChange: 15, remainingGap: 15 },
} satisfies ToolExample<Input, Output>;
export const policyTargetBaselineGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/policy-target-baseline-gap",
    title: "Policy Target Baseline Gap Tool",
    description:
      "Describe target and observed changes from an explicit baseline without deciding which direction is desirable.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseline: { type: "number" },
        target: { type: "number" },
        observed: { type: "number" },
      },
      required: ["baseline", "target", "observed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetChange: { type: "number" },
        achievedChange: { type: "number" },
        remainingGap: { type: "number" },
      },
      required: ["targetChange", "achievedChange", "remainingGap"],
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
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "targetChange",
          label: "Target Change",
          valueType: { type: "number" },
        },
        {
          id: "achievedChange",
          label: "Achieved Change",
          valueType: { type: "number" },
        },
        {
          id: "remainingGap",
          label: "Remaining Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = policyTargetBaselineGapTool.execute;
export default policyTargetBaselineGapTool;
