import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: number;
  readonly baseline: number;
  readonly target: number;
};
export type Output = {
  readonly targetGap: number;
  readonly baselineChange: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "number" },
    baseline: { type: "number" },
    target: { type: "number" },
  },
  required: ["observed", "baseline", "target"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetGap: { type: "number" },
    baselineChange: { type: "number" },
  },
  required: ["targetGap", "baselineChange"],
} as const;
/** Compare an explicit indicator with supplied baseline and target values without choosing a desirable direction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, baseline, target } = request;
  const compute = (): Output => {
    return {
      targetGap: target - observed,
      baselineChange: observed - baseline,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: 70, baseline: 50, target: 100 },
  output: { targetGap: 30, baselineChange: 20 },
} satisfies ToolExample<Input, Output>;
export const globalTargetBaselineDistanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["global-studies", "global studies", "social sciences"],
      keywords: ["global studies", "social sciences"],
    },
    id: "global-studies/global-target-baseline-distance",
    title: "Global Target Baseline Distance",
    description:
      "Compare an explicit indicator with supplied baseline and target values without choosing a desirable direction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observed: { type: "number" },
        baseline: { type: "number" },
        target: { type: "number" },
      },
      required: ["observed", "baseline", "target"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetGap: { type: "number" },
        baselineChange: { type: "number" },
      },
      required: ["targetGap", "baselineChange"],
    },
    ports: {
      inputs: [
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "number" },
        },
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
        { id: "targetGap", label: "Target Gap", valueType: { type: "number" } },
        {
          id: "baselineChange",
          label: "Baseline Change",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = globalTargetBaselineDistanceTool.execute;
export default globalTargetBaselineDistanceTool;
