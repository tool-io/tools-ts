import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly countedSeeds: number;
  readonly sampleMass: number;
  readonly totalMass: number;
};
export type Output = {
  readonly expansionWeight: number;
  readonly expandedSeedEquivalent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countedSeeds: { type: "integer", minimum: 0 },
    sampleMass: { type: "number", exclusiveMinimum: 0 },
    totalMass: { type: "number" },
  },
  required: ["countedSeeds", "sampleMass", "totalMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expansionWeight: { type: "number" },
    expandedSeedEquivalent: { type: "number" },
  },
  required: ["expansionWeight", "expandedSeedEquivalent"],
} as const;
/** Expand a supplied seed sample under an explicit representative-mass assumption without predicting germination. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { countedSeeds, sampleMass, totalMass } = request;
  const compute = (): Output => {
    H.integer(countedSeeds, 0);
    H.positive(sampleMass);
    H.domain(totalMass >= sampleMass);
    return {
      expansionWeight: totalMass / sampleMass,
      expandedSeedEquivalent: (countedSeeds * totalMass) / sampleMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { countedSeeds: 50, sampleMass: 10, totalMass: 100 },
  output: { expansionWeight: 10, expandedSeedEquivalent: 500 },
} satisfies ToolExample<Input, Output>;
export const seedCountSubsamplingWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "botany/seed-count-subsampling-weight",
    title: "Seed Count Subsampling Weight Tool",
    description:
      "Expand a supplied seed sample under an explicit representative-mass assumption without predicting germination.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countedSeeds: { type: "integer", minimum: 0 },
        sampleMass: { type: "number", exclusiveMinimum: 0 },
        totalMass: { type: "number" },
      },
      required: ["countedSeeds", "sampleMass", "totalMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expansionWeight: { type: "number" },
        expandedSeedEquivalent: { type: "number" },
      },
      required: ["expansionWeight", "expandedSeedEquivalent"],
    },
    ports: {
      inputs: [
        {
          id: "countedSeeds",
          label: "Counted Seeds",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sampleMass",
          label: "Sample Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalMass",
          label: "Total Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expansionWeight",
          label: "Expansion Weight",
          valueType: { type: "number" },
        },
        {
          id: "expandedSeedEquivalent",
          label: "Expanded Seed Equivalent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = seedCountSubsamplingWeightTool.execute;
export default seedCountSubsamplingWeightTool;
