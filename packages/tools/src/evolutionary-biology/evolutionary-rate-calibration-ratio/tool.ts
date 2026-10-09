import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly branchSubstitutionsPerSite: number;
  readonly elapsedGenerations: number;
};
export type Output = { readonly substitutionsPerSitePerGeneration: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    branchSubstitutionsPerSite: { type: "number", minimum: 0 },
    elapsedGenerations: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["branchSubstitutionsPerSite", "elapsedGenerations"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { substitutionsPerSitePerGeneration: { type: "number" } },
  required: ["substitutionsPerSitePerGeneration"],
} as const;
/** Divide an explicit branch length by supplied generations without fitting a molecular clock. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { branchSubstitutionsPerSite, elapsedGenerations } = request;
  const compute = (): Output => {
    H.domain(branchSubstitutionsPerSite >= 0, "branchSubstitutionsPerSite");
    (H.domain(elapsedGenerations > 0, "elapsedGenerations"),
      elapsedGenerations);
    return {
      substitutionsPerSitePerGeneration:
        branchSubstitutionsPerSite / elapsedGenerations,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { branchSubstitutionsPerSite: 0.02, elapsedGenerations: 1000 },
  output: { substitutionsPerSitePerGeneration: 0.00002 },
} satisfies ToolExample<Input, Output>;
export const evolutionaryRateCalibrationRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["evolutionary-biology", "evolutionary biology", "biology"],
      keywords: ["evolutionary biology", "biology"],
    },
    id: "evolutionary-biology/evolutionary-rate-calibration-ratio",
    title: "Evolutionary Rate Calibration Ratio",
    description:
      "Divide an explicit branch length by supplied generations without fitting a molecular clock.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        branchSubstitutionsPerSite: { type: "number", minimum: 0 },
        elapsedGenerations: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["branchSubstitutionsPerSite", "elapsedGenerations"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { substitutionsPerSitePerGeneration: { type: "number" } },
      required: ["substitutionsPerSitePerGeneration"],
    },
    ports: {
      inputs: [
        {
          id: "branchSubstitutionsPerSite",
          label: "Branch Substitutions Per Site",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedGenerations",
          label: "Elapsed Generations",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "substitutionsPerSitePerGeneration",
          label: "Substitutions Per Site Per Generation",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = evolutionaryRateCalibrationRatioTool.execute;
export default evolutionaryRateCalibrationRatioTool;
