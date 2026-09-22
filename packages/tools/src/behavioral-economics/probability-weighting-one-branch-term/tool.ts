import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly probability: number; readonly gamma: number };
export type Output = { readonly weight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probability: { type: "number", minimum: 0, maximum: 1 },
    gamma: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["probability", "gamma"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weight: { type: "number" } },
  required: ["weight"],
} as const;
/** Tversky-Kahneman one-parameter weighting w(p)=p^gamma/[p^gamma+(1-p)^gamma]^(1/gamma), not the Prelec variant. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { probability, gamma } = request;
  const compute = (): Output => {
    H.probability(probability);
    H.positive(gamma);
    return {
      weight:
        probability === 0
          ? 0
          : probability === 1
            ? 1
            : probability ** gamma /
              (probability ** gamma + (1 - probability) ** gamma) **
                (1 / gamma),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { probability: 0.5, gamma: 1 },
  output: { weight: 0.5 },
} satisfies ToolExample<Input, Output>;
export const probabilityWeightingOneBranchTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-economics/probability-weighting-one-branch-term",
    title: "Probability Weighting One Branch Term Tool",
    description:
      "Tversky-Kahneman one-parameter weighting w(p)=p^gamma/[p^gamma+(1-p)^gamma]^(1/gamma), not the Prelec variant.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        probability: { type: "number", minimum: 0, maximum: 1 },
        gamma: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["probability", "gamma"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { weight: { type: "number" } },
      required: ["weight"],
    },
    ports: {
      inputs: [
        {
          id: "probability",
          label: "Probability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gamma",
          label: "Gamma",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "weight", label: "Weight", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = probabilityWeightingOneBranchTermTool.execute;
export default probabilityWeightingOneBranchTermTool;
