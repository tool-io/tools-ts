import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedReturn: number;
  readonly targetReturn: number;
  readonly observations: number;
};
export type Output = {
  readonly shortfall: number;
  readonly squaredContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedReturn: { type: "number" },
    targetReturn: { type: "number" },
    observations: { type: "integer", minimum: 1 },
  },
  required: ["observedReturn", "targetReturn", "observations"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shortfall: { type: "number" },
    squaredContribution: { type: "number" },
  },
  required: ["shortfall", "squaredContribution"],
} as const;
/** One full-sample lower partial second-moment contribution, using all observations as denominator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedReturn, targetReturn, observations } = request;
  const compute = (): Output => {
    H.integer(observations, 1);
    return {
      shortfall: Math.min(0, observedReturn - targetReturn),
      squaredContribution:
        Math.min(0, observedReturn - targetReturn) ** 2 / observations,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedReturn: -0.05, targetReturn: 0, observations: 10 },
  output: { shortfall: -0.05, squaredContribution: 0.00025000000000000006 },
} satisfies ToolExample<Input, Output>;
export const downsideDeviationOneReturnTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/downside-deviation-one-return-term",
    title: "Downside Deviation One Return Term Tool",
    description:
      "One full-sample lower partial second-moment contribution, using all observations as denominator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedReturn: { type: "number" },
        targetReturn: { type: "number" },
        observations: { type: "integer", minimum: 1 },
      },
      required: ["observedReturn", "targetReturn", "observations"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shortfall: { type: "number" },
        squaredContribution: { type: "number" },
      },
      required: ["shortfall", "squaredContribution"],
    },
    ports: {
      inputs: [
        {
          id: "observedReturn",
          label: "Observed Return",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetReturn",
          label: "Target Return",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observations",
          label: "Observations",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "shortfall", label: "Shortfall", valueType: { type: "number" } },
        {
          id: "squaredContribution",
          label: "Squared Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = downsideDeviationOneReturnTermTool.execute;
export default downsideDeviationOneReturnTermTool;
