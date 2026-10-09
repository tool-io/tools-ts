import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly generalCollateralRate: number;
  readonly specialRepoRate: number;
};
export type Output = { readonly specialnessRateGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    generalCollateralRate: { type: "number" },
    specialRepoRate: { type: "number" },
  },
  required: ["generalCollateralRate", "specialRepoRate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { specialnessRateGap: { type: "number" } },
  required: ["specialnessRateGap"],
} as const;
/** Calculate general-collateral minus special repo rate on explicitly matching term and annualization bases, using fractional rates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { generalCollateralRate, specialRepoRate } = request;
  const compute = (): Output => {
    return { specialnessRateGap: generalCollateralRate - specialRepoRate };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { generalCollateralRate: 0.05, specialRepoRate: 0.02 },
  output: { specialnessRateGap: 0.030000000000000002 },
} satisfies ToolExample<Input, Output>;
export const repoSpecialnessReferenceRateGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/repo-specialness-reference-rate-gap",
    title: "Repo Specialness Reference Rate Gap Tool",
    description:
      "Calculate general-collateral minus special repo rate on explicitly matching term and annualization bases, using fractional rates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        generalCollateralRate: { type: "number" },
        specialRepoRate: { type: "number" },
      },
      required: ["generalCollateralRate", "specialRepoRate"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { specialnessRateGap: { type: "number" } },
      required: ["specialnessRateGap"],
    },
    ports: {
      inputs: [
        {
          id: "generalCollateralRate",
          label: "General Collateral Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "specialRepoRate",
          label: "Special Repo Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "specialnessRateGap",
          label: "Specialness Rate Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = repoSpecialnessReferenceRateGapTool.execute;
export default repoSpecialnessReferenceRateGapTool;
