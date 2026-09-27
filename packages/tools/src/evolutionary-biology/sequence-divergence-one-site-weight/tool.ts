import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly different: boolean;
  readonly siteWeight: number;
  readonly totalWeight: number;
};
export type Output = {
  readonly weightedMismatch: number;
  readonly divergenceContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    different: { type: "boolean" },
    siteWeight: { type: "number", minimum: 0 },
    totalWeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["different", "siteWeight", "totalWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedMismatch: { type: "number" },
    divergenceContribution: { type: "number" },
  },
  required: ["weightedMismatch", "divergenceContribution"],
} as const;
/** Calculate sequence divergence one site weight from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { different, siteWeight, totalWeight } = request;
  const compute = (): Output => {
    H.positive(totalWeight);
    H.domain(siteWeight >= 0 && siteWeight <= totalWeight);
    return {
      weightedMismatch: different ? siteWeight : 0,
      divergenceContribution: different ? siteWeight / totalWeight : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { different: true, siteWeight: 2, totalWeight: 100 },
  output: { weightedMismatch: 2, divergenceContribution: 0.02 },
} satisfies ToolExample<Input, Output>;
export const sequenceDivergenceOneSiteWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "evolutionary-biology/sequence-divergence-one-site-weight",
    title: "Sequence Divergence One Site Weight Tool",
    description:
      "Calculate sequence divergence one site weight from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        different: { type: "boolean" },
        siteWeight: { type: "number", minimum: 0 },
        totalWeight: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["different", "siteWeight", "totalWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weightedMismatch: { type: "number" },
        divergenceContribution: { type: "number" },
      },
      required: ["weightedMismatch", "divergenceContribution"],
    },
    ports: {
      inputs: [
        {
          id: "different",
          label: "Different",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "siteWeight",
          label: "Site Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalWeight",
          label: "Total Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "weightedMismatch",
          label: "Weighted Mismatch",
          valueType: { type: "number" },
        },
        {
          id: "divergenceContribution",
          label: "Divergence Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = sequenceDivergenceOneSiteWeightTool.execute;
export default sequenceDivergenceOneSiteWeightTool;
