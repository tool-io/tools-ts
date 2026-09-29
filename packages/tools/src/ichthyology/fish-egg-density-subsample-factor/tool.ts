import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eggs: number;
  readonly countedVolume: number;
  readonly totalVolume: number;
  readonly filteredWaterVolume: number;
};
export type Output = {
  readonly expandedEggs: number;
  readonly eggsPerWaterVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eggs: { type: "integer", minimum: 0 },
    countedVolume: { type: "number", exclusiveMinimum: 0 },
    totalVolume: { type: "number" },
    filteredWaterVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["eggs", "countedVolume", "totalVolume", "filteredWaterVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expandedEggs: { type: "number" },
    eggsPerWaterVolume: { type: "number" },
  },
  required: ["expandedEggs", "eggsPerWaterVolume"],
} as const;
/** Homogeneous sample-volume expansion followed by independently measured filtered-water volume normalization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eggs, countedVolume, totalVolume, filteredWaterVolume } = request;
  const compute = (): Output => {
    H.integer(eggs, 0);
    H.positive(countedVolume);
    H.domain(totalVolume >= countedVolume);
    H.positive(filteredWaterVolume);
    return {
      expandedEggs: (eggs * totalVolume) / countedVolume,
      eggsPerWaterVolume:
        (eggs * totalVolume) / (countedVolume * filteredWaterVolume),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eggs: 50,
    countedVolume: 5,
    totalVolume: 100,
    filteredWaterVolume: 20,
  },
  output: { expandedEggs: 1000, eggsPerWaterVolume: 50 },
} satisfies ToolExample<Input, Output>;
export const fishEggDensitySubsampleFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ichthyology/fish-egg-density-subsample-factor",
    title: "Fish Egg Density Subsample Factor Tool",
    description:
      "Homogeneous sample-volume expansion followed by independently measured filtered-water volume normalization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eggs: { type: "integer", minimum: 0 },
        countedVolume: { type: "number", exclusiveMinimum: 0 },
        totalVolume: { type: "number" },
        filteredWaterVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["eggs", "countedVolume", "totalVolume", "filteredWaterVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expandedEggs: { type: "number" },
        eggsPerWaterVolume: { type: "number" },
      },
      required: ["expandedEggs", "eggsPerWaterVolume"],
    },
    ports: {
      inputs: [
        {
          id: "eggs",
          label: "Eggs",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "countedVolume",
          label: "Counted Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalVolume",
          label: "Total Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "filteredWaterVolume",
          label: "Filtered Water Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expandedEggs",
          label: "Expanded Eggs",
          valueType: { type: "number" },
        },
        {
          id: "eggsPerWaterVolume",
          label: "Eggs Per Water Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fishEggDensitySubsampleFactorTool.execute;
export default fishEggDensitySubsampleFactorTool;
