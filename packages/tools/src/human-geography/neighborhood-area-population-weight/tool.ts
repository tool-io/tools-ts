import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly neighborhoodPopulation: number;
  readonly regionPopulation: number;
};
export type Output = { readonly populationWeight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    neighborhoodPopulation: { type: "integer", minimum: 0 },
    regionPopulation: { type: "integer", minimum: 1 },
  },
  required: ["neighborhoodPopulation", "regionPopulation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { populationWeight: { type: "number" } },
  required: ["populationWeight"],
} as const;
/** Calculate a neighborhood population weight relative to a supplied containing-region population without assuming uniform density. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { neighborhoodPopulation, regionPopulation } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(regionPopulation) &&
        regionPopulation >= 1 &&
        regionPopulation <= Number.MAX_SAFE_INTEGER,
      "regionPopulation",
    ),
      regionPopulation);
    (H.domain(
      Number.isSafeInteger(neighborhoodPopulation) &&
        neighborhoodPopulation >= 0 &&
        neighborhoodPopulation <= regionPopulation,
      "neighborhoodPopulation",
    ),
      neighborhoodPopulation);
    return { populationWeight: neighborhoodPopulation / regionPopulation };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { neighborhoodPopulation: 1200, regionPopulation: 10000 },
  output: { populationWeight: 0.12 },
} satisfies ToolExample<Input, Output>;
export const neighborhoodAreaPopulationWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["human-geography", "human geography", "social sciences"],
      keywords: ["human geography", "social sciences"],
    },
    id: "human-geography/neighborhood-area-population-weight",
    title: "Neighborhood Area Population Weight",
    description:
      "Calculate a neighborhood population weight relative to a supplied containing-region population without assuming uniform density.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        neighborhoodPopulation: { type: "integer", minimum: 0 },
        regionPopulation: { type: "integer", minimum: 1 },
      },
      required: ["neighborhoodPopulation", "regionPopulation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { populationWeight: { type: "number" } },
      required: ["populationWeight"],
    },
    ports: {
      inputs: [
        {
          id: "neighborhoodPopulation",
          label: "Neighborhood Population",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "regionPopulation",
          label: "Region Population",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "populationWeight",
          label: "Population Weight",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = neighborhoodAreaPopulationWeightTool.execute;
export default neighborhoodAreaPopulationWeightTool;
