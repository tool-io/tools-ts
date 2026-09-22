import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleMass: number;
  readonly sampleCount: number;
  readonly cohortCount: number;
};
export type Output = {
  readonly meanMass: number;
  readonly estimatedBiomass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleMass: { type: "number", minimum: 0 },
    sampleCount: { type: "integer", minimum: 1 },
    cohortCount: { type: "integer" },
  },
  required: ["sampleMass", "sampleCount", "cohortCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meanMass: { type: "number" },
    estimatedBiomass: { type: "number" },
  },
  required: ["meanMass", "estimatedBiomass"],
} as const;
/** Scale a supplied cohort sample mean without asserting representativeness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleMass, sampleCount, cohortCount } = request;
  const compute = (): Output => {
    H.domain(sampleMass >= 0);
    H.integer(sampleCount, 1);
    H.integer(cohortCount, sampleCount);
    return {
      meanMass: sampleMass / sampleCount,
      estimatedBiomass: (sampleMass / sampleCount) * cohortCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleMass: 12, sampleCount: 4, cohortCount: 100 },
  output: { meanMass: 3, estimatedBiomass: 300 },
} satisfies ToolExample<Input, Output>;
export const cohortBiomassSampleFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaculture/cohort-biomass-sample-factor",
    title: "Cohort Biomass Sample Factor Tool",
    description:
      "Scale a supplied cohort sample mean without asserting representativeness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleMass: { type: "number", minimum: 0 },
        sampleCount: { type: "integer", minimum: 1 },
        cohortCount: { type: "integer" },
      },
      required: ["sampleMass", "sampleCount", "cohortCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meanMass: { type: "number" },
        estimatedBiomass: { type: "number" },
      },
      required: ["meanMass", "estimatedBiomass"],
    },
    ports: {
      inputs: [
        {
          id: "sampleMass",
          label: "Sample Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleCount",
          label: "Sample Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cohortCount",
          label: "Cohort Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "meanMass", label: "Mean Mass", valueType: { type: "number" } },
        {
          id: "estimatedBiomass",
          label: "Estimated Biomass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cohortBiomassSampleFactorTool.execute;
export default cohortBiomassSampleFactorTool;
