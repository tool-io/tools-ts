import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstWeight: number;
  readonly secondWeight: number;
  readonly normalization: number;
};
export type Output = { readonly overlapContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstWeight: { type: "number", minimum: 0 },
    secondWeight: { type: "number", minimum: 0 },
    normalization: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstWeight", "secondWeight", "normalization"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { overlapContribution: { type: "number" } },
  required: ["overlapContribution"],
} as const;
/** One weighted histogram-intersection token contribution with an explicitly supplied global normalization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstWeight, secondWeight, normalization } = request;
  const compute = (): Output => {
    H.domain(firstWeight >= 0 && secondWeight >= 0);
    H.positive(normalization);
    return {
      overlapContribution: Math.min(firstWeight, secondWeight) / normalization,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstWeight: 3, secondWeight: 5, normalization: 10 },
  output: { overlapContribution: 0.3 },
} satisfies ToolExample<Input, Output>;
export const tokenWeightOverlapContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/token-weight-overlap-contribution",
    title: "Token Weight Overlap Contribution Tool",
    description:
      "One weighted histogram-intersection token contribution with an explicitly supplied global normalization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstWeight: { type: "number", minimum: 0 },
        secondWeight: { type: "number", minimum: 0 },
        normalization: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstWeight", "secondWeight", "normalization"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { overlapContribution: { type: "number" } },
      required: ["overlapContribution"],
    },
    ports: {
      inputs: [
        {
          id: "firstWeight",
          label: "First Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondWeight",
          label: "Second Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "normalization",
          label: "Normalization",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "overlapContribution",
          label: "Overlap Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tokenWeightOverlapContributionTool.execute;
export default tokenWeightOverlapContributionTool;
