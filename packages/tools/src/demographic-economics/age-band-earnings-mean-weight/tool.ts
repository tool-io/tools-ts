import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bandMeanEarnings: number;
  readonly bandPopulation: number;
  readonly totalPopulation: number;
};
export type Output = {
  readonly populationShare: number;
  readonly weightedMeanContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bandMeanEarnings: { type: "number" },
    bandPopulation: { type: "integer", minimum: 0 },
    totalPopulation: { type: "integer", minimum: 1 },
  },
  required: ["bandMeanEarnings", "bandPopulation", "totalPopulation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    populationShare: { type: "number" },
    weightedMeanContribution: { type: "number" },
  },
  required: ["populationShare", "weightedMeanContribution"],
} as const;
/** Compute one age band’s contribution to a population-weighted earnings mean from supplied mean and compatible counts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bandMeanEarnings, bandPopulation, totalPopulation } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(totalPopulation) &&
        totalPopulation >= 1 &&
        totalPopulation <= Number.MAX_SAFE_INTEGER,
      "totalPopulation",
    ),
      totalPopulation);
    (H.domain(
      Number.isSafeInteger(bandPopulation) &&
        bandPopulation >= 0 &&
        bandPopulation <= totalPopulation,
      "bandPopulation",
    ),
      bandPopulation);
    return {
      populationShare: bandPopulation / totalPopulation,
      weightedMeanContribution:
        (bandMeanEarnings * bandPopulation) / totalPopulation,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    bandMeanEarnings: 30000,
    bandPopulation: 200,
    totalPopulation: 1000,
  },
  output: { populationShare: 0.2, weightedMeanContribution: 6000 },
} satisfies ToolExample<Input, Output>;
export const ageBandEarningsMeanWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["demographic-economics", "demographic economics", "economics"],
      keywords: ["demographic economics", "economics"],
    },
    id: "demographic-economics/age-band-earnings-mean-weight",
    title: "Age Band Earnings Mean Weight",
    description:
      "Compute one age band’s contribution to a population-weighted earnings mean from supplied mean and compatible counts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bandMeanEarnings: { type: "number" },
        bandPopulation: { type: "integer", minimum: 0 },
        totalPopulation: { type: "integer", minimum: 1 },
      },
      required: ["bandMeanEarnings", "bandPopulation", "totalPopulation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        populationShare: { type: "number" },
        weightedMeanContribution: { type: "number" },
      },
      required: ["populationShare", "weightedMeanContribution"],
    },
    ports: {
      inputs: [
        {
          id: "bandMeanEarnings",
          label: "Band Mean Earnings",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bandPopulation",
          label: "Band Population",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "totalPopulation",
          label: "Total Population",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "populationShare",
          label: "Population Share",
          valueType: { type: "number" },
        },
        {
          id: "weightedMeanContribution",
          label: "Weighted Mean Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = ageBandEarningsMeanWeightTool.execute;
export default ageBandEarningsMeanWeightTool;
